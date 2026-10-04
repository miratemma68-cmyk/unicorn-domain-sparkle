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

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="tapestry-border litter-frame faq-frame bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 max-w-4xl mx-auto aspect-[4/3] flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-8">
            {t('adoption.clientTestimonials')}
          </h2>


          {loading ? null : media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.5rem] overflow-hidden border-2 border-gold/20 hover:border-gold transition-colors group"
                >
                  {item.media_type === 'video' ? (
                    <video
                      src={item.file_url}
                      controls
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <img
                      src={item.file_url}
                      alt={getTranslatedCaption(item)}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                  {getTranslatedCaption(item) && (
                    <div className="bg-midnight/80 p-2 text-sm text-ivory/80 text-center">
                      {getTranslatedCaption(item)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
