import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-gold/30 bg-midnight/80 backdrop-blur-sm py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-serif text-gold mb-4">{t('footer.title')}</h3>
            <p className="text-ivory/70">
              {t('footer.subtitle')}<br />
              {t('footer.loof')}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">{t('footer.navigation')}</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="#domaine" className="hover:text-gold transition-colors">{t('nav.domain')}</a></li>
              <li><a href="#licornes" className="hover:text-gold transition-colors">{t('nav.cats')}</a></li>
              <li><a href="#education" className="hover:text-gold transition-colors">{t('nav.education')}</a></li>
              <li><a href="#adoption" className="hover:text-gold transition-colors">{t('nav.adoption')}</a></li>
              <li><a href="#faq" className="hover:text-gold transition-colors">{t('nav.faq')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-ivory/70">
              <li>{t('footer.email')}</li>
              <li>{t('footer.social')}</li>
            </ul>
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
