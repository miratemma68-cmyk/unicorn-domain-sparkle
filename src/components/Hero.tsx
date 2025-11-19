import tapestryDesire from "@/assets/tapestry-desire.png";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Tapestry Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${tapestryDesire})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'sepia(0.4) brightness(0.6) contrast(1.1)'
        }}
      />
      
      {/* Dark overlay with vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-crimson-dark/50 to-midnight/80" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-midnight/60" />
      
      {/* Decorative tapestry image on the side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 hidden lg:block opacity-40">
        <img 
          src={tapestryDesire} 
          alt="La Dame à la Licorne - Mon seul désir" 
          className="w-full h-full object-contain filter sepia-[0.3] brightness-90"
        />
      </div>
      
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
