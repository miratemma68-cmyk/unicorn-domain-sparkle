import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.2.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message }: ContactEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

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
              <h1>🦄 Le Domaine des Licornes</h1>
            </div>
            <div class="content">
              <p>Bonjour <span class="highlight">${name}</span>,</p>
              
              <p>Nous avons bien reçu votre message et nous vous en remercions.</p>
              
              <p>Notre équipe prendra connaissance de votre demande et vous répondra dans les plus brefs délais.</p>
              
              <p>Votre message :<br>
              <em>"${message.substring(0, 200)}${message.length > 200 ? "..." : ""}"</em></p>
              
              ${phone ? `<p>Nous vous contacterons ${phone ? `au ${phone} ou ` : ""}à l'adresse ${email}.</p>` : ""}
              
              <p>À très bientôt,<br>
              <strong>L'équipe du Domaine des Licornes</strong></p>
            </div>
            <div class="footer">
              <p>Élevage de Ragdolls • Le Domaine des Licornes</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Le Domaine des Licornes <onboarding@resend.dev>",
      to: [email],
      subject: "Confirmation de votre message - Le Domaine des Licornes 🦄",
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

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
    console.error("Error in send-contact-email function:", error);
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
