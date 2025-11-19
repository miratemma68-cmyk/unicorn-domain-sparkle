import { useEffect, useState } from "react";
import alohaAdult from "@/assets/aloha-adult.jpg";
import utahAdult from "@/assets/utah-adult.jpg";
import kittens from "@/assets/kittens.jpg";
import tapestryTaste from "@/assets/tapestry-taste.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Kitten {
  id: string;
  name: string;
}

interface KittenMedia {
  file_url: string;
}

export const CatsSection = () => {
  const [availableKittens, setAvailableKittens] = useState<Array<{ id: string; name: string; image: string }>>([]);

  useEffect(() => {
    loadKittens();
  }, []);

  const loadKittens = async () => {
    try {
      // Get all kittens
      const { data: kittensData, error: kittensError } = await supabase
        .from('kittens')
        .select('id, name')
        .order('name');

      if (kittensError) throw kittensError;

      console.log('Loaded kittens:', kittensData);

      // For each kitten, get their first photo
      const kittensWithPhotos = await Promise.all(
        (kittensData || []).map(async (kitten: Kitten) => {
          const { data: mediaData } = await supabase
            .from('kitten_media')
            .select('file_url')
            .eq('kitten_id', kitten.id)
            .eq('media_type', 'photo')
            .limit(1)
            .maybeSingle();

          return {
            id: kitten.id,
            name: kitten.name,
            image: (mediaData as KittenMedia)?.file_url || kittens,
          };
        })
      );

      console.log('Kittens with photos:', kittensWithPhotos);
      setAvailableKittens(kittensWithPhotos);
    } catch (error) {
      console.error('Error loading kittens:', error);
    }
  };

  const cats = [
    {
      name: "Aloha",
      image: alohaAdult,
      description: "Notre magnifique Ragdoll, douce et élégante comme une licorne",
      slug: "aloha",
      type: "breeding"
    },
    {
      name: "Utah",
      image: utahAdult,
      description: "Une princesse parmi les Ragdolls, noble et majestueuse",
      slug: "utah",
      type: "breeding"
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
        
        {/* Breeding Cats */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {cats.map((cat) => (
            <Link key={cat.name} to={`/cat/${cat.slug}`} className="block">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-80 object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent opacity-60" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-gold mb-2">{cat.name}</h3>
                    <p className="text-ivory/80">{cat.description}</p>
                    <p className="text-gold/70 text-sm mt-3 italic">Voir le profil →</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Kittens Section */}
        <h3 className="text-3xl font-serif text-gold medieval-glow text-center mb-8">
          Nos Chatons
        </h3>
        <p className="text-center text-ivory/80 mb-8 italic">
          De futures licornes prêtes à enchanter votre foyer
        </p>
        {availableKittens.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {availableKittens.map((kitten) => (
              <Link key={kitten.id} to={`/kitten/${kitten.id}`} className="block">
                <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img 
                        src={kitten.image} 
                        alt={kitten.name}
                        className="w-full h-80 object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-serif text-gold mb-2">{kitten.name}</h3>
                      <p className="text-gold/70 text-sm mt-3 italic">Voir le profil →</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
            <CardContent className="p-8 text-center">
              <p className="text-ivory/80">Aucun chaton disponible pour le moment.</p>
              <p className="text-ivory/60 text-sm mt-2">Consultez nos reproducteurs ci-dessus et revenez bientôt !</p>
            </CardContent>
          </Card>
        )}
        
      </div>
    </section>
  );
};
