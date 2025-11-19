import tapestryDesire from "@/assets/tapestry-desire.png";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Tapestry Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${tapestryDesire})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'sepia(0.3) brightness(0.7)'
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/80 via-crimson-dark/60 to-midnight/90" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold medieval-glow mb-6 tracking-wide">
          Le Domaine des Licornes
        </h1>
        
        <p className="text-xl md:text-2xl text-ivory/90 mb-4 font-light">
          Élevage Premium de Ragdolls
        </p>
        
        <p className="text-base md:text-lg text-foreground/80 mb-12 max-w-2xl mx-auto italic">
          "Où l'élégance médiévale rencontre la grâce féline"
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)]"
            onClick={() => document.getElementById('licornes')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Découvrez Nos Licornes
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-gold text-gold hover:bg-gold/10 hover:text-gold-light transition-all duration-300"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contactez-nous
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gold" />
      </div>
    </section>
  );
};
