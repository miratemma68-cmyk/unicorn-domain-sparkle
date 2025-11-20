import tapestryHearing from "@/assets/tapestry-hearing.jpg";
import { Button } from "@/components/ui/button";

export const AdoptionSection = () => {
  return (
    <section id="adoption" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestryHearing})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-8">
            Adoption
          </h2>
          
          <div className="space-y-8 text-ivory/90">
            <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
              Adopter un Ragdoll du Domaine des Licornes, c'est accueillir un compagnon 
              d'exception dans votre vie. Nous vous accompagnons à chaque étape de ce merveilleux voyage.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold font-display">1</span>
                </div>
                <h3 className="text-xl font-display text-gold">Premier Contact</h3>
                <p>Remplissez notre formulaire pour exprimer votre intérêt</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold font-display">2</span>
                </div>
                <h3 className="text-xl font-display text-gold">Rencontre</h3>
                <p>Visitez notre élevage et faites connaissance avec nos licornes</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto bg-crimson rounded-full flex items-center justify-center border-2 border-gold shadow-lg hover:scale-110 transition-transform">
                  <span className="text-3xl text-gold font-display">3</span>
                </div>
                <h3 className="text-xl font-display text-gold">Adoption</h3>
                <p>Accueillez votre compagnon avec un suivi personnalisé</p>
              </div>
            </div>
            
            <div className="bg-crimson/20 border border-gold/30 rounded-[2rem] p-6 mt-12">
              <h3 className="text-2xl font-display text-gold mb-4">Ce que vous recevez</h3>
              <ul className="grid md:grid-cols-2 gap-3">
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>Certificat de santé complet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>Carnet de vaccination à jour</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>Pedigree LOOF officiel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>Kit de démarrage personnalisé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>Guide d'accueil détaillé</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">✦</span>
                  <span>Suivi post-adoption illimité</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center mt-8">
              <Button 
                size="lg"
                className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full hover:scale-105"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Commencer Votre Adoption
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
