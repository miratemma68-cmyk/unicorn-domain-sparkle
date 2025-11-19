import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Le Domaine", href: "#domaine" },
    { label: "Nos Licornes", href: "#licornes" },
    { label: "Éducation", href: "#education" },
    { label: "Adoption", href: "#adoption" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
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
                className="text-ivory/80 hover:text-gold transition-colors duration-300 font-serif"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 ml-4">
              {user ? (
                <>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold/10"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  {isAdmin && (
                    <Button
                      onClick={() => navigate('/admin')}
                      className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Administration
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold"
                >
                  <User className="mr-2 h-4 w-4" />
                  Espace Client
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
