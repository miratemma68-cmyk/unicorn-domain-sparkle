import tapestrySmell from "@/assets/tapestry-smell.jpg";

export const EducationSection = () => {
  return (
    <section id="education" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <img 
                src={tapestrySmell} 
                alt="La Dame à la Licorne - L'Odorat" 
                className="w-full rounded-[3rem] tapestry-border shadow-2xl"
              />
            </div>
            
            <div className="space-y-6 text-ivory/90 order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow">
                Éducation
              </h2>
              
              <p className="text-lg leading-relaxed">
                Nos chatons bénéficient d'une pré-éducation exclusive qui garantit 
                leur épanouissement et leur sociabilité exceptionnelle.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-display text-gold">Notre Méthode</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Socialisation précoce avec humains et autres animaux</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Stimulation cognitive adaptée à chaque étape</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Apprentissage de la propreté et des bonnes habitudes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Suivi vétérinaire rigoureux et vaccinations complètes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Documentation détaillée de leur évolution</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-lg leading-relaxed italic">
                Chaque chaton est traité comme une petite licorne précieuse, 
                recevant toute l'attention nécessaire pour devenir un compagnon équilibré.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
