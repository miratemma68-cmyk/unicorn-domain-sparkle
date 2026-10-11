import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export function CreateClientAccount() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('admin-create-client', { body: form });
    setLoading(false);
    const msg = (data as any)?.error || error?.message;
    if (msg) return toast.error(msg);
    toast.success(`Compte créé pour ${form.email}. Transmettez-lui son mot de passe, puis attribuez-lui son chaton ci-dessous.`);
    setForm({ fullName: '', email: '', password: '' });
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm rounded-[3rem] border-2 border-gold/30">
      <h3 className="text-2xl font-display text-gold mb-6">Créer un compte adoptant</h3>

      <p className="text-ivory/60 italic -mt-4 mb-6">
        L'inscription publique est fermée : seuls les adoptants pour qui vous créez un compte peuvent se connecter.
      </p>

      <form onSubmit={submit} className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cc-name" className="text-sm font-medium text-ivory/90">Nom complet</Label>
          <Input
            id="cc-name"
            className="rounded-full border-gold/30"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cc-email" className="text-sm font-medium text-ivory/90">Email</Label>
          <Input
            id="cc-email"
            type="email"
            required
            className="rounded-full border-gold/30"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cc-pass" className="text-sm font-medium text-ivory/90">Mot de passe</Label>
          <Input
            id="cc-pass"
            type="text"
            required
            minLength={6}
            className="rounded-full border-gold/30"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="mt-6 bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold rounded-full md:col-span-3 w-fit"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {loading ? 'Création...' : 'Créer le compte'}
        </Button>
      </form>
    </Card>
  );
}
