import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Loader2 } from 'lucide-react';

export const NewsletterManager = () => {
  const { toast } = useToast();
  const [news1, setNews1] = useState('');
  const [news2, setNews2] = useState('');
  const [news3, setNews3] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendNewsletter = async () => {
    if (!news1.trim() || !news2.trim() || !news3.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les 3 actualités",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          news: [news1, news2, news3]
        }
      });

      if (error) throw error;

      toast({
        title: "Newsletter envoyée !",
        description: `Newsletter envoyée avec succès à ${data.recipientCount} contacts`,
      });

      // Clear form
      setNews1('');
      setNews2('');
      setNews3('');
    } catch (error: any) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Erreur",
        description: error.message || "Échec de l'envoi de la newsletter",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-gold/30 bg-midnight/50">
      <CardHeader>
        <CardTitle className="text-gold">Newsletter</CardTitle>
        <CardDescription className="text-ivory/60">
          Créez et envoyez une newsletter à tous vos contacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="news1" className="text-ivory">
              Actualité 1
            </Label>
            <Textarea
              id="news1"
              value={news1}
              onChange={(e) => setNews1(e.target.value)}
              placeholder="Ex: Nouvelle portée de chatons disponibles..."
              className="bg-midnight/30 border-gold/20 text-ivory min-h-[100px]"
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="news2" className="text-ivory">
              Actualité 2
            </Label>
            <Textarea
              id="news2"
              value={news2}
              onChange={(e) => setNews2(e.target.value)}
              placeholder="Ex: Événement à venir, concours félin..."
              className="bg-midnight/30 border-gold/20 text-ivory min-h-[100px]"
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="news3" className="text-ivory">
              Actualité 3
            </Label>
            <Textarea
              id="news3"
              value={news3}
              onChange={(e) => setNews3(e.target.value)}
              placeholder="Ex: Conseil d'élevage, nouveauté du site..."
              className="bg-midnight/30 border-gold/20 text-ivory min-h-[100px]"
              disabled={isSending}
            />
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSendNewsletter}
            disabled={isSending}
            className="w-full bg-gold hover:bg-gold/90 text-midnight font-semibold"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer la Newsletter
              </>
            )}
          </Button>
          <p className="text-ivory/40 text-xs text-center mt-2">
            La newsletter sera générée par IA et envoyée dans la langue de chaque contact
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
