import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-gold/30 bg-midnight/80 backdrop-blur-sm py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8 text-center lg:text-left">
          <div>
            <h3 className="text-2xl font-serif text-gold mb-4">{t('footer.title')}</h3>
            <p className="text-ivory/70">
              {t('footer.subtitle')}<br />
              {t('footer.loof')}<br />
              {t('footer.siret')}<br />
              ACACED
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="#domaine" className="hover:text-gold transition-colors">{t('nav.domain')}</a></li>
              <li><a href="#ragdoll-origines" className="hover:text-gold transition-colors">{t('nav.ragdollOrigins')}</a></li>
              <li><a href="#laurence" className="hover:text-gold transition-colors">{t('nav.breeder')}</a></li>
              <li><a href="#licornes" className="hover:text-gold transition-colors">{t('nav.cats')}</a></li>
              <li><a href="#chatons" className="hover:text-gold transition-colors">{t('nav.availableCats')}</a></li>
              <li><a href="#education" className="hover:text-gold transition-colors">{t('nav.education')}</a></li>
              <li><a href="#adoption" className="hover:text-gold transition-colors">{t('nav.adoption')}</a></li>
              <li><a href="#temoignages" className="hover:text-gold transition-colors">{t('nav.testimonials')}</a></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">{t('nav.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-ivory/70">
              <li>{t('footer.email')}</li>
              <li>{t('footer.social')}</li>
            </ul>
            <div className="flex justify-center lg:justify-start gap-5 mt-4">
              <div className="flex flex-col items-center gap-1">
                <a
                  href="https://www.instagram.com/chatterie.licornes/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(225,48,108,0.6)]"
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
                    className="w-6 h-6"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <span className="text-ivory/80 text-xs font-light">Instagram</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <a
                  href="https://www.facebook.com/share/1BJTbYEqPD/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(24,119,242,0.6)]"
                  style={{ background: "#1877F2" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.6c0-.9.3-1.5 1.6-1.5H17V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.1V10.5H8v3h2.5V21h3z" />
                  </svg>
                </a>
                <span className="text-ivory/80 text-xs font-light">Facebook</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-ivory/60">
          <p>&copy; {new Date().getFullYear()} {t('footer.title')}. {t('footer.copyright')}</p>
          <p className="mt-2 text-sm italic">
            "{t('footer.tagline')}"
          </p>
        </div>
      </div>
    </footer>
  );
};
