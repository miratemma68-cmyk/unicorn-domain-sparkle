import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tapestrySight from "@/assets/tapestry-sight.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface FAQ {
  id: string;
  question: string;
  question_en: string | null;
  question_es: string | null;
  answer: string;
  answer_en: string | null;
  answer_es: string | null;
  display_order: number;
}

export const FAQSection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error loading FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedText = (textFr: string, textEn: string | null, textEs: string | null) => {
    if (language === 'en' && textEn) return textEn;
    if (language === 'es' && textEs) return textEs;
    return textFr;
  };

  return (
    <section id="faq" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestrySight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-8 border-gold text-gold hover:bg-gold/10 rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
        
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-8">
            {t('faq.title')}
          </h2>
          
          {loading ? (
            <div className="text-center py-8 text-gold">Chargement...</div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-8 text-gold">Aucune question disponible</div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border border-gold/30 rounded-[2rem] px-6 bg-card/40 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-left text-gold hover:text-gold-light font-display text-lg">
                    {getTranslatedText(faq.question, faq.question_en, faq.question_es)}
                  </AccordionTrigger>
                  <AccordionContent className="text-ivory/80 leading-relaxed">
                    {getTranslatedText(faq.answer, faq.answer_en, faq.answer_es)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
};
