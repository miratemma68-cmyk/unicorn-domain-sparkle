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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require an authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { testimonial_id } = await req.json();
    if (!testimonial_id || typeof testimonial_id !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid testimonial_id" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Load the testimonial and verify it belongs to the caller and is pending
    const { data: testimonial, error: fetchError } = await supabase
      .from('client_testimonials')
      .select('id, client_id, author_name, message, photo_url, status')
      .eq('id', testimonial_id)
      .maybeSingle();

    if (fetchError || !testimonial) {
      return new Response(JSON.stringify({ error: "Testimonial not found" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (testimonial.client_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    if (testimonial.status !== 'pending') {
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const result = await sendTemplateEmail('testimonial-admin-notification', 'Laurence.Pouyaud@orange.fr', {
      templateData: {
        authorName: testimonial.author_name,
        message: testimonial.message,
        hasPhoto: !!testimonial.photo_url,
      },
      idempotencyKey: `testimonial-notify-${testimonial.id}`,
    });

    if (!result.sent) {
      console.log("Testimonial notification suppressed, reason:", result.reason);
    } else {
      console.log("Testimonial notification sent for:", testimonial.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in testimonial-notification function:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message || "Failed to send notification" }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
