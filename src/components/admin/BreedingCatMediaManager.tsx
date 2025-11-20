import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

interface BreedingCat {
  id: string;
  name: string;
}

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  caption_en: string | null;
  caption_es: string | null;
  display_order: number;
  media_type: string;
}

export const BreedingCatMediaManager = () => {
  const [breedingCats, setBreedingCats] = useState<BreedingCat[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBreedingCats();
  }, []);

  useEffect(() => {
    if (selectedCatId) {
      loadGallery();
    }
  }, [selectedCatId]);

  const loadBreedingCats = async () => {
    const { data, error } = await supabase
      .from('breeding_cats')
      .select('id, name')
      .order('name');

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les reproducteurs",
        variant: "destructive"
      });
      return;
    }

    setBreedingCats(data || []);
    if (data && data.length > 0 && !selectedCatId) {
      setSelectedCatId(data[0].id);
    }
  };

  const loadGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('breeding_cat_gallery')
      .select('*')
      .eq('cat_id', selectedCatId)
      .order('display_order');

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la galerie",
        variant: "destructive"
      });
    } else {
      setGallery(data || []);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedCatId) return;

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedCatId}/${Date.now()}-${i}.${fileExt}`;
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

      try {
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('breeding-cat-media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('breeding-cat-media')
          .getPublicUrl(fileName);

        // Get next display order
        const maxOrder = gallery.length > 0 
          ? Math.max(...gallery.map(item => item.display_order))
          : 0;

        // Insert into database
        const { error: dbError } = await supabase
          .from('breeding_cat_gallery')
          .insert({
            cat_id: selectedCatId,
            image_url: publicUrl,
            media_type: mediaType,
            display_order: maxOrder + 1,
            caption: ''
          });

        if (dbError) throw dbError;

      } catch (error: any) {
        toast({
          title: "Erreur d'upload",
          description: error.message,
          variant: "destructive"
        });
      }
    }

    setUploading(false);
    await loadGallery();
    toast({
      title: "Succès",
      description: `${files.length} fichier(s) uploadé(s)`
    });

    // Reset input
    event.target.value = '';
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;

    try {
      // Extract file path from URL
      const urlParts = item.image_url.split('/');
      const fileName = urlParts.slice(-2).join('/'); // Get last two parts (catId/filename)

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('breeding-cat-media')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('breeding_cat_gallery')
        .delete()
        .eq('id', item.id);

      if (dbError) throw dbError;

      await loadGallery();
      toast({
        title: "Succès",
        description: "Média supprimé"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCaptionUpdate = async (itemId: string, newCaption: string) => {
    const { error } = await supabase
      .from('breeding_cat_gallery')
      .update({ caption: newCaption })
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la légende",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Légende mise à jour"
      });
    }
  };

  const handleCaptionEnUpdate = async (itemId: string, newCaption: string) => {
    const { error } = await supabase
      .from('breeding_cat_gallery')
      .update({ caption_en: newCaption })
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la légende EN",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Légende EN mise à jour"
      });
    }
  };

  const handleCaptionEsUpdate = async (itemId: string, newCaption: string) => {
    const { error } = await supabase
      .from('breeding_cat_gallery')
      .update({ caption_es: newCaption })
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la légende ES",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Légende ES mise à jour"
      });
    }
  };

  const selectedCat = breedingCats.find(cat => cat.id === selectedCatId);

  return (
    <div className="space-y-6">
      <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gold font-serif">Gestion des médias des reproducteurs</CardTitle>
          <CardDescription className="text-ivory/80">
            Uploader et gérer les photos et vidéos d'Aloha et Utah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cat-select" className="text-ivory">Reproducteur</Label>
            <Select value={selectedCatId} onValueChange={setSelectedCatId}>
              <SelectTrigger id="cat-select" className="bg-midnight/50 border-gold/30 text-ivory">
                <SelectValue placeholder="Sélectionner un reproducteur" />
              </SelectTrigger>
              <SelectContent>
                {breedingCats.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file-upload" className="text-ivory">
              Uploader des photos ou vidéos
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || !selectedCatId}
                className="bg-midnight/50 border-gold/30 text-ivory"
              />
              {uploading && <Loader2 className="h-5 w-5 animate-spin text-gold" />}
            </div>
            <p className="text-xs text-ivory/60 mt-1">
              Formats acceptés : JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV (max 50MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedCat && (
        <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gold font-serif">
              Galerie de {selectedCat.name}
            </CardTitle>
            <CardDescription className="text-ivory/80">
              {gallery.length} média(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : gallery.length === 0 ? (
              <p className="text-center text-ivory/60 py-8">
                Aucun média uploadé pour ce reproducteur
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="border border-gold/30 rounded-lg overflow-hidden bg-midnight/30">
                    <div className="relative aspect-square">
                      {item.media_type === 'video' ? (
                        <video
                          src={item.image_url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.image_url}
                          alt={item.caption || 'Photo'}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="bg-midnight/80 p-1 rounded">
                          {item.media_type === 'video' ? (
                            <Video className="h-4 w-4 text-gold" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-gold" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-ivory/60">Légende FR</Label>
                        <Input
                          placeholder="Ajouter une légende..."
                          defaultValue={item.caption}
                          onBlur={(e) => handleCaptionUpdate(item.id, e.target.value)}
                          className="bg-midnight/50 border-gold/30 text-ivory text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-ivory/60">Légende EN</Label>
                        <Input
                          placeholder="Add a caption..."
                          defaultValue={item.caption_en || ''}
                          onBlur={(e) => handleCaptionEnUpdate(item.id, e.target.value)}
                          className="bg-midnight/50 border-gold/30 text-ivory text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-ivory/60">Légende ES</Label>
                        <Input
                          placeholder="Añadir una leyenda..."
                          defaultValue={item.caption_es || ''}
                          onBlur={(e) => handleCaptionEsUpdate(item.id, e.target.value)}
                          className="bg-midnight/50 border-gold/30 text-ivory text-sm"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
