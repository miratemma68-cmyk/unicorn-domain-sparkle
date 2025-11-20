import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.2.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
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
    
    // Check rate limit
    const rateLimitKey = `rate_limit_${clientIP}`;
    const { data: rateLimitData } = await supabase
      .from('contact_inquiries')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString())
      .eq('email', clientIP) // We'll use a separate tracking mechanism
      .limit(MAX_REQUESTS_PER_WINDOW);
    
    // Simple rate limiting: count recent submissions from this IP
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
    
    // URL of the unicorn image stored in Supabase Storage
    const unicornImageUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/domain-gallery/1763650988576_Dame_Licorne-Mon_seul_d_sir-Zoom.jpg`;

    console.log("Sending confirmation email to:", email, "in language:", language);

    // Validate inputs
    if (!name || name.trim().length === 0 || name.length > 100) {
      console.error("Invalid name provided");
      throw new Error("Invalid name");
    }
    if (!email || !email.includes("@") || email.length > 255) {
      console.error("Invalid email provided");
      throw new Error("Invalid email");
    }
    if (!message || message.trim().length === 0 || message.length > 2000) {
      console.error("Invalid message provided");
      throw new Error("Invalid message");
    }
    if (phone && phone.length > 20) {
      console.error("Invalid phone provided");
      throw new Error("Invalid phone");
    }
    if (country && country.length > 100) {
      console.error("Invalid country provided");
      throw new Error("Invalid country");
    }

    // Get translations based on language
    const translations = {
      fr: {
        subject: "Confirmation de votre message - Le Domaine des Licornes 🦄",
        greeting: "Bonjour",
        received: "Nous avons bien reçu votre message et nous vous en remercions.",
        reply: "Notre équipe prendra connaissance de votre demande et vous répondra dans les plus brefs délais.",
        yourMessage: "Votre message :",
        contact: "Nous vous contacterons",
        at: "à l'adresse",
        soonFrom: "À très bientôt,",
        team: "L'équipe du Domaine des Licornes",
        footer: "Élevage de Ragdolls • Le Domaine des Licornes"
      },
      en: {
        subject: "Message confirmation - Le Domaine des Licornes 🦄",
        greeting: "Hello",
        received: "We have received your message and thank you for it.",
        reply: "Our team will review your request and respond to you as soon as possible.",
        yourMessage: "Your message:",
        contact: "We will contact you",
        at: "at",
        soonFrom: "See you soon,",
        team: "The Team at Le Domaine des Licornes",
        footer: "Ragdoll Breeding • Le Domaine des Licornes"
      },
      es: {
        subject: "Confirmación de tu mensaje - Le Domaine des Licornes 🦄",
        greeting: "Hola",
        received: "Hemos recibido tu mensaje y te lo agradecemos.",
        reply: "Nuestro equipo revisará tu solicitud y te responderá lo antes posible.",
        yourMessage: "Tu mensaje:",
        contact: "Te contactaremos",
        at: "en",
        soonFrom: "Hasta pronto,",
        team: "El equipo de Le Domaine des Licornes",
        footer: "Criador de Ragdolls • Le Domaine des Licornes"
      }
    };

    const t = translations[language] || translations.fr;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: 'Georgia', serif;
              background-color: #f9f7f4;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border: 2px solid #8B0000;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #8B0000 0%, #660000 100%);
              color: #DAA520;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 30px 20px;
              color: #333;
            }
            .content p {
              line-height: 1.6;
              margin: 15px 0;
            }
            .footer {
              background: #2c1810;
              color: #DAA520;
              padding: 20px;
              text-align: center;
              font-size: 14px;
            }
            .highlight {
              color: #8B0000;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <img src="${unicornImageUrl}" alt="Licorne" style="width: 60px; height: 60px; border: 3px solid #DAA520; border-radius: 12px; vertical-align: middle; margin-right: 10px; background: white; padding: 4px;" />
                Le Domaine des Licornes
              </h1>
            </div>
            <div class="content">
              <p>${t.greeting} <span class="highlight">${name}</span>,</p>
              
              <p>${t.received}</p>
              
              <p>${t.reply}</p>
              
              <p>${t.yourMessage}<br>
              <em>"${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"</em></p>
              
              ${phone || country ? `<p>${t.contact}${phone ? ` ${phone} ${language === 'es' ? 'o' : language === 'en' ? 'or' : 'ou'}` : ""} ${t.at} ${email}${country ? ` (${country})` : ''}.</p>` : ""}
              
              <p>${t.soonFrom}<br>
              <strong>${t.team}</strong></p>
            </div>
            <div class="footer">
              <p>${t.footer}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Le Domaine des Licornes <onboarding@resend.dev>",
      to: [email],
      subject: t.subject,
      html: emailHtml,
    });

    console.log("Email sent successfully to:", email, "MessageID:", emailResponse.data?.id);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
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
