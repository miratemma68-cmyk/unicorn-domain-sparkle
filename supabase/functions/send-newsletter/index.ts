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

interface NewsletterRequest {
  news: string[];
}

// Determine language from country
const getLanguageFromCountry = (country: string | null): 'fr' | 'en' | 'es' => {
  if (!country) return 'en';
  
  const countryLower = country.toLowerCase();
  
  // Spanish speaking countries
  if (countryLower.includes('spain') || countryLower.includes('españa') || 
      countryLower.includes('espagne') || countryLower.includes('mexico') || 
      countryLower.includes('argentina') || countryLower.includes('colombia') ||
      countryLower.includes('chile') || countryLower.includes('peru')) {
    return 'es';
  }
  
  // French speaking countries
  if (countryLower.includes('france') || countryLower.includes('francia') ||
      countryLower.includes('belgique') || countryLower.includes('belgium') ||
      countryLower.includes('suisse') || countryLower.includes('switzerland') ||
      countryLower.includes('luxembourg') || countryLower.includes('monaco') ||
      countryLower.includes('canada')) {
    return 'fr';
  }
  
  // Default to English
  return 'en';
};

// Generate newsletter content using Lovable AI
const generateNewsletterContent = async (news: string[], language: 'fr' | 'en' | 'es'): Promise<string> => {
  const languageNames = {
    fr: 'French',
    en: 'English',
    es: 'Spanish'
  };

  const prompt = `You are a professional content writer for "Le Domaine des Licornes", a prestigious Ragdoll cat breeding cattery.

Write a warm, engaging newsletter in ${languageNames[language]} based on these 3 news items:
1. ${news[0]}
2. ${news[1]}
3. ${news[2]}

Guidelines:
- Write in a friendly, elegant tone suitable for cat lovers
- Keep each news item to 2-3 sentences
- Add a brief introduction greeting
- Add a warm closing message
- DO NOT include any HTML tags, only plain text content
- Keep the total content to about 250-300 words

Return ONLY the newsletter content text, nothing else.`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating content with AI:', error);
    // Fallback to simple content
    return `${news[0]}\n\n${news[1]}\n\n${news[2]}`;
  }
};

// Create HTML email template (similar to contact email)
const createEmailHtml = (content: string, name: string, language: 'fr' | 'en' | 'es'): string => {
  const unicornImageUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/domain-gallery/1763650988576_Dame_Licorne-Mon_seul_d_sir-Zoom.jpg`;
  
  const translations = {
    fr: {
      title: "Newsletter - Le Domaine des Licornes",
      greeting: "Bonjour",
      footer: "Élevage de Ragdolls • Le Domaine des Licornes"
    },
    en: {
      title: "Newsletter - Le Domaine des Licornes",
      greeting: "Hello",
      footer: "Ragdoll Breeding • Le Domaine des Licornes"
    },
    es: {
      title: "Newsletter - Le Domaine des Licornes",
      greeting: "Hola",
      footer: "Criador de Ragdolls • Le Domaine des Licornes"
    }
  };

  const t = translations[language];
  
  // Split content by double newlines to create paragraphs
  const paragraphs = content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

  return `
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
              ${t.title}
            </h1>
          </div>
          <div class="content">
            <p>${t.greeting} <span class="highlight">${name}</span>,</p>
            ${paragraphs}
          </div>
          <div class="footer">
            <p>${t.footer}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { news }: NewsletterRequest = await req.json();

    if (!news || news.length !== 3) {
      throw new Error("Exactly 3 news items are required");
    }

    console.log("Starting newsletter generation and send process...");

    // Fetch all contacts
    const { data: contacts, error: contactsError } = await supabase
      .from('contact_inquiries')
      .select('name, email, country');

    if (contactsError) throw contactsError;

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, recipientCount: 0, message: "No contacts found" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${contacts.length} contacts to send newsletter to`);

    // Group contacts by language
    const contactsByLanguage: { [key: string]: typeof contacts } = {
      fr: [],
      en: [],
      es: []
    };

    contacts.forEach(contact => {
      const language = getLanguageFromCountry(contact.country);
      contactsByLanguage[language].push(contact);
    });

    console.log(`Language distribution: FR=${contactsByLanguage.fr.length}, EN=${contactsByLanguage.en.length}, ES=${contactsByLanguage.es.length}`);

    // Generate content for each language
    const contentByLanguage: { [key: string]: string } = {};
    for (const lang of ['fr', 'en', 'es'] as const) {
      if (contactsByLanguage[lang].length > 0) {
        console.log(`Generating ${lang} content...`);
        contentByLanguage[lang] = await generateNewsletterContent(news, lang);
      }
    }

    // Send emails
    let successCount = 0;
    let errorCount = 0;

    for (const contact of contacts) {
      try {
        const language = getLanguageFromCountry(contact.country);
        const content = contentByLanguage[language];
        const emailHtml = createEmailHtml(content, contact.name, language);

        const subject = language === 'fr' 
          ? "Nouvelles du Domaine des Licornes 🦄"
          : language === 'es'
          ? "Noticias de Le Domaine des Licornes 🦄"
          : "News from Le Domaine des Licornes 🦄";

        await resend.emails.send({
          from: "Le Domaine des Licornes <onboarding@resend.dev>",
          to: [contact.email],
          subject: subject,
          html: emailHtml,
        });

        successCount++;
        console.log(`Email sent to ${contact.email} (${language})`);
      } catch (error) {
        console.error(`Failed to send to ${contact.email}:`, error);
        errorCount++;
      }
    }

    console.log(`Newsletter sending completed: ${successCount} successful, ${errorCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        recipientCount: successCount,
        failedCount: errorCount 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error.message, error.stack);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send newsletter" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
