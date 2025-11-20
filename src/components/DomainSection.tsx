import { useEffect, useState } from "react";
import tapestryTouch from "@/assets/tapestry-touch.jpg";
import laurenceProfile from "@/assets/laurence-profile.jpg";
import { supabase } from "@/integrations/supabase/client";
import { User, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
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
        <Link to="/">
          <Button
            variant="outline"
            className="mb-8 border-gold text-gold hover:bg-gold/10 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('nav.domain')}
          </Button>
        </Link>
        
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

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  asChild
                  className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold"
                >
                  <a
                    href="#laurence"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('laurence')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <User className="w-4 h-4" />
                    {t('domain.discoverLaurence')}
                  </a>
                </Button>
                
                <Button 
                  asChild
                  variant="outline"
                  className="border-2 border-gold text-gold hover:bg-gold/10"
                >
                  <a
                    href="#galerie-domaine"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('galerie-domaine')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t('domain.viewGallery')}
                  </a>
                </Button>
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

        {/* Laurence notre éleveuse */}
        <div id="laurence" className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 mt-12">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('domain.laurenceTitle')}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-ivory/90">
              <p className="text-lg leading-relaxed">
                {t('domain.laurenceP1')}
              </p>
              
              <p className="text-lg leading-relaxed">
                {t('domain.laurenceP2')}
              </p>
              
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

        {/* Galerie */}
        <div id="galerie-domaine" className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 mt-12">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('domain.galleryTitle')}
          </h3>
          
          {galleryMedia.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {galleryMedia.map((item) => (
                <div 
                  key={item.id}
                  className="aspect-square rounded-[2rem] overflow-hidden tapestry-border bg-midnight/30 group hover:scale-105 transition-transform duration-300"
                >
                  {item.media_type === 'video' ? (
                    <video
                      src={item.file_url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img 
                      src={item.file_url}
                      alt={getTranslatedCaption(item) || "Photo du domaine"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item}
                  className="aspect-square rounded-[2rem] overflow-hidden tapestry-border bg-midnight/30 flex items-center justify-center group hover:scale-105 transition-transform duration-300"
                >
                  <span className="text-gold/30 text-4xl group-hover:text-gold/50 transition-colors">✦</span>
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