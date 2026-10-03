import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface DomainMedia {
  id: string;
  media_type: string;
  file_url: string;
  caption: string | null;
  caption_en: string | null;
  caption_es: string | null;
}

export const PreviousLittersSection = () => {
  const [galleryMedia, setGalleryMedia] = useState<DomainMedia[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadGalleryMedia();
  }, []);

  const loadGalleryMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('domain_gallery')
        .select('id, media_type, file_url, caption, caption_en, caption_es')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setGalleryMedia((data || []).filter((item) => !/Dame_Licorne|Logo Email/i.test(item.file_url + ' ' + (item.caption || ''))));
    } catch (error) {
      console.error('Error loading gallery media:', error);
    }
  };

  const getTranslatedCaption = (item: DomainMedia) => {
    if (language === 'en' && item.caption_en) return item.caption_en;
    if (language === 'es' && item.caption_es) return item.caption_es;
    return item.caption || '';
  };

  return (
    <section id="galerie-domaine" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('domain.previousLittersTitle')}
          </h3>

          {galleryMedia.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {galleryMedia.map((item) => (
                <div
                  key={item.id}
                  className="aspect-square overflow-hidden tapestry-border bg-midnight/30 group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                    {item.media_type === 'video' ? (
                      <video
                        src={item.file_url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={item.file_url}
                        alt={getTranslatedCaption(item) || "Photo"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-square overflow-hidden tapestry-border bg-midnight/30 flex items-center justify-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden flex items-center justify-center">
                    <span className="text-gold/30 text-4xl group-hover:text-gold/50 transition-colors">✦</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {galleryMedia.length === 0 && (
            <p className="text-center text-ivory/60 mt-8 italic">
              {t('domain.galleryEmpty')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
