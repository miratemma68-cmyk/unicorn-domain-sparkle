import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Cat } from 'lucide-react';
import { toast } from 'sonner';

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
  }, [user]);

  const loadKittens = async () => {
    try {
      const { data, error } = await supabase
        .from('kittens')
        .select(`
          id,
          name,
          birth_date,
          gender,
          color,
          current_weight
        `)
        .order('birth_date', { ascending: false });

      if (error) throw error;
      setKittens(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des chatons');
      console.error('Error loading kittens:', error);
    } finally {
      setLoadingKittens(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
    
    if (months < 1) {
      const days = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} jour${days > 1 ? 's' : ''}`;
    }
    
    if (months < 12) {
      return `${months} mois`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0
      ? `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`
      : `${years} an${years > 1 ? 's' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight via-forest to-midnight">
        <p className="text-gold text-xl font-serif">Chargement...</p>
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
              Espace Client
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button
                onClick={() => navigate('/admin')}
                variant="outline"
                className="border-gold text-gold hover:bg-gold/10"
              >
                Admin
              </Button>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="kittens" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="kittens">
              <Cat className="mr-2 h-4 w-4" />
              Mes Licornes
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Mon Profil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kittens">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loadingKittens ? (
                <p className="text-ivory/80 col-span-full text-center py-12">
                  Chargement des chatons...
                </p>
              ) : kittens.length === 0 ? (
                <Card className="col-span-full tapestry-border bg-card/80">
                  <CardContent className="py-12 text-center">
                    <Cat className="mx-auto h-16 w-16 text-gold/50 mb-4" />
                    <p className="text-ivory/80 text-lg">
                      Aucun chaton assigné pour le moment
                    </p>
                    <p className="text-ivory/60 text-sm mt-2">
                      Contactez-nous pour plus d'informations
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
                        <span className="text-ivory/60">Sexe:</span>
                        <span className="text-ivory">{kitten.gender || 'Non spécifié'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ivory/60">Couleur:</span>
                        <span className="text-ivory">{kitten.color || 'Non spécifié'}</span>
                      </div>
                      {kitten.current_weight && (
                        <div className="flex justify-between text-sm">
                          <span className="text-ivory/60">Poids:</span>
                          <span className="text-ivory">{kitten.current_weight} kg</span>
                        </div>
                      )}
                      <Button className="w-full mt-4 bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
                        Voir les détails
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
                <CardTitle className="text-gold font-serif">Mon Profil</CardTitle>
                <CardDescription className="text-ivory/80">
                  Informations de votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-ivory/60 text-sm">Email</label>
                  <p className="text-ivory">{user?.email}</p>
                </div>
                <div className="pt-4 border-t border-gold/20">
                  <p className="text-ivory/60 text-sm">
                    Pour modifier vos informations, veuillez nous contacter.
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
