import tapestryDesire from "@/assets/licorne-miroir-hero.jpg.asset.json";
import frameHero from "@/assets/frame/frame-hero.png.asset.json";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-midnight">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left side - Image */}
          <div className="relative order-2 lg:order-1 py-8">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Decorative frame background */}
              <div 
                className="absolute inset-0 rounded-[2.5rem] bg-cover bg-center"
                style={{ backgroundImage: `url(${frameHero.url})` }}
              />
              
              {/* Main image inset within frame */}
              <div className="absolute inset-[6%] rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                <img 
                  src={tapestryDesire.url} 
                  alt="La Dame à la Licorne - Mon seul désir" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="relative z-10 text-center lg:text-left order-1 lg:order-2 space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-gold medieval-glow tracking-wide whitespace-pre-line">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-ivory/90 font-light">
              {t('hero.subtitle')}
            </p>
            
            <p className="text-base md:text-lg text-ivory/70 max-w-xl lg:mx-0 mx-auto italic font-light">
              "{t('hero.tagline')}"
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full hover:scale-105"
                onClick={() => document.getElementById('licornes')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.discoverCats')}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gold text-gold hover:bg-gold/10 hover:text-gold-light transition-all duration-300 rounded-full hover:scale-105"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.contactUs')}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2">
              <span className="text-ivory/80 font-light italic">{t('hero.followUs')}</span>
              <div className="flex flex-col items-center gap-1">
                <a
                  href="https://www.instagram.com/chatterie.licornes?igsh=MWJtM2l4cDhicTU2aA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(225,48,108,0.6)]"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 110%, #ffdd55 0%, #ff543e 25%, #c837ab 50%, #285AEB 100%)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <span className="text-ivory/80 text-sm font-light">Instagram</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <a
                  href="https://www.facebook.com/share/1BJTbYEqPD/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(24,119,242,0.6)]"
                  style={{ background: "#1877F2" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-7 h-7"
                  >
                    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5H17V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.1V10.5H8v3h2.5V21h3z" />
                  </svg>
                </a>
                <span className="text-ivory/80 text-sm font-light">Facebook</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gold" />
      </div>
    </section>
  );
};
