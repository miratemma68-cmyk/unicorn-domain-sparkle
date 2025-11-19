import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Palette, Weight } from 'lucide-react';
import { Footer } from '@/components/Footer';

interface Kitten {
  id: string;
  name: string;
  birth_date: string | null;
  gender: string | null;
  color: string | null;
  current_weight: number | null;
  breed_info: string | null;
}

interface KittenMedia {
  id: string;
  file_url: string;
  caption: string | null;
  media_type: string;
  created_at: string;
}

export default function KittenDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [kitten, setKitten] = useState<Kitten | null>(null);
  const [media, setMedia] = useState<KittenMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKittenDetails();
  }, [id]);

  const loadKittenDetails = async () => {
    try {
      const { data: kittenData, error: kittenError } = await supabase
        .from('kittens')
        .select('*')
        .eq('id', id || '')
        .single();

      if (kittenError) throw kittenError;
      setKitten(kittenData);

      const { data: mediaData, error: mediaError } = await supabase
        .from('kitten_media')
        .select('*')
        .eq('kitten_id', kittenData.id)
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;
      setMedia(mediaData || []);
    } catch (error) {
      console.error('Error loading kitten details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    
    if (ageInMonths < 1) {
      const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} jour${days > 1 ? 's' : ''}`;
    } else if (ageInMonths < 12) {
      return `${ageInMonths} mois`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} an${years > 1 ? 's' : ''} et ${months} mois` : `${years} an${years > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="text-gold text-xl font-serif">Chargement...</p>
      </div>
    );
  }

  if (!kitten) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <div className="text-center">
          <p className="text-gold text-xl font-serif mb-4">Chaton non trouvé</p>
          <Button onClick={() => navigate('/')} className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const profilePhoto = media.find(m => m.media_type === 'photo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-forest to-midnight">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('licornes')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          variant="outline"
          className="mb-8 border-gold text-gold hover:bg-gold/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à Nos Licornes
        </Button>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Profile Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg border-4 border-gold shadow-[0_0_50px_rgba(218,165,32,0.3)]">
              {profilePhoto ? (
                <img
                  src={profilePhoto.file_url}
                  alt={kitten.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-midnight/50">
                  <p className="text-gold/50 font-serif">Aucune photo</p>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
              <CardHeader>
                <CardTitle className="text-3xl font-serif text-gold medieval-glow">
                  {kitten.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {kitten.birth_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-ivory/60">Âge</p>
                      <p className="text-ivory">{calculateAge(kitten.birth_date)}</p>
                    </div>
                  </div>
                )}

                {kitten.gender && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-gold">♂♀</div>
                    <div>
                      <p className="text-sm text-ivory/60">Sexe</p>
                      <p className="text-ivory">{kitten.gender === 'male' ? 'Mâle' : 'Femelle'}</p>
                    </div>
                  </div>
                )}

                {kitten.color && (
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-ivory/60">Couleur</p>
                      <p className="text-ivory">{kitten.color}</p>
                    </div>
                  </div>
                )}

                {kitten.current_weight && (
                  <div className="flex items-center gap-3">
                    <Weight className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-ivory/60">Poids</p>
                      <p className="text-ivory">{kitten.current_weight} g</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {kitten.breed_info && (
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-gold">À propos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-ivory/80 leading-relaxed">{kitten.breed_info}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Gallery */}
        {media.length > 0 && (
          <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-gold">Galerie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gold/20 hover:border-gold transition-all">
                    {item.media_type === 'photo' ? (
                      <img
                        src={item.file_url}
                        alt={item.caption || kitten.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <video
                        src={item.file_url}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-midnight/80 p-2 text-xs text-ivory/80">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
