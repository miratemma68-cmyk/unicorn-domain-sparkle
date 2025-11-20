import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, Video, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Kitten {
  id: string;
  name: string;
}

export function MediaUpload() {
  const { user } = useAuth();
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [selectedKitten, setSelectedKitten] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [loadingKittens, setLoadingKittens] = useState(true);

  useEffect(() => {
    loadKittens();
  }, []);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview('');
    }
  }, [file]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Type de fichier non supporté. Utilisez JPG, PNG, WEBP, MP4 ou MOV.');
        return;
      }

      // Validate file size (max 50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Maximum 50MB.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!selectedKitten || !file || !user) {
      toast.error('Veuillez sélectionner un chaton et un fichier');
      return;
    }

    setIsUploading(true);

    try {
      // Determine media type
      const mediaType = file.type.startsWith('image/') ? 'photo' : 'video';
      
      // Create file path: {kitten_id}/{timestamp}_{filename}
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      // Sanitize filename: remove spaces and special characters
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${selectedKitten}/${timestamp}_${sanitizedName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('kitten-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('kitten-media')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('kitten_media')
        .insert({
          kitten_id: selectedKitten,
          media_type: mediaType,
          file_path: filePath,
          file_url: urlData.publicUrl,
          caption: caption || null,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success('Média uploadé avec succès !');
      
      // Reset form
      setFile(null);
      setPreview('');
      setCaption('');
      setSelectedKitten('');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload: ' + (error.message || 'Erreur inconnue'));
    } finally {
      setIsUploading(false);
    }
  };

  const selectedKittenName = kittens.find(k => k.id === selectedKitten)?.name;

  return (
    <Card className="tapestry-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gold font-serif flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Uploader des médias
        </CardTitle>
        <CardDescription className="text-ivory/80">
          Ajoutez des photos et vidéos pour vos chatons
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Kitten Selection */}
        <div>
          <Label htmlFor="kitten-select" className="text-gold font-serif">
            Chaton *
          </Label>
          <Select
            value={selectedKitten}
            onValueChange={setSelectedKitten}
            disabled={loadingKittens}
          >
            <SelectTrigger id="kitten-select" className="bg-input border-gold/30 text-foreground mt-1">
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
          {selectedKittenName && (
            <p className="text-xs text-ivory/60 mt-1">
              Les fichiers seront sauvegardés dans: {selectedKittenName}/
            </p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <Label htmlFor="file-upload" className="text-gold font-serif">
            Fichier (Photo ou Vidéo) *
          </Label>
          <Input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime"
            onChange={handleFileChange}
            className="bg-input border-gold/30 text-foreground mt-1"
          />
          <p className="text-xs text-ivory/60 mt-1">
            Formats acceptés: JPG, PNG, WEBP, MP4, MOV (max 50MB)
          </p>
        </div>

        {/* Preview */}
        {preview && file && (
          <div className="border border-gold/30 rounded-lg p-4 bg-midnight/50">
            <Label className="text-gold font-serif mb-2 block">Aperçu:</Label>
            {file.type.startsWith('image/') ? (
              <div className="relative">
                <Image className="absolute top-2 left-2 h-5 w-5 text-gold" />
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="relative">
                <Video className="absolute top-2 left-2 h-5 w-5 text-gold z-10" />
                <video
                  src={preview}
                  controls
                  className="w-full h-64 rounded-lg"
                />
              </div>
            )}
            <p className="text-sm text-ivory/80 mt-2">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}

        {/* Caption */}
        <div>
          <Label htmlFor="caption" className="text-gold font-serif">
            Légende (optionnel)
          </Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ajoutez une description ou un commentaire..."
            rows={3}
            className="bg-input border-gold/30 text-foreground focus:border-gold resize-none mt-1"
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedKitten || !file || isUploading}
          className="w-full bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Upload en cours...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Uploader le média
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
