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
  const [quotes, setQuotes] = useState<{ id: string; author_name: string; message: string; photo_url: string | null }[]>([]);

  useEffect(() => {
    loadMedia();
    supabase.from('client_testimonials').select('id, author_name, message, photo_url')
      .eq('status', 'approved').order('created_at', { ascending: false })
      .then(({ data }) => setQuotes(data || []));
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
        <div className="tapestry-border litter-frame faq-frame bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 max-w-4xl mx-auto min-h-[28rem] flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-gold medieval-glow text-center mb-8 break-words">
            {t('adoption.clientTestimonials')}
          </h2>


          {quotes.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 w-full mb-8">
              {quotes.map((q) => (
                <figure key={q.id} className="rounded-[1.5rem] border-2 border-gold/20 bg-midnight/60 p-5 flex gap-4">
                  {q.photo_url && <img src={q.photo_url} alt={q.author_name} loading="lazy" className="w-20 h-20 rounded-full object-cover border-2 border-gold/40 shrink-0" />}
                  <div className="min-w-0">
                    <blockquote className="text-ivory/90 italic text-[1.3125rem] whitespace-pre-line break-words">« {q.message} »</blockquote>
                    <figcaption className="text-gold font-display mt-2 text-[1.5rem]">— {q.author_name}</figcaption>
                  </div>
                </figure>
              ))}
            </div>
          )}

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
