import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, Image, Cat } from 'lucide-react';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { MediaGallery } from '@/components/admin/MediaGallery';
import { BreedingCatMediaManager } from '@/components/admin/BreedingCatMediaManager';
import { DomainGalleryManager } from '@/components/admin/DomainGalleryManager';
import { EducationMediaManager } from '@/components/admin/EducationMediaManager';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, isLoading, navigate]);

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
          <h1 className="text-2xl md:text-3xl font-serif text-gold medieval-glow">
            Administration
          </h1>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="reproducteurs" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="reproducteurs">
              <Cat className="mr-2 h-4 w-4" />
              Reproducteurs
            </TabsTrigger>
            <TabsTrigger value="media">
              <Upload className="mr-2 h-4 w-4" />
              Chatons
            </TabsTrigger>
            <TabsTrigger value="domain">
              <Image className="mr-2 h-4 w-4" />
              Galerie Domaine
            </TabsTrigger>
            <TabsTrigger value="education">
              <Image className="mr-2 h-4 w-4" />
              Éducation
            </TabsTrigger>
            <TabsTrigger value="management">
              <Image className="mr-2 h-4 w-4" />
              Gestion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reproducteurs" className="space-y-6">
            <BreedingCatMediaManager />
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <MediaUpload />
            <MediaGallery />
          </TabsContent>

          <TabsContent value="domain" className="space-y-6">
            <DomainGalleryManager />
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <EducationMediaManager />
          </TabsContent>

          <TabsContent value="management">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold font-serif">Gérer les chatons</CardTitle>
                  <CardDescription className="text-ivory/80">
                    Ajouter et modifier les informations des chatons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ivory/60 text-sm mb-4">
                    Utilisez le Cloud backend pour gérer les chatons, leurs mises à jour, et assignations aux clients.
                  </p>
                  <Button className="w-full bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
                    Ouvrir le Cloud
                  </Button>
                </CardContent>
              </Card>

              <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold font-serif">Gérer les clients</CardTitle>
                  <CardDescription className="text-ivory/80">
                    Assigner des chatons aux clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ivory/60 text-sm mb-4">
                    Consultez la liste des clients et assignez-leur leurs chatons adoptés.
                  </p>
                  <Button className="w-full bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
                    Ouvrir le Cloud
                  </Button>
                </CardContent>
              </Card>

              <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold font-serif">Demandes de contact</CardTitle>
                  <CardDescription className="text-ivory/80">
                    Voir les demandes d'adoption
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-ivory/60 text-sm mb-4">
                    Consultez toutes les demandes de contact reçues via le formulaire.
                  </p>
                  <Button className="w-full bg-crimson hover:bg-crimson-dark text-ivory border border-gold">
                    Ouvrir le Cloud
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 tapestry-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-serif">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-ivory/80">
                <div>
                  <h3 className="font-semibold text-gold mb-2">1. Ajouter un chaton</h3>
                  <p className="text-sm">
                    Allez dans Cloud → Tables → kittens et ajoutez les informations du chaton.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-2">2. Assigner à un client</h3>
                  <p className="text-sm">
                    Allez dans Cloud → Tables → client_kittens et créez une association entre le client et le chaton.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-2">3. Ajouter des mises à jour</h3>
                  <p className="text-sm">
                    Utilisez les tables kitten_updates, kitten_milestones, et kitten_vet_visits pour suivre la croissance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gold mb-2">4. Uploader des photos/vidéos via l'interface</h3>
                  <p className="text-sm">
                    Utilisez l'onglet "Médias" ci-dessus pour uploader facilement des photos et vidéos. Les fichiers seront automatiquement organisés par chaton.
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
