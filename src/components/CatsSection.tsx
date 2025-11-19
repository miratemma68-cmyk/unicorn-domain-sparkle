import alohaAdult from "@/assets/aloha-adult.jpg";
import utahAdult from "@/assets/utah-adult.jpg";
import kittens from "@/assets/kittens.jpg";
import tapestryTaste from "@/assets/tapestry-taste.jpg";
import { Card, CardContent } from "@/components/ui/card";

export const CatsSection = () => {
  const cats = [
    {
      name: "Aloha",
      image: alohaAdult,
      description: "Notre magnifique Ragdoll, douce et élégante comme une licorne"
    },
    {
      name: "Utah",
      image: utahAdult,
      description: "Un prince parmi les Ragdolls, noble et majestueux"
    },
    {
      name: "Nos Chatons",
      image: kittens,
      description: "De futures licornes prêtes à enchanter votre foyer"
    }
  ];

  return (
    <section id="licornes" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestryTaste})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif text-gold medieval-glow text-center mb-4">
          Nos Licornes
        </h2>
        <p className="text-center text-ivory/80 text-lg mb-12 italic">
          "Comme les licornes dans leur jardin enchanté"
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {cats.map((cat) => (
            <Card key={cat.name} className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-gold mb-2">{cat.name}</h3>
                  <p className="text-ivory/80">{cat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
