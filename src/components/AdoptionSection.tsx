import { useEffect, useState } from "react";
import tapestryHearing from "@/assets/tapestry-hearing.jpg";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialMedia {
  id: string;
  media_type: string;
  file_url: string;
  caption: string | null;
  caption_en: string | null;
  caption_es: string | null;
}

export const AdoptionSection = () => {
  const [testimonialsMedia, setTestimonialsMedia] = useState<TestimonialMedia[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    loadTestimonialsMedia();
  }, []);

  const loadTestimonialsMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials_media')
        .select('id, media_type, file_url, caption, caption_en, caption_es')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTestimonialsMedia(data || []);
    } catch (error) {
      console.error('Error loading testimonials media:', error);
    }
  };

  const getTranslatedCaption = (item: TestimonialMedia) => {
    if (language === 'en' && item.caption_en) return item.caption_en;
    if (language === 'es' && item.caption_es) return item.caption_es;
    return item.caption || '';
  };

  return (
    <section id="adoption" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestryHearing})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-12">
          {t('adoption.title')}
        </h2>

        {/* Main Section */}
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="space-y-8 text-ivory/90">
            <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
              {t('adoption.intro')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold font-display">1</span>
                </div>
                <h3 className="text-xl font-display text-gold">{t('adoption.step1Title')}</h3>
                <p>{t('adoption.step1Desc')}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold font-display">2</span>
                </div>
                <h3 className="text-xl font-display text-gold">{t('adoption.step2Title')}</h3>
                <p>{t('adoption.step2Desc')}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold font-display">3</span>
                </div>
                <h3 className="text-xl font-display text-gold">{t('adoption.step3Title')}</h3>
                <p>{t('adoption.step3Desc')}</p>
              </div>
            </div>
            
            <div className="bg-crimson/20 border border-gold/30 rounded-[2rem] p-6 mt-12">
              <h3 className="text-2xl font-display text-gold mb-4">{t('adoption.whatYouGet')}</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit5')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit6')}</span>
                </li>
              </ul>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                asChild
                className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold"
              >
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <Heart className="w-4 h-4" />
                  {t('adoption.startAdoption')}
                </a>
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="border-2 border-gold text-gold hover:bg-gold/10"
              >
                <a
                  href="#clients-racontent"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('clients-racontent')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  {t('adoption.clientTestimonials')}
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Nos clients racontent */}
        <div id="clients-racontent" className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 mt-12">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('adoption.clientTestimonials')}
          </h3>
          
          {testimonialsMedia.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialsMedia.map((item) => (
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
                      alt={getTranslatedCaption(item) || "Témoignage client"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          {testimonialsMedia.length === 0 && (
            <p className="text-center text-ivory/60 mt-8 italic">
              Photos et vidéos à venir...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};