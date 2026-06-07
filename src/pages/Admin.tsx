import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Upload, Image, Cat, Languages, HelpCircle } from 'lucide-react';
import { MediaUpload } from '@/components/admin/MediaUpload';
import { MediaGallery } from '@/components/admin/MediaGallery';
import { BreedingCatMediaManager } from '@/components/admin/BreedingCatMediaManager';
import { BreedingCatTranslationManager } from '@/components/admin/BreedingCatTranslationManager';
import { DomainGalleryManager } from '@/components/admin/DomainGalleryManager';
import { EducationMediaManager } from '@/components/admin/EducationMediaManager';
import { TestimonialsMediaManager } from '@/components/admin/TestimonialsMediaManager';
import { ClientKittenManager } from '@/components/admin/ClientKittenManager';
import { KittenDataManager } from '@/components/admin/KittenDataManager';
import { FAQManager } from '@/components/admin/FAQManager';
import { NewsletterManager } from '@/components/admin/NewsletterManager';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading, isAdmin } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, isLoading, navigate]);

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
          <h1 className="text-2xl md:text-3xl font-serif text-gold medieval-glow">
            {t('admin.title')}
          </h1>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-gold text-gold hover:bg-gold/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('admin.back')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="reproducteurs" className="w-full">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="reproducteurs">
              <Cat className="mr-2 h-4 w-4" />
              {t('admin.breedingCats')}
            </TabsTrigger>
            <TabsTrigger value="translations">
              <Languages className="mr-2 h-4 w-4" />
              {t('admin.translations')}
            </TabsTrigger>
            <TabsTrigger value="kitten-data">
              <Cat className="mr-2 h-4 w-4" />
              {t('admin.kittenData')}
            </TabsTrigger>
            <TabsTrigger value="media">
              <Upload className="mr-2 h-4 w-4" />
              {t('admin.kittens')}
            </TabsTrigger>
            <TabsTrigger value="domain">
              <Image className="mr-2 h-4 w-4" />
              {t('admin.domainGallery')}
            </TabsTrigger>
            <TabsTrigger value="education">
              <Image className="mr-2 h-4 w-4" />
              {t('admin.education')}
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <Image className="mr-2 h-4 w-4" />
              {t('admin.testimonials')}
            </TabsTrigger>
            <TabsTrigger value="management">
              <Image className="mr-2 h-4 w-4" />
              {t('admin.management')}
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reproducteurs" className="space-y-6">
            <BreedingCatMediaManager />
          </TabsContent>

          <TabsContent value="translations" className="space-y-6">
            <BreedingCatTranslationManager />
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

          <TabsContent value="testimonials" className="space-y-6">
            <TestimonialsMediaManager />
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <ClientKittenManager />
          </TabsContent>

          <TabsContent value="kitten-data" className="space-y-6">
            <KittenDataManager />
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <FAQManager />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
