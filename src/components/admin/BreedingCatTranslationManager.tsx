import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Languages } from 'lucide-react';

interface BreedingCat {
  id: string;
  name: string;
  personality: string | null;
  personality_en: string | null;
  personality_es: string | null;
  pedigree: string | null;
  pedigree_en: string | null;
  pedigree_es: string | null;
}

export const BreedingCatTranslationManager = () => {
  const [cats, setCats] = useState<BreedingCat[]>([]);
  const [selectedCat, setSelectedCat] = useState<BreedingCat | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    try {
      const { data, error } = await supabase
        .from('breeding_cats')
        .select('id, name, personality, personality_en, personality_es, pedigree, pedigree_en, pedigree_es')
        .order('name');

      if (error) throw error;
      setCats(data || []);
      if (data && data.length > 0) {
        setSelectedCat(data[0]);
      }
    } catch (error) {
      console.error('Error loading cats:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les chats reproducteurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCat) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('breeding_cats')
        .update({
          personality: selectedCat.personality,
          personality_en: selectedCat.personality_en,
          personality_es: selectedCat.personality_es,
          pedigree: selectedCat.pedigree,
          pedigree_en: selectedCat.pedigree_en,
          pedigree_es: selectedCat.pedigree_es,
        })
        .eq('id', selectedCat.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Les traductions ont été enregistrées",
      });
      
      // Reload cats to ensure we have the latest data
      loadCats();
    } catch (error) {
      console.error('Error saving translations:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les traductions",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-ivory/60">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-gold/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gold">
          <Languages className="h-5 w-5" />
          Traductions des Reproducteurs
        </CardTitle>
        <CardDescription className="text-ivory/70">
          Gérez les traductions de personnalité et pedigree pour chaque chat reproducteur
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cat Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ivory/90">
            Sélectionner un chat
          </label>
          <Select
            value={selectedCat?.id}
            onValueChange={(value) => {
              const cat = cats.find(c => c.id === value);
              if (cat) setSelectedCat(cat);
            }}
          >
            <SelectTrigger className="bg-midnight/50 border-gold/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cats.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCat && (
          <>
            {/* Personality Translations */}
            <div className="space-y-4">
              <h3 className="text-lg font-display text-gold">Caractère / Personnalité</h3>
              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                </TabsList>
                <TabsContent value="fr" className="space-y-2">
                  <Textarea
                    placeholder="Personnalité en français..."
                    value={selectedCat.personality || ''}
                    onChange={(e) => setSelectedCat({ ...selectedCat, personality: e.target.value })}
                    className="min-h-[120px] bg-midnight/50 border-gold/30 text-ivory"
                  />
                </TabsContent>
                <TabsContent value="en" className="space-y-2">
                  <Textarea
                    placeholder="Personality in English..."
                    value={selectedCat.personality_en || ''}
                    onChange={(e) => setSelectedCat({ ...selectedCat, personality_en: e.target.value })}
                    className="min-h-[120px] bg-midnight/50 border-gold/30 text-ivory"
                  />
                </TabsContent>
                <TabsContent value="es" className="space-y-2">
                  <Textarea
                    placeholder="Personalidad en español..."
                    value={selectedCat.personality_es || ''}
                    onChange={(e) => setSelectedCat({ ...selectedCat, personality_es: e.target.value })}
                    className="min-h-[120px] bg-midnight/50 border-gold/30 text-ivory"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Pedigree Translations */}
            <div className="space-y-4">
              <h3 className="text-lg font-display text-gold">Pedigree</h3>
              <Tabs defaultValue="fr" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="fr">🇫🇷 Français</TabsTrigger>
                  <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
                  <TabsTrigger value="es">🇪🇸 Español</TabsTrigger>
                </TabsList>
                <TabsContent value="fr" className="space-y-2">
                  <Textarea
                    placeholder="Pedigree en français..."
                    value={selectedCat.pedigree || ''}
                    onChange={(e) => setSelectedCat({ ...selectedCat, pedigree: e.target.value })}
                    className="min-h-[200px] bg-midnight/50 border-gold/30 text-ivory font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="en" className="space-y-2">
                  <Textarea
                    placeholder="Pedigree in English..."
                    value={selectedCat.pedigree_en || ''}
                    onChange={(e) => setSelectedCat({ ...selectedCat, pedigree_en: e.target.value })}
                    className="min-h-[200px] bg-midnight/50 border-gold/30 text-ivory font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="es" className="space-y-2">
                  <Textarea
                    placeholder="Pedigrí en español..."
                    value={selectedCat.pedigree_es || ''}
                    onChange={(e) => setSelectedCat({ ...selectedCat, pedigree_es: e.target.value })}
                    className="min-h-[200px] bg-midnight/50 border-gold/30 text-ivory font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer les traductions'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
