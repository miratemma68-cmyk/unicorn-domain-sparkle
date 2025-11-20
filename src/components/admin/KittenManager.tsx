import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { Trash2, Plus, Edit, X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { z } from 'zod';

const kittenSchema = z.object({
  name: z.string().trim().min(1, { message: "Le nom est obligatoire" }).max(100, { message: "Le nom doit faire moins de 100 caractères" }),
  birth_date: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  color: z.string().trim().max(100, { message: "La couleur doit faire moins de 100 caractères" }).optional().nullable(),
  breed_info: z.string().trim().max(500, { message: "Les informations de race doivent faire moins de 500 caractères" }).optional().nullable(),
  registration_number: z.string().trim().max(50, { message: "Le numéro d'enregistrement doit faire moins de 50 caractères" }).optional().nullable(),
  microchip_number: z.string().trim().max(50, { message: "Le numéro de puce doit faire moins de 50 caractères" }).optional().nullable(),
  current_weight: z.number().positive({ message: "Le poids doit être positif" }).optional().nullable()
});

interface Kitten {
  id: string;
  name: string;
  birth_date: string | null;
  gender: string | null;
  color: string | null;
  breed_info: string | null;
  registration_number: string | null;
  microchip_number: string | null;
  current_weight: number | null;
  created_at: string;
  updated_at: string;
}

export function KittenManager() {
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [breedInfo, setBreedInfo] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');

  useEffect(() => {
    loadKittens();
  }, []);

  const loadKittens = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('kittens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des chatons');
      console.error(error);
      return;
    }

    setKittens(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setName('');
    setBirthDate(undefined);
    setGender('');
    setColor('');
    setBreedInfo('');
    setRegistrationNumber('');
    setMicrochipNumber('');
    setCurrentWeight('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const formData = {
      name,
      birth_date: birthDate ? birthDate.toISOString().split('T')[0] : null,
      gender: gender || null,
      color: color || null,
      breed_info: breedInfo || null,
      registration_number: registrationNumber || null,
      microchip_number: microchipNumber || null,
      current_weight: currentWeight ? parseFloat(currentWeight) : null
    };

    try {
      kittenSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    if (editingId) {
      const { error } = await supabase
        .from('kittens')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        toast.error('Erreur lors de la modification du chaton');
        console.error(error);
        return;
      }

      toast.success('Chaton modifié avec succès');
    } else {
      const { error } = await supabase
        .from('kittens')
        .insert(formData);

      if (error) {
        toast.error('Erreur lors de l\'ajout du chaton');
        console.error(error);
        return;
      }

      toast.success('Chaton ajouté avec succès');
    }

    resetForm();
    loadKittens();
  };

  const handleEdit = (kitten: Kitten) => {
    setName(kitten.name);
    setBirthDate(kitten.birth_date ? new Date(kitten.birth_date) : undefined);
    setGender(kitten.gender || '');
    setColor(kitten.color || '');
    setBreedInfo(kitten.breed_info || '');
    setRegistrationNumber(kitten.registration_number || '');
    setMicrochipNumber(kitten.microchip_number || '');
    setCurrentWeight(kitten.current_weight?.toString() || '');
    setEditingId(kitten.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chaton ?')) {
      return;
    }

    const { error } = await supabase
      .from('kittens')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression du chaton');
      console.error(error);
      return;
    }

    toast.success('Chaton supprimé avec succès');
    loadKittens();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Modifier un chaton' : 'Ajouter un nouveau chaton'}</CardTitle>
          <CardDescription>
            {editingId ? 'Modifiez les informations du chaton' : 'Remplissez les informations du chaton (seul le nom est obligatoire)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nom *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du chaton"
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Date de naissance</label>
              <DatePicker 
                date={birthDate} 
                onDateChange={setBirthDate}
                placeholder="Choisir une date"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Sexe</label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non spécifié</SelectItem>
                  <SelectItem value="Mâle">Mâle</SelectItem>
                  <SelectItem value="Femelle">Femelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Couleur</label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Couleur du pelage"
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Numéro d'enregistrement</label>
              <Input
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="Numéro d'enregistrement"
                maxLength={50}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Numéro de puce</label>
              <Input
                value={microchipNumber}
                onChange={(e) => setMicrochipNumber(e.target.value)}
                placeholder="Numéro de micropuce"
                maxLength={50}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Poids actuel (g)</label>
              <Input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="Poids en grammes"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Informations de race</label>
            <Textarea
              value={breedInfo}
              onChange={(e) => setBreedInfo(e.target.value)}
              placeholder="Informations supplémentaires sur la race"
              maxLength={500}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              {editingId ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </>
              )}
            </Button>
            {editingId && (
              <Button onClick={resetForm} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chatons enregistrés ({kittens.length})</CardTitle>
          <CardDescription>Liste de tous les chatons dans la base de données</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : kittens.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun chaton enregistré</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Date de naissance</TableHead>
                    <TableHead>Sexe</TableHead>
                    <TableHead>Couleur</TableHead>
                    <TableHead>Poids (g)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kittens.map((kitten) => (
                    <TableRow key={kitten.id}>
                      <TableCell className="font-medium">{kitten.name}</TableCell>
                      <TableCell>
                        {kitten.birth_date
                          ? new Date(kitten.birth_date).toLocaleDateString('fr-FR')
                          : '-'}
                      </TableCell>
                      <TableCell>{kitten.gender || '-'}</TableCell>
                      <TableCell>{kitten.color || '-'}</TableCell>
                      <TableCell>{kitten.current_weight || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(kitten)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(kitten.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
