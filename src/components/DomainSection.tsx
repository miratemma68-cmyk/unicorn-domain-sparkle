import { useEffect, useState } from "react";
import tapestryTouch from "@/assets/tapestry-touch.jpg";
import ragdollOrigins from "@/assets/ragdoll-origins.jpg";
import laurenceProfile from "@/assets/laurence-profile.jpg";
import { supabase } from "@/integrations/supabase/client";
import { User, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface DomainMedia {
  id: string;
  media_type: string;
  file_url: string;
  caption: string | null;
  caption_en: string | null;
  caption_es: string | null;
}

export const DomainSection = () => {
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
      setGalleryMedia(data || []);
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
    <section id="domaine" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestryTouch})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-12">
          {t('domain.title')}
        </h2>

        {/* Introduction Section */}
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-ivory/90">
              <p className="text-lg leading-relaxed">
                {t('domain.intro1')}
              </p>
              
              <p className="text-lg leading-relaxed">
                {t('domain.intro2')}
              </p>
              
              <p className="text-lg leading-relaxed">
                {t('domain.healthTesting')}
              </p>
              
              
              <div className="space-y-4 mt-8">
                <h3 className="text-2xl font-display text-gold">{t('domain.values')}</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('domain.value1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('domain.value2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('domain.value3')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>{t('domain.value4')}</span>
                  </li>
                </ul>
              </div>

            </div>
            
            <div className="relative">
              <img 
                src={tapestryTouch} 
                alt="La Dame à la Licorne - Le Toucher" 
                className="w-full rounded-[3rem] tapestry-border shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Ragdoll, origines */}
        <div id="ragdoll-origines" className="mt-16 scroll-mt-32">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-12">
            {t('domain.ragdollOriginsTitle')}
          </h2>
          <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative rounded-[3rem] overflow-hidden tapestry-border">
                <img
                  src={ragdollOrigins}
                  alt="Ragdoll - Origines de la race"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6 text-ivory/90">
                <p className="text-lg leading-relaxed">{t('domain.ragdollOriginsP1')}</p>
                <p className="text-lg leading-relaxed">{t('domain.ragdollOriginsP2')}</p>
                <p className="text-lg leading-relaxed">{t('domain.ragdollOriginsP3')}</p>
                <p className="text-lg leading-relaxed">{t('domain.ragdollOriginsP4')}</p>
                <p className="text-lg leading-relaxed">{t('domain.ragdollOriginsP5')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Laurence notre éleveuse */}
        <div id="laurence" className="mt-16 scroll-mt-32">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-12">
            {t('domain.laurenceTitle')}
          </h2>
          <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-ivory/90">
              <p className="text-lg leading-relaxed">
                {t('domain.laurenceP1')}
              </p>
              
              <p className="text-lg leading-relaxed">
                {t('domain.laurenceP2')}
              </p>

              <ul className="space-y-2 text-lg leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-gold text-2xl leading-none">✦</span>
                  <span>{t('domain.laurenceCred1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-2xl leading-none">✦</span>
                  <span>{t('domain.laurenceCred2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-2xl leading-none">✦</span>
                  <span>{t('domain.laurenceCred3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold text-2xl leading-none">✦</span>
                  <span>{t('domain.laurenceCred4')}</span>
                </li>
              </ul>
              
              
              <p className="text-lg leading-relaxed italic text-gold/80">
                "{t('domain.laurenceQuote')}"
              </p>
            </div>
            
            <div className="relative rounded-[3rem] overflow-hidden tapestry-border">
              <img 
                src={laurenceProfile} 
                alt="Laurence, éleveuse du Domaine des Licornes" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};