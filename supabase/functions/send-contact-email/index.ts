import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5; // 5 submissions per hour per IP

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  message: string;
  language: 'fr' | 'en' | 'es';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    console.log("Contact form submission from IP:", clientIP);

    // Check rate limit by IP address
    const { data: rateLimitData } = await supabase
      .from('contact_inquiries')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString())
      .eq('ip_address', clientIP)
      .limit(MAX_REQUESTS_PER_WINDOW + 1);

    const recentSubmissions = rateLimitData?.length || 0;

    if (recentSubmissions >= MAX_REQUESTS_PER_WINDOW) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, phone, country, message, language = 'fr' }: ContactEmailRequest = await req.json();

    // Validate inputs
    if (!name || name.trim().length === 0 || name.length > 100) {
      throw new Error("Invalid name");
    }
    if (!email || !email.includes("@") || email.length > 255) {
      throw new Error("Invalid email");
    }
    if (!message || message.trim().length === 0 || message.length > 2000) {
      throw new Error("Invalid message");
    }
    if (phone && phone.length > 20) {
      throw new Error("Invalid phone");
    }
    if (country && country.length > 100) {
      throw new Error("Invalid country");
    }

    // Record inquiry with IP for accurate rate limiting (before sending, so the
    // insert id can dedupe email retries)
    let inquiryId: string | null = null;
    try {
      const { data: inserted, error: insertError } = await supabase
        .from('contact_inquiries')
        .insert({
          name,
          email,
          phone: phone || null,
          country: country || null,
          message,
          ip_address: clientIP,
        })
        .select('id')
        .single();
      if (insertError) {
        console.error("Failed to record inquiry:", insertError.message);
      } else {
        inquiryId = inserted?.id ?? null;
      }
    } catch (insertErr: any) {
      console.error("Failed to record inquiry:", insertErr.message);
    }

    const dedupeBase = inquiryId || `${clientIP}-${Date.now()}`;

    // Send confirmation email to the visitor (in their language)
    console.log("Sending confirmation email to:", email, "in language:", language);
    try {
      const result = await sendTemplateEmail('contact-confirmation', email, {
        templateData: { name, message, phone, country, email, language },
        idempotencyKey: `contact-confirmation-${dedupeBase}`,
      });
      if (!result.sent) {
        console.log("Confirmation email suppressed for:", email, "reason:", result.reason);
      } else {
        console.log("Confirmation email sent to:", email);
      }
    } catch (sendErr: any) {
      console.error("Failed to send confirmation email:", sendErr?.code || '', sendErr.message);
    }

    // Send notification to the admin (Laurence)
    try {
      const adminResult = await sendTemplateEmail('contact-admin-notification', 'Laurence.Pouyaud@orange.fr', {
        templateData: { name, email, phone, country, language, message },
        idempotencyKey: `contact-admin-${dedupeBase}`,
        replyTo: email,
      });
      if (!adminResult.sent) {
        console.log("Admin notification suppressed, reason:", adminResult.reason);
      } else {
        console.log("Admin notification sent");
      }
    } catch (adminErr: any) {
      console.error("Failed to send admin notification:", adminErr?.code || '', adminErr.message);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
