import { useEffect, useState } from "react";
import alohaAdult from "@/assets/aloha-adult.jpg";
import utahAdult from "@/assets/utah-adult.jpg";
import kittens from "@/assets/kittens.jpg";
import tapestryTaste from "@/assets/tapestry-taste.jpg";
import sirAuguste from "@/assets/sir-auguste.jpg.asset.json";
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
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadKittens();
  }, []);

  const loadKittens = async () => {
    try {
      console.log('Loading kittens from public-kittens function...');
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('public-kittens');

      if (error) {
        console.error('Error loading kittens from edge function:', error);
        throw error;
      }

      const kittensData = (data as any)?.kittens ?? [];

      console.log('Loaded kittens from function:', kittensData);

      const normalizedKittens = (kittensData as Array<{ id: string; name: string; image: string | null }>).map(
        (kitten) => ({
          id: kitten.id,
          name: kitten.name,
          image: kitten.image || kittens,
        })
      );

      console.log('Final kittens with photos:', normalizedKittens);
      setAvailableKittens(normalizedKittens);
    } catch (error) {
      console.error('Error in loadKittens:', error);
      setAvailableKittens([]);
    } finally {
      setLoading(false);
    }
  };

  const cats = [
    {
      name: "Aloha de la Rosée de Perle d'O",
      image: alohaAdult,
      description: t('cats.alohaDesc'),
      slug: "aloha",
      color: "",
      type: "breeding"
    },
    {
      name: "Utah du Domaine de Louvigny",
      image: utahAdult,
      description: t('cats.utahDesc'),
      slug: "utah",
      color: "",
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
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-stretch">
          {cats.map((cat) => (
            <Link key={cat.name} to={`/cat/${cat.slug}`} className="block h-full">
              <Card className="h-full bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group rounded-[3rem] hover:shadow-[0_0_40px_rgba(218,165,32,0.4)] hover:scale-105">

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
                    <h3 className="text-2xl font-display text-gold mb-2 whitespace-pre-line">{cat.name}</h3>
                    {cat.color && (
                      <p className="text-gold/80 text-sm mb-2">Color: {cat.color}</p>
                    )}
                    <p className="text-ivory/80">{cat.description}</p>
                    <p className="text-gold/70 text-sm mt-3 italic">{t('cats.viewProfile')} →</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* External Breeders */}
        <div className="mb-16">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('cats.externalBreeders')}
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/cat/sir-auguste" className="block">
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 hover:border-gold transition-all duration-300 overflow-hidden group rounded-[3rem] hover:shadow-[0_0_40px_rgba(218,165,32,0.4)] hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={sirAuguste.url}
                      alt="Sir Auguste de la Fleur de Vigne"
                      className="w-full h-80 object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent opacity-60" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-display text-gold mb-2">Sir Auguste de la Fleur de Vigne</h3>
                    <p className="text-ivory/80 italic">Reproducteur externe</p>
                    <p className="text-gold/70 text-sm mt-3 italic">{t('cats.viewProfile')} →</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Kittens Section */}
        <div id="chatons">

          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            {t('cats.kittens')}
          </h3>
        <p className="text-center text-ivory/80 mb-8 italic font-light">
          {t('cats.available')}
        </p>
        {loading ? (
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 rounded-[3rem]">
            <CardContent className="p-8 text-center">
              <p className="text-ivory/80">{t('common.loading')}...</p>
            </CardContent>
          </Card>
        ) : availableKittens.length > 0 ? (
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