import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Award, Heart } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import sirAugusteAsset from '@/assets/sir-auguste.jpg.asset.json';

const EXTERNAL_BREEDERS: Record<string, any> = {
  'sir-auguste': {
    id: 'sir-auguste',
    name: 'Sir Auguste de la Fleur de Vigne',
    birth_date: '',
    gender: 'male',
    color: 'Seal Point',
    pedigree: '',
    personality: "Reproducteur externe au caractère noble et majestueux, Sir Auguste apporte une lignée prestigieuse à notre élevage.",
    personality_en: "An external breeder with a noble and majestic character, Sir Auguste brings a prestigious lineage to our cattery.",
    personality_es: "Reproductor externo de carácter noble y majestuoso, Sir Auguste aporta un linaje prestigioso a nuestro criadero.",
    pedigree_en: '',
    pedigree_es: '',
    registration_number: '',
    microchip_number: '',
    profile_image_url: sirAugusteAsset.url,
  },
};

interface BreedingCat {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  color: string;
  pedigree: string;
  personality: string;
  pedigree_en: string;
  pedigree_es: string;
  personality_en: string;
  personality_es: string;
  registration_number: string;
  microchip_number: string;
  profile_image_url: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  caption_en: string | null;
  caption_es: string | null;
  display_order: number;
  media_type: string;
}

export default function CatDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [cat, setCat] = useState<BreedingCat | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatDetails();
  }, [id]);

  const loadCatDetails = async () => {
    try {
      if (id && EXTERNAL_BREEDERS[id.toLowerCase()]) {
        setCat(EXTERNAL_BREEDERS[id.toLowerCase()]);
        setGallery([]);
        return;
      }

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

  const getTranslatedCaption = (item: GalleryImage) => {
    if (language === 'en' && item.caption_en) return item.caption_en;
    if (language === 'es' && item.caption_es) return item.caption_es;
    return item.caption || '';
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      return years - 1 + ' ' + t('catDetail.years');
    }
    return years + ' ' + t('catDetail.years');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="text-gold text-xl font-serif">{t('catDetail.loading')}</p>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <div className="text-center">
          <p className="text-gold text-xl font-serif mb-4">{t('catDetail.notFound')}</p>
          <Link to="/#licornes">
            <Button className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
              {t('catDetail.backToOurUnicorns')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-forest to-midnight">
      <div className="container mx-auto px-4 py-8">
        <Link to="/#licornes">
          <Button
            variant="outline"
            className="mb-8 border-gold text-gold hover:bg-gold/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('catDetail.backToOurUnicorns')}
          </Button>
        </Link>

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
                {cat.gender === 'male' ? t('catDetail.breederMale') : t('catDetail.breederFemale')} Ragdoll
              </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('catDetail.information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-ivory/90">
                <div>
                  <span className="font-semibold text-gold">{t('catDetail.birthDate')}:</span>{' '}
                  {new Date(cat.birth_date).toLocaleDateString('fr-FR')} ({calculateAge(cat.birth_date)})
                </div>
                {cat.color && (
                  <div>
                    <span className="font-semibold text-gold">{t('catDetail.color')}:</span> {cat.color}
                  </div>
                )}
                {cat.registration_number && (
                  <div className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-gold">{t('catDetail.loofNumber')}:</span>{' '}
                      {cat.registration_number}
                    </div>
                  </div>
                )}
                {cat.microchip_number && (
                  <div>
                    <span className="font-semibold text-gold">{t('catDetail.chipNumber')}:</span> {cat.microchip_number}
                  </div>
                )}
              </CardContent>
            </Card>

            {(cat.personality || cat.personality_en || cat.personality_es) && (
              <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    {t('catDetail.personality')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-ivory/90">
                  <p className="leading-relaxed">
                    {language === 'en' && cat.personality_en 
                      ? cat.personality_en 
                      : language === 'es' && cat.personality_es
                      ? cat.personality_es
                      : cat.personality}
                  </p>
                </CardContent>
              </Card>
            )}

            {(cat.pedigree || cat.pedigree_en || cat.pedigree_es) && (
              <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
                <CardHeader>
                  <CardTitle className="text-gold flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('catDetail.pedigree')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-ivory/90">
                  <p className="leading-relaxed whitespace-pre-line">
                    {language === 'en' && cat.pedigree_en 
                      ? cat.pedigree_en 
                      : language === 'es' && cat.pedigree_es
                      ? cat.pedigree_es
                      : cat.pedigree}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-gold mb-6 text-center">{t('catDetail.gallery')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg border-2 border-gold/30 shadow-lg hover:shadow-[0_0_30px_rgba(218,165,32,0.4)] transition-all duration-300"
                >
                  {item.media_type === 'video' ? (
                    <video
                      src={item.image_url}
                      controls
                      className="w-full aspect-square object-cover bg-midnight"
                      preload="metadata"
                    >
                      {t('catDetail.videoNotSupported')}
                    </video>
                  ) : (
                    <img
                      src={item.image_url}
                      alt={item.caption || cat.name}
                      className="w-full aspect-square object-cover"
                    />
                  )}
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight/90 to-transparent p-4">
                      <p className="text-ivory/90 text-sm">{getTranslatedCaption(item)}</p>
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
