import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    <Card>
      <CardHeader>
        <CardTitle>Créer un compte adoptant</CardTitle>
        <CardDescription>
          L'inscription publique est fermée : seuls les adoptants pour qui vous créez un compte peuvent se connecter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="cc-name">Nom complet</Label>
            <Input id="cc-name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="cc-email">Email</Label>
            <Input id="cc-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="cc-pass">Mot de passe</Label>
            <Input id="cc-pass" type="text" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" disabled={loading}>{loading ? 'Création...' : 'Créer le compte'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
