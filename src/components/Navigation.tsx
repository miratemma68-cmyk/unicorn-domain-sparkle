import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import boutonChatons from "@/assets/bouton-chatons.png";

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
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
    { label: t('nav.faq'), href: "#faq" },
    { label: t('nav.contact'), href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-midnight/95 backdrop-blur-md border-b border-gold/30 shadow-[0_5px_30px_rgba(0,0,0,0.5)]' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div></div>
          
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-ivory/80 hover:text-gold transition-colors duration-300 font-sans italic font-light text-lg"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#chatons"
              className="relative inline-block shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={boutonChatons}
                alt=""
                width={1088}
                height={608}
                loading="lazy"
                className="w-52 h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              />
              <span
                className="absolute inset-y-0 left-0 flex items-center justify-center pl-16 whitespace-pre-line font-display text-2xl text-gold leading-[0.9] text-center"
                style={{ textShadow: "0 1px 6px rgba(10, 20, 60, 0.9)" }}
              >
                {t('nav.availableCats')}
              </span>
            </a>
            <div className="flex gap-2 ml-4 items-center">
              <LanguageSwitcher />
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="ornate-btn-navy inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(218,165,32,0.5)]"
                  >
                    <User className="w-4 h-4 text-gold" />
                    <span className="font-display text-xl text-gold pt-0.5 whitespace-nowrap">
                      {t('nav.dashboard')}
                    </span>
                  </button>
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold rounded-full"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      {t('nav.administration')}
                    </Button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="ornate-btn-navy inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(218,165,32,0.5)]"
                >
                  <User className="w-4 h-4 text-gold" />
                  <span className="font-display text-xl text-gold pt-0.5 whitespace-nowrap">
                    {t('nav.clientSpace')}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
