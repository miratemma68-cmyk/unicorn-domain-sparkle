import { useEffect, useState } from "react";
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