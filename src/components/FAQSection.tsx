import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

    </section>
  );
};
