import { useEffect, useState } from "react";
import alohaAdult from "@/assets/aloha-adult.jpg";
import utahAdult from "@/assets/utah-adult.jpg";
import kittens from "@/assets/kittens.jpg";
import tapestryTaste from "@/assets/tapestry-taste.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Kitten {
  id: string;
  name: string;
}

interface KittenMedia {
  file_url: string;
}

export const CatsSection = () => {
  const [availableKittens, setAvailableKittens] = useState<Array<{ id: string; name: string; image: string }>>([]);
  const { t } = useLanguage();

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
          const { data: mediaData, error: mediaError } = await supabase
            .from('kitten_media')
            .select('file_url')
            .eq('kitten_id', kitten.id)
            .eq('media_type', 'photo')
            .order('created_at', { ascending: true })
            .limit(1);

          if (mediaError) {
            console.error('Error loading media for kitten:', kitten.id, mediaError);
          }

          console.log(`Media for ${kitten.name}:`, mediaData);

          return {
            id: kitten.id,
            name: kitten.name,
            image: mediaData?.[0]?.file_url || kittens,
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
      description: t('cats.alohaDesc'),
      slug: "aloha",
      type: "breeding"
    },
    {
      name: "Utah",
      image: utahAdult,
      description: t('cats.utahDesc'),
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
        <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-4">
          {t('cats.title')}
        </h2>
        <p className="text-center text-ivory/80 text-lg mb-12 italic font-light">
          {t('cats.breeding')}
        </p>
        
        {/* Breeding Cats */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {cats.map((cat) => (
            <Link key={cat.name} to={`/cat/${cat.slug}`} className="block">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group rounded-[3rem] hover:shadow-[0_0_40px_rgba(218,165,32,0.4)] hover:scale-105">
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
                    <h3 className="text-2xl font-display text-gold mb-2">{cat.name}</h3>
                    <p className="text-ivory/80">{cat.description}</p>
                    <p className="text-gold/70 text-sm mt-3 italic">{t('cats.viewProfile')} →</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Kittens Section */}
        <div id="chatons">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('cats.kittens')}
          </h3>
        <p className="text-center text-ivory/80 mb-8 italic font-light">
          {t('cats.available')}
        </p>
        {availableKittens.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {availableKittens.map((kitten) => (
              <Link key={kitten.id} to={`/kitten/${kitten.id}`} className="block">
                <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group rounded-[3rem] hover:shadow-[0_0_40px_rgba(218,165,32,0.4)] hover:scale-105">
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
                      <h3 className="text-2xl font-display text-gold mb-2">{kitten.name}</h3>
                      <p className="text-gold/70 text-sm mt-3 italic">Voir le profil →</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 rounded-[3rem]">
            <CardContent className="p-8 text-center">
              <p className="text-ivory/80">{t('cats.noKittens')}</p>
            </CardContent>
          </Card>
        )}
        </div>
        
      </div>
    </section>
  );
};
