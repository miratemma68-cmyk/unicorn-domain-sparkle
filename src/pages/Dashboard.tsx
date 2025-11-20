import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Cat } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Kitten {
  id: string;
  name: string;
  birth_date: string;
  gender: string;
  color: string;
  current_weight: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const { t } = useLanguage();
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [loadingKittens, setLoadingKittens] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadKittens();
    }
  }, [user, isAdmin]);

  const loadKittens = async () => {
    try {
      // Admins should not see kittens in client dashboard
      if (isAdmin) {
        setKittens([]);
        setLoadingKittens(false);
        return;
      }

      // Load only kittens assigned to this client
      const { data, error } = await supabase
        .from('client_kittens')
        .select(`
          kittens (
            id,
            name,
            birth_date,
            gender,
            color,
            current_weight
          )
        `)
        .eq('client_id', user?.id);

      if (error) throw error;
      
      // Extract kittens from the nested structure
      const clientKittens = data?.map(item => item.kittens).filter(Boolean) || [];
      setKittens(clientKittens as Kitten[]);
    } catch (error: any) {
      toast.error(t('dashboard.errorLoadingKittens'));
      console.error('Error loading kittens:', error);
    } finally {
      setLoadingKittens(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(t('dashboard.signOutSuccess'));
    navigate('/');
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    
    if (months < 1) {
      const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} ${t(days > 1 ? 'kittenDetail.days' : 'kittenDetail.day')}`;
    }
    
    if (months < 12) {
      return `${months} ${t(months > 1 ? 'kittenDetail.months' : 'kittenDetail.month')}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const yearLabel = t(years > 1 ? 'kittenDetail.years' : 'kittenDetail.year');
    const monthLabel = t(remainingMonths > 1 ? 'kittenDetail.months' : 'kittenDetail.month');
    return remainingMonths > 0
      ? `${years} ${yearLabel} ${t('kittenDetail.and')} ${remainingMonths} ${monthLabel}`
      : `${years} ${yearLabel}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight via-forest to-midnight">
        <p className="text-gold text-xl font-serif">{t('dashboard.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-forest to-midnight">
      <header className="border-b border-gold/20 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="text-xl md:text-2xl font-serif text-gold/70 hover:text-gold transition-colors"
            >
              Domaine des Licornes
            </a>
            <span className="text-gold/30">|</span>
            <h1 className="text-xl md:text-2xl font-serif text-gold medieval-glow">
              {t('dashboard.title')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button
                onClick={() => navigate('/admin')}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10"
              >
                {t('nav.administration')}
              </Button>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('dashboard.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="kittens" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="kittens">
              <Cat className="mr-2 h-4 w-4" />
              {t('dashboard.myUnicorns')}
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              {t('dashboard.myProfile')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kittens">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loadingKittens ? (
                <p className="text-ivory/80 col-span-full text-center py-12">
                  {t('dashboard.loadingKittens')}
                </p>
              ) : kittens.length === 0 ? (
                <Card className="col-span-full tapestry-border bg-card/80">
                  <CardContent className="py-12 text-center">
                    <Cat className="mx-auto h-16 w-16 text-gold/50 mb-4" />
                    <p className="text-ivory/80 text-lg">
                      {t('dashboard.noKittens')}
                    </p>
                    <p className="text-ivory/60 text-sm mt-2">
                      {t('dashboard.contactInfo')}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                kittens.map((kitten) => (
                  <Card
                    key={kitten.id}
                    className="tapestry-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/kitten/${kitten.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-gold font-serif flex items-center">
                        <Cat className="mr-2 h-5 w-5" />
                        {kitten.name}
                      </CardTitle>
                      <CardDescription className="text-ivory/80">
                        {calculateAge(kitten.birth_date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-ivory/60">{t('dashboard.gender')}:</span>
                        <span className="text-ivory">{kitten.gender ? t(`dashboard.${kitten.gender}`) : t('dashboard.notSpecified')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ivory/60">{t('dashboard.color')}:</span>
                        <span className="text-ivory">{kitten.color || t('dashboard.notSpecified')}</span>
                      </div>
                      {kitten.current_weight && (
                        <div className="flex justify-between text-sm">
                          <span className="text-ivory/60">{t('dashboard.weight')}:</span>
                          <span className="text-ivory">{kitten.current_weight} kg</span>
                        </div>
                      )}
                      <Button className="w-full mt-4 bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="max-w-2xl mx-auto tapestry-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-serif">{t('dashboard.myProfile')}</CardTitle>
                <CardDescription className="text-ivory/80">
                  {t('dashboard.profileTitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-ivory/60 text-sm">{t('dashboard.email')}</label>
                  <p className="text-ivory">{user?.email}</p>
                </div>
                <div className="pt-4 border-t border-gold/20">
                  <p className="text-ivory/60 text-sm">
                    {t('dashboard.contactInfo')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
