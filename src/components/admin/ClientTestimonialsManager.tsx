import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, Trash2 } from 'lucide-react';

interface Row { id: string; author_name: string; message: string; photo_url: string | null; photo_path: string | null; status: string; created_at: string }

const statusLabel: Record<string, string> = { pending: 'En attente', approved: 'Publié', rejected: 'Refusé' };

export function ClientTestimonialsManager() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = async () => {
    const { data, error } = await supabase.from('client_testimonials').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Erreur de chargement des témoignages');
    setRows((data as Row[]) || []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('client_testimonials').update({ status }).eq('id', id);
    if (error) return toast.error('Erreur');
    toast.success(status === 'approved' ? 'Témoignage publié' : 'Témoignage refusé');
    load();
  };

  const remove = async (r: Row) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    if (r.photo_path) await supabase.storage.from('testimonials-media').remove([r.photo_path]);
    const { error } = await supabase.from('client_testimonials').delete().eq('id', r.id);
    if (error) return toast.error('Erreur');
    toast.success('Témoignage supprimé');
    load();
  };

  return (
    <div className="p-6 bg-card/80 backdrop-blur-sm rounded-[3rem] border-2 border-gold/30">
      <h3 className="text-2xl font-display text-gold mb-6">Témoignages des adoptants</h3>
      {rows.length === 0 ? (
        <p className="text-ivory/70">Aucun témoignage reçu pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-gold/20">
              {r.photo_url && <img src={r.photo_url} alt="" className="w-24 h-24 rounded-xl object-cover border border-gold/30" />}
              <div className="flex-1 min-w-0">
                <p className="text-gold font-medium">{r.author_name} <span className="text-xs text-ivory/60 ml-2">{new Date(r.created_at).toLocaleDateString('fr-FR')} · {statusLabel[r.status]}</span></p>
                <p className="text-ivory/90 text-sm whitespace-pre-line break-words mt-1">{r.message}</p>
              </div>
              <div className="flex sm:flex-col gap-2 shrink-0">
                {r.status !== 'approved' && <Button size="sm" onClick={() => setStatus(r.id, 'approved')} className="rounded-full bg-crimson hover:bg-crimson-dark text-ivory border border-gold"><Check className="h-4 w-4 mr-1" />Publier</Button>}
                {r.status !== 'rejected' && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, 'rejected')} className="rounded-full border-gold text-gold"><X className="h-4 w-4 mr-1" />{r.status === 'approved' ? 'Retirer' : 'Refuser'}</Button>}
                <Button size="sm" variant="outline" onClick={() => remove(r)} className="rounded-full border-gold/50 text-ivory/70"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
