import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Video, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Kitten {
  id: string;
  name: string;
}

interface Media {
  id: string;
  media_type: string;
  file_url: string;
  file_path: string;
  caption: string | null;
  created_at: string;
}

export function MediaGallery() {
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [selectedKitten, setSelectedKitten] = useState<string>('');
  const [media, setMedia] = useState<Media[]>([]);
  const [loadingKittens, setLoadingKittens] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadKittens();
  }, []);

  useEffect(() => {
    if (selectedKitten) {
      loadMedia();
    } else {
      setMedia([]);
    }
  }, [selectedKitten]);

  const loadKittens = async () => {
    try {
      const { data, error } = await supabase
        .from('kittens')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setKittens(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des chatons');
      console.error('Error loading kittens:', error);
    } finally {
      setLoadingKittens(false);
    }
  };

  const loadMedia = async () => {
    if (!selectedKitten) return;

    setLoadingMedia(true);
    try {
      const { data, error } = await supabase
        .from('kitten_media')
        .select('id, media_type, file_url, file_path, caption, created_at')
        .eq('kitten_id', selectedKitten)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des médias');
      console.error('Error loading media:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleDeleteClick = (mediaItem: Media) => {
    setMediaToDelete(mediaItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;

    setIsDeleting(true);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('kitten-media')
        .remove([mediaToDelete.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('kitten_media')
        .delete()
        .eq('id', mediaToDelete.id);

      if (dbError) throw dbError;

      toast.success('Média supprimé avec succès');
      loadMedia(); // Reload media list
    } catch (error: any) {
      toast.error('Erreur lors de la suppression: ' + (error.message || 'Erreur inconnue'));
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setMediaToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gold font-serif flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            Galerie des médias
          </CardTitle>
          <CardDescription className="text-ivory/80">
            Consultez et gérez les photos et vidéos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Kitten Selection */}
          <div>
            <Select
              value={selectedKitten}
              onValueChange={setSelectedKitten}
              disabled={loadingKittens}
            >
              <SelectTrigger className="bg-input border-gold/30 text-foreground">
                <SelectValue placeholder="Sélectionnez un chaton" />
              </SelectTrigger>
              <SelectContent>
                {kittens.map((kitten) => (
                  <SelectItem key={kitten.id} value={kitten.id}>
                    {kitten.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Media Grid */}
          {loadingMedia ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12 text-ivory/60">
              {selectedKitten
                ? 'Aucun média pour ce chaton'
                : 'Sélectionnez un chaton pour voir ses médias'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative group border border-gold/30 rounded-lg overflow-hidden bg-midnight/50"
                >
                  {item.media_type === 'photo' ? (
                    <>
                      <ImageIcon className="absolute top-2 left-2 h-5 w-5 text-gold z-10" />
                      <img
                        src={item.file_url}
                        alt={item.caption || 'Kitten photo'}
                        className="w-full h-48 object-cover"
                      />
                    </>
                  ) : (
                    <>
                      <Video className="absolute top-2 left-2 h-5 w-5 text-gold z-10" />
                      <video
                        src={item.file_url}
                        className="w-full h-48 object-cover"
                        controls
                      />
                    </>
                  )}
                  
                  <div className="p-3 space-y-2">
                    {item.caption && (
                      <p className="text-sm text-ivory/80">{item.caption}</p>
                    )}
                    <p className="text-xs text-ivory/60">
                      {formatDate(item.created_at)}
                    </p>
                    <Button
                      onClick={() => handleDeleteClick(item)}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-gold/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold font-serif">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-ivory/80">
              Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gold/30">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
