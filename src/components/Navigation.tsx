import { useState, useEffect } from "react";
import { User, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import boutonChatons from "@/assets/bouton-chatons.png";

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('nav.domain'), href: "#domaine" },
    { label: t('nav.ragdollOrigins'), href: "#ragdoll-origines" },
    { label: t('nav.breeder'), href: "#laurence" },
    { label: t('nav.cats'), href: "#licornes" },
    { label: t('nav.education'), href: "#education" },
    { label: t('nav.adoption'), href: "#adoption" },
    { label: t('nav.testimonials'), href: "#temoignages" },
    { label: t('nav.contact'), href: "#contact" },
  ];

  const authButtons = (
    <>
      <button
        onClick={() => navigate(user ? (isAdmin ? '/admin' : '/dashboard') : '/auth')}
        className="ornate-btn-navy inline-flex items-center gap-2.5 rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(218,165,32,0.5)]"
      >
        <User className="w-5 h-5 text-gold" />
        <span className="font-display text-2xl text-gold pt-0.5 whitespace-nowrap">
          {t('nav.clientSpace')}
        </span>
      </button>
      <LanguageSwitcher />
    </>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-midnight/95 backdrop-blur-md border-b border-gold/30 shadow-[0_5px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        {/* Desktop : liens, bouton chatons, puis langue + espace client centrés ensemble */}
        <div className="hidden lg:flex items-center justify-center gap-4 flex-wrap min-w-0">
          <div className="flex items-center gap-4 min-w-0">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-ivory/80 hover:text-gold transition-colors duration-300 font-sans italic font-light text-base whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
          <a
            href="#chatons"
            className="ornate-btn-navy halo-gold inline-flex items-center gap-2.5 rounded-full px-6 py-3 transition-all duration-300 hover:scale-105 hover:brightness-110"
          >
            <PawPrint className="w-5 h-5 text-gold shrink-0" />
            <span className="font-display text-2xl text-gold pt-0.5 whitespace-pre-line leading-[0.95] text-center">
              {t('nav.availableCats')}
            </span>
          </a>
          <div className="flex gap-1 items-center shrink-0">
            {authButtons}
          </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center justify-end">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gold p-2"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden flex flex-col gap-3 mt-4 pb-4 border-t border-gold/20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden">
            <div className="flex flex-wrap gap-2 items-center pt-3 min-w-0">
              {authButtons}
            </div>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-ivory/90 hover:text-gold transition-colors duration-300 font-sans italic font-light text-lg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#chatons"
              onClick={() => setMobileOpen(false)}
              className="ornate-btn-navy halo-gold inline-flex items-center gap-2.5 self-start rounded-full px-5 py-3 transition-all duration-300 hover:scale-105 hover:brightness-110"
            >
              <PawPrint className="w-5 h-5 text-gold shrink-0" />
              <span className="font-display text-xl text-gold pt-0.5 whitespace-pre-line leading-[0.95] text-center">
                {t('nav.availableCats')}
              </span>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};
