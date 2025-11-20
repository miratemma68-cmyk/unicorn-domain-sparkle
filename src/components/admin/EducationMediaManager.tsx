import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Media {
  id: string;
  media_type: string;
  file_url: string;
  file_path: string;
  caption: string | null;
  caption_en: string | null;
  caption_es: string | null;
  created_at: string;
}

export const EducationMediaManager = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('education_media')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les médias",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        // Sanitize filename: remove spaces and special characters
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}_${sanitizedName}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('education-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('education-media')
          .getPublicUrl(filePath);

        const mediaType = file.type.startsWith('video/') ? 'video' : 'photo';

        const { error: dbError } = await supabase
          .from('education_media')
          .insert({
            media_type: mediaType,
            file_url: publicUrl,
            file_path: filePath,
            display_order: media.length
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Succès",
        description: "Médias uploadés avec succès",
      });

      loadMedia();
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteClick = (mediaItem: Media) => {
    setMediaToDelete(mediaItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('education-media')
        .remove([mediaToDelete.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('education_media')
        .delete()
        .eq('id', mediaToDelete.id);

      if (dbError) throw dbError;

      toast({
        title: "Succès",
        description: "Média supprimé avec succès",
      });

      loadMedia();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setMediaToDelete(null);
    }
  };

  const handleCaptionUpdate = async (mediaId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('education_media')
        .update({ caption })
        .eq('id', mediaId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Légende mise à jour",
      });

      loadMedia();
    } catch (error) {
      console.error('Error updating caption:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la légende",
        variant: "destructive",
      });
    }
  };

  const handleCaptionEnUpdate = async (mediaId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('education_media')
        .update({ caption_en: caption })
        .eq('id', mediaId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Légende EN mise à jour",
      });

      loadMedia();
    } catch (error) {
      console.error('Error updating caption EN:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la légende EN",
        variant: "destructive",
      });
    }
  };

  const handleCaptionEsUpdate = async (mediaId: string, caption: string) => {
    try {
      const { error } = await supabase
        .from('education_media')
        .update({ caption_es: caption })
        .eq('id', mediaId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Légende ES mise à jour",
      });

      loadMedia();
    } catch (error) {
      console.error('Error updating caption ES:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la légende ES",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Notre Méthode en Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="education-upload">Ajouter des photos ou vidéos</Label>
            <div className="flex gap-2">
              <Input
                id="education-upload"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Upload..." : "Upload"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="relative group">
                  {item.media_type === 'video' ? (
                    <video
                      src={item.file_url}
                      className="w-full h-40 object-cover rounded-lg"
                      controls
                    />
                  ) : (
                    <img
                      src={item.file_url}
                      alt={item.caption || "Media"}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Légende FR</Label>
                    <Input
                      placeholder="Légende en français"
                      defaultValue={item.caption || ''}
                      onBlur={(e) => handleCaptionUpdate(item.id, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Légende EN</Label>
                    <Input
                      placeholder="Caption in English"
                      defaultValue={item.caption_en || ''}
                      onBlur={(e) => handleCaptionEnUpdate(item.id, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Légende ES</Label>
                    <Input
                      placeholder="Leyenda en español"
                      defaultValue={item.caption_es || ''}
                      onBlur={(e) => handleCaptionEsUpdate(item.id, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {media.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Aucun média uploadé pour le moment
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};