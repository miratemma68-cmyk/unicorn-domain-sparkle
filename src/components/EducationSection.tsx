import { useEffect, useState } from "react";
import kittensFlowers from "@/assets/education-kittens-flowers.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface EducationMedia {
  id: string;
  media_type: string;
  file_url: string;
  caption: string | null;
  caption_en: string | null;
  caption_es: string | null;
}

export const EducationSection = () => {
  const [educationMedia, setEducationMedia] = useState<EducationMedia[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadEducationMedia();
  }, []);

  const loadEducationMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('education_media')
        .select('id, media_type, file_url, caption, caption_en, caption_es')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setEducationMedia(data || []);
    } catch (error) {
      console.error('Error loading education media:', error);
    }
  };

  const getTranslatedCaption = (item: EducationMedia) => {
    if (language === 'en' && item.caption_en) return item.caption_en;
    if (language === 'es' && item.caption_es) return item.caption_es;
    return item.caption || '';
  };

  return (
    <section id="education" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-gold medieval-glow text-center mb-12 break-words">
          {t('education.title')}
        </h2>

        {/* Introduction Section */}
        <div className="tapestry-border litter-frame bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="grid md:grid-cols-2 md:gap-4 gap-8 items-center">
            <div className="relative order-2 md:order-1 flex items-center justify-center py-6 md:py-10">
              <div className="tapestry-oval mx-auto aspect-[2/3] w-full max-w-[17rem] md:max-w-xs">
                <img 
                  src={kittensFlowers.url} 
                  alt="Chatons Ragdoll jouant parmi les fleurs au coucher du soleil" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="space-y-6 text-ivory/90 order-1 md:order-2 md:pr-16 lg:pr-24">


              <p className="text-lg leading-relaxed">
                {t('education.intro')}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-display text-gold">{t('education.method')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('education.method1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('education.method2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('education.method3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('education.method4')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('education.method5')}</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-lg leading-relaxed italic text-gold">
                {t('education.conclusion')}
              </p>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};