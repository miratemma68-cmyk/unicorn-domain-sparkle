import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Palette, Weight, Activity, TrendingUp, Stethoscope } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

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
  caption_en: string | null;
  caption_es: string | null;
  media_type: string;
  created_at: string;
}

interface KittenMilestone {
  id: string;
  milestone_type: string;
  milestone_date: string;
  description: string | null;
}

interface KittenUpdate {
  id: string;
  update_date: string;
  weight: number | null;
  notes: string | null;
}

interface KittenVetVisit {
  id: string;
  visit_date: string;
  visit_type: string | null;
  vet_name: string | null;
  notes: string | null;
  next_visit_date: string | null;
}

export default function KittenDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [kitten, setKitten] = useState<Kitten | null>(null);
  const [media, setMedia] = useState<KittenMedia[]>([]);
  const [milestones, setMilestones] = useState<KittenMilestone[]>([]);
  const [updates, setUpdates] = useState<KittenUpdate[]>([]);
  const [vetVisits, setVetVisits] = useState<KittenVetVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKittenDetails();
  }, [id]);

  const loadKittenDetails = async () => {
    try {
      let kittenData: Kitten | null = null;

      if (user) {
        console.log('Loading kitten detail for authenticated user...', id, user.id);

        const { data, error } = await supabase
          .from('kittens')
          .select('*')
          .eq('id', id || '')
          .maybeSingle();

        if (error) {
          console.error('Error loading kitten from protected table:', error);
          setKitten(null);
          setLoading(false);
          return;
        }

        if (!data) {
          console.warn('No kitten found for authenticated user with id', id);
          setKitten(null);
          setLoading(false);
          return;
        }

        kittenData = data as Kitten;
      } else {
        console.log('Loading public kitten detail via edge function...', id);

        const { data, error } = await supabase.functions.invoke('public-kittens', {
          body: { id },
        });

        // Handle edge function errors or 404 responses
        if (error) {
          console.error('Error loading kitten detail from edge function:', error);
          setKitten(null);
          setLoading(false);
          return;
        }

        const publicKitten = (data as any)?.kitten as Kitten | null;

        if (!publicKitten) {
          console.warn('No public kitten found for id (may be assigned to client)', id);
          setKitten(null);
          setLoading(false);
          return;
        }

        kittenData = publicKitten;
      }

      // At this point we have a kitten (either client-owned or public)
      setKitten(kittenData);

      const { data: mediaData, error: mediaError } = await supabase
        .from('kitten_media')
        .select('*')
        .eq('kitten_id', kittenData.id)
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;
      setMedia(mediaData || []);

      // Load milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('kitten_milestones')
        .select('*')
        .eq('kitten_id', kittenData.id)
        .order('milestone_date', { ascending: false });

      if (milestonesError) throw milestonesError;
      setMilestones(milestonesData || []);

      // Load updates
      const { data: updatesData, error: updatesError } = await supabase
        .from('kitten_updates')
        .select('*')
        .eq('kitten_id', kittenData.id)
        .order('update_date', { ascending: false });

      if (updatesError) throw updatesError;
      setUpdates(updatesData || []);

      // Load vet visits
      const { data: vetVisitsData, error: vetVisitsError } = await supabase
        .from('kitten_vet_visits')
        .select('*')
        .eq('kitten_id', kittenData.id)
        .order('visit_date', { ascending: false });

      if (vetVisitsError) throw vetVisitsError;
      setVetVisits(vetVisitsData || []);
    } catch (error) {
      console.error('Error loading kitten details:', error);
      setKitten(null);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedCaption = (item: KittenMedia) => {
    if (language === 'en' && item.caption_en) return item.caption_en;
    if (language === 'es' && item.caption_es) return item.caption_es;
    return item.caption || '';
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const ageInMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    
    if (ageInMonths < 1) {
      const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} ${t(days > 1 ? 'kittenDetail.days' : 'kittenDetail.day')}`;
    } else if (ageInMonths < 12) {
      return `${ageInMonths} ${t(ageInMonths > 1 ? 'kittenDetail.months' : 'kittenDetail.month')}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      const yearLabel = t(years > 1 ? 'kittenDetail.years' : 'kittenDetail.year');
      const monthLabel = t(months > 1 ? 'kittenDetail.months' : 'kittenDetail.month');
      return months > 0 ? `${years} ${yearLabel} ${t('kittenDetail.and')} ${months} ${monthLabel}` : `${years} ${yearLabel}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <p className="text-gold text-xl font-serif">{t('kittenDetail.loading')}</p>
      </div>
    );
  }

  if (!kitten) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight">
        <div className="text-center">
          <p className="text-gold text-xl font-serif mb-4">{t('kittenDetail.notFound')}</p>
          <Link to="/#licornes">
            <Button className="bg-crimson hover:bg-crimson-dark text-ivory border border-gold rounded-full">
              {t('kittenDetail.backToKittens')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const profilePhoto = media.find(m => m.media_type === 'photo');

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-forest to-midnight">
      <div className="container mx-auto px-4 py-8">
        <Link to="/#licornes">
          <Button
            variant="outline"
            className="mb-8 border-gold text-gold hover:bg-gold/10 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('kittenDetail.backToKittens')}
          </Button>
        </Link>

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
                  <p className="text-gold/50 font-serif">{t('kittenDetail.noPhoto')}</p>
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
                      <p className="text-sm text-ivory/60">{t('kittenDetail.birthDate')}</p>
                      <p className="text-ivory">{new Date(kitten.birth_date).toLocaleDateString(language === 'en' ? 'en-GB' : language === 'es' ? 'es-ES' : 'fr-FR')}</p>
                    </div>
                  </div>
                )}

                {kitten.gender && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-gold">♂♀</div>
                    <div>
                      <p className="text-sm text-ivory/60">{t('kittenDetail.gender')}</p>
                      <p className="text-ivory">{kitten.gender === 'male' ? t('kittenDetail.male') : t('kittenDetail.female')}</p>
                    </div>
                  </div>
                )}

                {kitten.color && (
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-ivory/60">{t('kittenDetail.color')}</p>
                      <p className="text-ivory">{kitten.color}</p>
                    </div>
                  </div>
                )}

                {kitten.current_weight && (
                  <div className="flex items-center gap-3">
                    <Weight className="h-5 w-5 text-gold" />
                    <div>
                      <p className="text-sm text-ivory/60">{t('kittenDetail.weight')}</p>
                      <p className="text-ivory">{kitten.current_weight ? (kitten.current_weight / 1000).toFixed(1) : '0'} kg</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {kitten.breed_info && (
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-gold">{t('kittenDetail.about')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-ivory/80 leading-relaxed">{kitten.breed_info}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>


        {/* Tabs for Gallery, Milestones, Updates, and Vet Visits */}
        <Tabs defaultValue="gallery" className="mb-12">
          <TabsList className="grid w-full grid-cols-4 bg-midnight/50 border border-gold/30">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Calendar className="w-4 h-4 mr-2" />
              {t('kittenDetail.gallery')}
            </TabsTrigger>
            <TabsTrigger value="milestones" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Activity className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <TrendingUp className="w-4 h-4 mr-2" />
              Updates
            </TabsTrigger>
            <TabsTrigger value="vet" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Stethoscope className="w-4 h-4 mr-2" />
              Visites Vétérinaires
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            {media.length > 0 ? (
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                      <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gold/20 hover:border-gold transition-all">
                        {item.media_type === 'photo' ? (
                          <img
                            src={item.file_url}
                            alt={getTranslatedCaption(item) || kitten.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <video
                            src={item.file_url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                        {(item.caption || item.caption_en || item.caption_es) && (
                          <div className="absolute bottom-0 left-0 right-0 bg-midnight/80 p-2 text-xs text-ivory/80">
                            {getTranslatedCaption(item)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
                <CardContent className="py-12 text-center">
                  <p className="text-ivory/60">{t('kittenDetail.noPhotos')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
              <CardContent className="pt-6">
                {milestones.length > 0 ? (
                  <div className="space-y-4">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="p-4 bg-midnight/30 rounded-[2rem] border border-gold/20">
                        <div className="flex items-start gap-4">
                          <Activity className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gold">{milestone.milestone_type}</h4>
                              <span className="text-sm text-ivory/60">
                                {new Date(milestone.milestone_date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            {milestone.description && (
                              <p className="text-ivory/80 text-sm">{milestone.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ivory/60 text-center py-12">Aucun milestone enregistré</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
              <CardContent className="pt-6">
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="p-4 bg-midnight/30 rounded-[2rem] border border-gold/20">
                        <div className="flex items-start gap-4">
                          <TrendingUp className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                {update.weight && (
                                  <p className="font-semibold text-gold">Poids: {update.weight} g</p>
                                )}
                              </div>
                              <span className="text-sm text-ivory/60">
                                {new Date(update.update_date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            {update.notes && (
                              <p className="text-ivory/80 text-sm">{update.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ivory/60 text-center py-12">Aucune mise à jour enregistrée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vet Visits Tab */}
          <TabsContent value="vet">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-gold/30">
              <CardContent className="pt-6">
                {vetVisits.length > 0 ? (
                  <div className="space-y-4">
                    {vetVisits.map((visit) => (
                      <div key={visit.id} className="p-4 bg-midnight/30 rounded-[2rem] border border-gold/20">
                        <div className="flex items-start gap-4">
                          <Stethoscope className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                {visit.visit_type && (
                                  <h4 className="font-semibold text-gold">{visit.visit_type}</h4>
                                )}
                                {visit.vet_name && (
                                  <p className="text-sm text-ivory/70">Vétérinaire: {visit.vet_name}</p>
                                )}
                              </div>
                              <span className="text-sm text-ivory/60">
                                {new Date(visit.visit_date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            {visit.notes && (
                              <p className="text-ivory/80 text-sm mb-2">{visit.notes}</p>
                            )}
                            {visit.next_visit_date && (
                              <p className="text-sm text-gold/80">
                                Prochaine visite: {new Date(visit.next_visit_date).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ivory/60 text-center py-12">Aucune visite vétérinaire enregistrée</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
