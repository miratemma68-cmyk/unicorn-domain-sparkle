import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-ivory/80 hover:text-gold hover:bg-gold/10"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-midnight/95 backdrop-blur-md border-gold/30">
        <DropdownMenuItem
          onClick={() => setLanguage('fr')}
          className={`cursor-pointer ${
            language === 'fr' 
              ? 'bg-gold/20 text-gold' 
              : 'text-ivory/80 hover:bg-gold/10 hover:text-gold'
          }`}
        >
          🇫🇷 Français
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer ${
            language === 'en' 
              ? 'bg-gold/20 text-gold' 
              : 'text-ivory/80 hover:bg-gold/10 hover:text-gold'
          }`}
        >
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('es')}
          className={`cursor-pointer ${
            language === 'es' 
              ? 'bg-gold/20 text-gold' 
              : 'text-ivory/80 hover:bg-gold/10 hover:text-gold'
          }`}
        >
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};