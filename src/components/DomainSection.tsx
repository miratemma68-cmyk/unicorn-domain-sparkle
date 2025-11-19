import tapestryTouch from "@/assets/tapestry-touch.jpg";

export const DomainSection = () => {
  return (
    <section id="domaine" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestryTouch})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-lg p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gold medieval-glow text-center mb-8">
            Le Domaine
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-ivory/90">
              <p className="text-lg leading-relaxed">
                Bienvenue dans notre élevage familial, où chaque Ragdoll est élevé avec amour, 
                respect et selon les plus hauts standards éthiques.
              </p>
              
              <p className="text-lg leading-relaxed">
                Inspirés par la noblesse des licornes des tapisseries médiévales, 
                nous avons créé un havre de paix où nos chats s'épanouissent dans un environnement 
                privilégié, entourés d'attention et de soins constants.
              </p>
              
              <div className="space-y-4 mt-8">
                <h3 className="text-2xl font-serif text-gold">Nos Valeurs</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Éthique et bien-être animal au cœur de nos pratiques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Élevage familial dans un cadre exceptionnel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Pré-éducation soignée de chaque chaton</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Accompagnement personnalisé des adoptants</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={tapestryTouch} 
                alt="La Dame à la Licorne - Le Toucher" 
                className="w-full rounded-lg tapestry-border shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
