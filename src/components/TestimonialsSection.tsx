import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialMedia {
  id: string;
  media_type: string;
  file_url: string;
  caption: string | null;
  caption_en: string | null;
  caption_es: string | null;
}

export const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const [media, setMedia] = useState<TestimonialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials_media')
        .select('id, media_type, file_url, caption, caption_en, caption_es')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading testimonials media:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedCaption = (item: TestimonialMedia) => {
    if (language === 'en' && item.caption_en) return item.caption_en;
    if (language === 'es' && item.caption_es) return item.caption_es;
    return item.caption || '';
  };

  return (
    <section id="temoignages" className="py-20 px-4 relative">

    </section>
  );
};
