import { useEffect, useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MessageSquareHeart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const L = {
  fr: { title: 'Mon témoignage', desc: 'Partagez votre expérience. Après validation par l\'éleveuse, il sera publié dans « Nos clients partagent leur expérience ».', name: 'Votre prénom', msg: 'Votre témoignage', photo: 'Une photo de votre chat (facultatif)', send: 'Envoyer mon témoignage', sending: 'Envoi…', ok: 'Merci ! Votre témoignage sera publié après validation.', err: 'Erreur lors de l\'envoi', mine: 'Mes témoignages', pending: 'En attente de validation', approved: 'Publié', rejected: 'Non publié', invalid: 'Prénom requis et témoignage de 10 à 2000 caractères.', big: 'Photo trop lourde (10 Mo max).' },
  en: { title: 'My testimonial', desc: 'Share your experience. Once approved by the breeder, it will be published in "Our clients share their experience".', name: 'Your first name', msg: 'Your testimonial', photo: 'A photo of your cat (optional)', send: 'Send my testimonial', sending: 'Sending…', ok: 'Thank you! Your testimonial will be published after approval.', err: 'Error while sending', mine: 'My testimonials', pending: 'Awaiting approval', approved: 'Published', rejected: 'Not published', invalid: 'First name required and testimonial of 10 to 2000 characters.', big: 'Photo too large (10 MB max).' },
  es: { title: 'Mi testimonio', desc: 'Comparte tu experiencia. Tras la validación de la criadora, se publicará en « Nuestros clientes comparten su experiencia ».', name: 'Tu nombre', msg: 'Tu testimonio', photo: 'Una foto de tu gato (opcional)', send: 'Enviar mi testimonio', sending: 'Enviando…', ok: '¡Gracias! Tu testimonio se publicará tras su validación.', err: 'Error al enviar', mine: 'Mis testimonios', pending: 'Pendiente de validación', approved: 'Publicado', rejected: 'No publicado', invalid: 'Nombre obligatorio y testimonio de 10 a 2000 caracteres.', big: 'Foto demasiado pesada (máx. 10 MB).' },
};

const schema = z.object({
  author_name: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(2000),
});

interface Row { id: string; message: string; status: string; photo_url: string | null; created_at: string }

export function ClientTestimonialForm({ userId }: { userId: string }) {
  const { language } = useLanguage();
  const l = L[(language as 'fr' | 'en' | 'es')] || L.fr;
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState<Row[]>([]);

  const load = async () => {
    const { data } = await supabase.from('client_testimonials')
      .select('id, message, status, photo_url, created_at')
      .eq('client_id', userId).order('created_at', { ascending: false });
    setMine(data || []);
  };
  useEffect(() => { load(); }, [userId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ author_name: name, message });
    if (!parsed.success) return toast.error(l.invalid);
    if (file && file.size > 10 * 1024 * 1024) return toast.error(l.big);
    setBusy(true);
    try {
      let photo_url: string | null = null, photo_path: string | null = null;
      if (file) {
        const ext = (file.name.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase();
        photo_path = `clients/${userId}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('testimonials-media').upload(photo_path, file, { contentType: file.type });
        if (error) throw error;
        photo_url = supabase.storage.from('testimonials-media').getPublicUrl(photo_path).data.publicUrl;
      }
      const { error } = await supabase.from('client_testimonials').insert({
        client_id: userId, author_name: parsed.data.author_name, message: parsed.data.message, photo_url, photo_path,
      });
      if (error) throw error;
      toast.success(l.ok);
      setName(''); setMessage(''); setFile(null);
      (document.getElementById('testimonial-photo') as HTMLInputElement | null)?.value && ((document.getElementById('testimonial-photo') as HTMLInputElement).value = '');
      load();
    } catch (err) {
      console.error(err);
      toast.error(l.err);
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="tapestry-border litter-frame testimonial-frame bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gold font-serif flex items-center"><MessageSquareHeart className="mr-2 h-5 w-5" />{l.title}</CardTitle>
          <CardDescription className="text-ivory/80">{l.desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ivory/90">{l.name}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className="rounded-full border-gold/30 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-ivory/90">{l.msg}</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={6} className="rounded-2xl border-gold/30 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-ivory/90">{l.photo}</label>
              <Input id="testimonial-photo" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="rounded-full border-gold/30 mt-1" />
            </div>
            <Button type="submit" disabled={busy} className="w-full bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold rounded-full">
              {busy ? l.sending : l.send}
            </Button>
          </form>
        </CardContent>
      </Card>

      {mine.length > 0 && (
        <Card className="tapestry-border litter-frame testimonial-frame testimonial-list bg-card/80 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-gold font-serif">{l.mine}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {mine.map((r) => (
              <div key={r.id} className="border-b border-gold/20 pb-3 flex gap-3">
                {r.photo_url && <img src={r.photo_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-gold/30" />}
                <div className="flex-1 min-w-0">
                  <p className="text-ivory/90 text-sm whitespace-pre-line break-words">{r.message}</p>
                  <p className="text-gold/80 text-xs mt-1">{l[r.status as 'pending' | 'approved' | 'rejected']}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
