import tapestryDesire from "@/assets/tapestry-desire.png";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-midnight">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left side - Image */}
          <div className="relative order-2 lg:order-1 py-8">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Ornamental border */}
              <div className="absolute inset-0 border-4 border-gold/30 rounded-[3rem] -translate-x-4 -translate-y-4" />
              <div className="absolute inset-0 border-4 border-gold/30 rounded-[3rem] translate-x-4 translate-y-4" />
              
              {/* Main image */}
              <div className="relative h-full border-2 border-gold shadow-[0_0_50px_rgba(218,165,32,0.3)] rounded-[3rem] overflow-hidden">
                <img 
                  src={tapestryDesire} 
                  alt="La Dame à la Licorne - Mon seul désir" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="relative z-10 text-center lg:text-left order-1 lg:order-2 space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-gold medieval-glow tracking-wide">
              Le Domaine des Licornes
            </h1>
            
            <p className="text-xl md:text-2xl text-ivory/90 font-light">
              Élevage Premium de Ragdolls
            </p>
            
            <p className="text-base md:text-lg text-ivory/70 max-w-xl lg:mx-0 mx-auto italic font-light">
              "Où l'élégance médiévale rencontre la grâce féline"
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full hover:scale-105"
                onClick={() => document.getElementById('licornes')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Découvrez Nos Licornes
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gold text-gold hover:bg-gold/10 hover:text-gold-light transition-all duration-300 rounded-full hover:scale-105"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contactez-nous
              </Button>
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
