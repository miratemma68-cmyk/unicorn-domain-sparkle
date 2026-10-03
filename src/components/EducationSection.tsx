import { useEffect, useState } from "react";
import tapestrySmell from "@/assets/education-kittens-sunset.jpg.asset.json";
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
        <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-12">
          {t('education.title')}
        </h2>

        {/* Introduction Section */}
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <img 
                src={tapestrySmell.url} 
                alt="La Dame à la Licorne - L'Odorat" 
                className="w-full rounded-[3rem] tapestry-border shadow-2xl"
              />
            </div>
            
            <div className="space-y-6 text-ivory/90 order-1 md:order-2">
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
              
              <p className="text-lg leading-relaxed italic">
                {t('education.conclusion')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};