import { useEffect, useState } from "react";
import tapestryHearing from "@/assets/tapestry-hearing.jpg";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle } from "lucide-react";
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
        <div className="tapestry-border litter-frame bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="space-y-8 text-ivory/90 pt-12 md:pt-16 pb-6 md:pb-12">
            <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
              {t('adoption.intro')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3">
                <div className="w-32 h-32 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-6xl text-gold font-display">1</span>
                </div>
                <h3 className="text-2xl font-display text-gold">{t('adoption.step1Title')}</h3>
                <p className="whitespace-pre-line">{t('adoption.step1Desc')}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-32 h-32 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-6xl text-gold font-display">2</span>
                </div>
                <h3 className="text-2xl font-display text-gold">{t('adoption.step2Title')}</h3>
                <p className="whitespace-pre-line">{t('adoption.step2Desc')}</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-32 h-32 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-6xl text-gold font-display">3</span>
                </div>
                <h3 className="text-2xl font-display text-gold">{t('adoption.step3Title')}</h3>
                <p className="whitespace-pre-line">{t('adoption.step3Desc')}</p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="ornate-btn-navy group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(218,165,32,0.5)]"
              >
                <Heart className="w-5 h-5 text-gold transition-transform duration-300 group-hover:scale-110" />
                <span className="font-display text-3xl text-gold pt-1 whitespace-nowrap">
                  {t('adoption.startAdoption')}
                </span>
              </a>
            </div>

            <div className="bg-crimson/20 border border-gold/30 rounded-[2rem] px-6 py-5 md:px-8 mt-8 mb-8 max-w-2xl mx-auto w-full">
              <h3 className="text-xl md:text-2xl font-display text-gold mb-3 text-center">{t('adoption.whatYouGet')}</h3>
              <ul className="grid md:grid-cols-2 gap-2.5 text-[0.95rem] md:text-base">
                <li className="flex items-start justify-center gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit1')}</span>
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit2')}</span>
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit3')}</span>
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit4')}</span>
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit5')}</span>
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="text-gold">✦</span>
                  <span>{t('adoption.benefit6')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};