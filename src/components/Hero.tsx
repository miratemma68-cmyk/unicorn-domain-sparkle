import heroFramed from "@/assets/hero-licorne-framed-clean-v2.png.asset.json";
import { ChevronDown, PawPrint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


export const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-midnight">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-[2fr_3fr] gap-8 md:gap-12 items-center">
          
          {/* Left side - Framed image (frame baked into the photo) */}
          <div className="relative order-1 py-8">
            <div className="relative max-w-sm mx-auto md:ml-auto md:mr-0 lg:mr-6">
              <img 
                src={heroFramed.url} 
                alt="La Dame à la Licorne - Mon seul désir" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="relative z-10 text-center md:text-left order-2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-gold medieval-glow tracking-wide whitespace-pre-line">
              {t('hero.title')}
            </h1>
            
            <div className="space-y-1">
              <p className="text-xl md:text-2xl text-ivory/90 font-light">
                {t('hero.subtitle')}
              </p>
              <p className="text-sm md:text-base text-ivory/70 tracking-wide">
                N° SIRET = 3947902320034
              </p>
            </div>
            
            <p className="text-base md:text-lg text-ivory/70 max-w-xl lg:mx-0 mx-auto italic font-light">
              "{t('hero.tagline')}"
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center pt-4">
              <button
                onClick={() => document.getElementById('licornes')?.scrollIntoView({ behavior: 'smooth' })}
                className="ornate-btn-navy group inline-flex items-center gap-3 rounded-full px-10 py-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(218,165,32,0.55)]"
              >
                <PawPrint className="w-6 h-6 text-gold transition-transform duration-300 group-hover:scale-110" />
                <span className="font-display text-3xl text-gold pt-1 whitespace-nowrap">
                  {t('hero.discoverCats')}
                </span>
              </button>

              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="ornate-btn-pearl group inline-flex items-center gap-3 rounded-full px-10 py-4 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(218,165,32,0.45)]"
              >
                <PawPrint className="w-6 h-6 text-midnight/80 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-display text-3xl text-midnight pt-1 whitespace-nowrap">
                  {t('hero.contactUs')}
                </span>
              </button>
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
