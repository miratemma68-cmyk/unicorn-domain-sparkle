import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Award, Heart } from 'lucide-react';
import { Footer } from '@/components/Footer';

interface BreedingCat {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  color: string;
  pedigree: string;
  personality: string;
  registration_number: string;
  microchip_number: string;
  profile_image_url: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export default function CatDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cat, setCat] = useState<BreedingCat | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatDetails();
  }, [id]);

  const loadCatDetails = async () => {
    try {
      const { data: catData, error: catError } = await supabase
        .from('breeding_cats')
        .select('*')
        .ilike('name', id || '')
        .single();

      if (catError) throw catError;
      setCat(catData);

      const { data: galleryData, error: galleryError } = await supabase
        .from('breeding_cat_gallery')
        .select('*')
        .eq('cat_id', catData.id)
        .order('display_order');

      if (galleryError) throw galleryError;
      setGallery(galleryData || []);
    } catch (error) {
      console.error('Error loading cat details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      return years - 1 + ' ans';
    }
    return years + ' ans';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="text-gold text-xl font-serif">Chargement...</p>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <div className="text-center">
          <p className="text-gold text-xl font-serif mb-4">Chat non trouvé</p>
          <Button onClick={() => navigate('/')} className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-forest to-midnight">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/#licornes')}
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
              <img
                src={cat.profile_image_url}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-serif text-gold medieval-glow mb-2">
                {cat.name}
              </h1>
              <p className="text-2xl text-ivory/80 font-light">
                {cat.gender === 'male' ? 'Reproducteur' : 'Reproductrice'} Ragdoll
              </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-ivory/90">
                <div>
                  <span className="font-semibold text-gold">Date de naissance:</span>{' '}
                  {new Date(cat.birth_date).toLocaleDateString('fr-FR')} ({calculateAge(cat.birth_date)})
                </div>
                {cat.color && (
                  <div>
                    <span className="font-semibold text-gold">Couleur:</span> {cat.color}
                  </div>
                )}
                {cat.registration_number && (
                  <div className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gold">N° LOOF:</span>{' '}
                      {cat.registration_number}
                    </div>
                  </div>
                )}
                {cat.microchip_number && (
                  <div>
                    <span className="font-semibold text-gold">N° Puce:</span> {cat.microchip_number}
                  </div>
                )}
              </CardContent>
            </Card>

            {cat.personality && (
              <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Caractère
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-ivory/90">
                  <p className="leading-relaxed">{cat.personality}</p>
                </CardContent>
              </Card>
            )}

            {cat.pedigree && (
              <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Pedigree
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-ivory/90">
                  <p className="leading-relaxed whitespace-pre-line">{cat.pedigree}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-gold mb-6 text-center">Galerie Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg border-2 border-gold/30 shadow-lg hover:shadow-[0_0_30px_rgba(218,165,32,0.4)] transition-all duration-300"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || cat.name}
                    className="w-full aspect-square object-cover"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight/90 to-transparent p-4">
                      <p className="text-ivory/90 text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
