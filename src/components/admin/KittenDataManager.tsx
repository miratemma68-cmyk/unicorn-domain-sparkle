import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface Milestone {
  id: string;
  kitten_id: string;
  milestone_type: string;
  milestone_date: string;
  description: string | null;
}

interface Update {
  id: string;
  kitten_id: string;
  update_date: string;
  weight: number | null;
  notes: string | null;
}

interface VetVisit {
  id: string;
  kitten_id: string;
  visit_date: string;
  visit_type: string | null;
  vet_name: string | null;
  notes: string | null;
  next_visit_date: string | null;
}

export function KittenDataManager() {
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [selectedKittenId, setSelectedKittenId] = useState<string>('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [vetVisits, setVetVisits] = useState<VetVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Kitten info form state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [gender, setGender] = useState('');
  const [color, setColor] = useState('');
  const [breedInfo, setBreedInfo] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');

  // Milestone form state
  const [milestoneType, setMilestoneType] = useState('');
  const [milestoneDate, setMilestoneDate] = useState<Date>();
  const [milestoneDescription, setMilestoneDescription] = useState('');

  // Update form state
  const [updateDate, setUpdateDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  // Vet visit form state
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [visitType, setVisitType] = useState('');
  const [vetName, setVetName] = useState('');
  const [vetNotes, setVetNotes] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState<Date>();

  useEffect(() => {
    loadKittens();
  }, []);

  useEffect(() => {
    if (selectedKittenId) {
      loadKittenData();
    }
  }, [selectedKittenId]);

  const loadKittens = async () => {
    const { data, error } = await supabase
      .from('kittens')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erreur lors du chargement des chatons');
      return;
    }

    setKittens(data || []);
    setLoading(false);
  };

  const resetKittenForm = () => {
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

  const handleKittenSubmit = async () => {
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
        return;
      }

      toast.success('Chaton modifié avec succès');
    } else {
      const { error } = await supabase
        .from('kittens')
        .insert(formData);

      if (error) {
        toast.error('Erreur lors de l\'ajout du chaton');
        return;
      }

      toast.success('Chaton ajouté avec succès');
    }

    resetKittenForm();
    loadKittens();
  };

  const handleKittenEdit = (kitten: Kitten) => {
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

  const handleKittenDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chaton ?')) {
      return;
    }

    const { error } = await supabase
      .from('kittens')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression du chaton');
      return;
    }

    toast.success('Chaton supprimé avec succès');
    if (selectedKittenId === id) {
      setSelectedKittenId('');
    }
    loadKittens();
  };

  const loadKittenData = async () => {
    setLoading(true);

    const [milestonesRes, updatesRes, vetVisitsRes] = await Promise.all([
      supabase.from('kitten_milestones').select('*').eq('kitten_id', selectedKittenId).order('milestone_date', { ascending: false }),
      supabase.from('kitten_updates').select('*').eq('kitten_id', selectedKittenId).order('update_date', { ascending: false }),
      supabase.from('kitten_vet_visits').select('*').eq('kitten_id', selectedKittenId).order('visit_date', { ascending: false })
    ]);

    if (milestonesRes.error) toast.error('Erreur lors du chargement des milestones');
    else setMilestones(milestonesRes.data || []);

    if (updatesRes.error) toast.error('Erreur lors du chargement des updates');
    else setUpdates(updatesRes.data || []);

    if (vetVisitsRes.error) toast.error('Erreur lors du chargement des visites vétérinaires');
    else setVetVisits(vetVisitsRes.data || []);

    setLoading(false);
  };

  const handleAddMilestone = async () => {
    if (!selectedKittenId || !milestoneType || !milestoneDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const { error } = await supabase.from('kitten_milestones').insert({
      kitten_id: selectedKittenId,
      milestone_type: milestoneType,
      milestone_date: milestoneDate.toISOString().split('T')[0],
      description: milestoneDescription || null
    });

    if (error) {
      toast.error('Erreur lors de l\'ajout du milestone');
      return;
    }

    toast.success('Milestone ajouté avec succès');
    setMilestoneType('');
    setMilestoneDate(undefined);
    setMilestoneDescription('');
    loadKittenData();
  };

  const handleDeleteMilestone = async (id: string) => {
    const { error } = await supabase.from('kitten_milestones').delete().eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }

    toast.success('Milestone supprimé');
    loadKittenData();
  };

  const handleAddUpdate = async () => {
    if (!selectedKittenId) {
      toast.error('Veuillez sélectionner un chaton');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Utilisateur non connecté');
      return;
    }

    const { error } = await supabase.from('kitten_updates').insert({
      kitten_id: selectedKittenId,
      update_date: updateDate.toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : null,
      notes: updateNotes || null,
      created_by: user.id
    });

    if (error) {
      toast.error('Erreur lors de l\'ajout de l\'update');
      return;
    }

    toast.success('Update ajouté avec succès');
    setUpdateDate(new Date());
    setWeight('');
    setUpdateNotes('');
    loadKittenData();
  };

  const handleDeleteUpdate = async (id: string) => {
    const { error } = await supabase.from('kitten_updates').delete().eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }

    toast.success('Update supprimé');
    loadKittenData();
  };

  const handleAddVetVisit = async () => {
    if (!selectedKittenId) {
      toast.error('Veuillez sélectionner un chaton');
      return;
    }

    const { error } = await supabase.from('kitten_vet_visits').insert({
      kitten_id: selectedKittenId,
      visit_date: visitDate.toISOString().split('T')[0],
      visit_type: visitType || null,
      vet_name: vetName || null,
      notes: vetNotes || null,
      next_visit_date: nextVisitDate ? nextVisitDate.toISOString().split('T')[0] : null
    });

    if (error) {
      toast.error('Erreur lors de l\'ajout de la visite vétérinaire');
      return;
    }

    toast.success('Visite vétérinaire ajoutée avec succès');
    setVisitDate(new Date());
    setVisitType('');
    setVetName('');
    setVetNotes('');
    setNextVisitDate(undefined);
    loadKittenData();
  };

  const handleDeleteVetVisit = async (id: string) => {
    const { error } = await supabase.from('kitten_vet_visits').delete().eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }

    toast.success('Visite vétérinaire supprimée');
    loadKittenData();
  };

  if (loading && kittens.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Infos Chatons</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="vet-visits">Visites Vétérinaires</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 mt-6">
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
                <Button onClick={handleKittenSubmit} className="flex-1">
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
                  <Button onClick={resetKittenForm} variant="outline">
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
                                onClick={() => handleKittenEdit(kitten)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleKittenDelete(kitten.id)}
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
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un chaton</CardTitle>
              <CardDescription>Choisissez le chaton pour gérer ses milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedKittenId} onValueChange={setSelectedKittenId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un chaton" />
                </SelectTrigger>
                <SelectContent>
                  {kittens.map((kitten) => (
                    <SelectItem key={kitten.id} value={kitten.id}>
                      {kitten.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedKittenId && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un Milestone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type de milestone *</label>
                  <Input
                    value={milestoneType}
                    onChange={(e) => setMilestoneType(e.target.value)}
                    placeholder="Ex: Ouverture des yeux, Première sortie, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date *</label>
                  <DatePicker date={milestoneDate} onDateChange={setMilestoneDate} />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={milestoneDescription}
                    onChange={(e) => setMilestoneDescription(e.target.value)}
                    placeholder="Description du milestone"
                  />
                </div>
                <Button onClick={handleAddMilestone} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestones existants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {milestones.map((milestone) => (
                      <TableRow key={milestone.id}>
                        <TableCell>{new Date(milestone.milestone_date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{milestone.milestone_type}</TableCell>
                        <TableCell>{milestone.description || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="updates" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un chaton</CardTitle>
              <CardDescription>Choisissez le chaton pour gérer ses updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedKittenId} onValueChange={setSelectedKittenId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un chaton" />
                </SelectTrigger>
                <SelectContent>
                  {kittens.map((kitten) => (
                    <SelectItem key={kitten.id} value={kitten.id}>
                      {kitten.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedKittenId && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un Update</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <DatePicker date={updateDate} onDateChange={(date) => date && setUpdateDate(date)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Poids (g)</label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Poids en grammes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                    placeholder="Notes sur le chaton"
                  />
                </div>
                <Button onClick={handleAddUpdate} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates existants</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Poids (g)</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {updates.map((update) => (
                      <TableRow key={update.id}>
                        <TableCell>{new Date(update.update_date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{update.weight || '-'}</TableCell>
                        <TableCell>{update.notes || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUpdate(update.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="vet-visits" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner un chaton</CardTitle>
              <CardDescription>Choisissez le chaton pour gérer ses visites vétérinaires</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedKittenId} onValueChange={setSelectedKittenId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un chaton" />
                </SelectTrigger>
                <SelectContent>
                  {kittens.map((kitten) => (
                    <SelectItem key={kitten.id} value={kitten.id}>
                      {kitten.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedKittenId && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une Visite Vétérinaire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date de visite</label>
                  <DatePicker date={visitDate} onDateChange={(date) => date && setVisitDate(date)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Type de visite</label>
                  <Input
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    placeholder="Ex: Vaccination, Contrôle, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nom du vétérinaire</label>
                  <Input
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    placeholder="Nom du vétérinaire"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={vetNotes}
                    onChange={(e) => setVetNotes(e.target.value)}
                    placeholder="Notes de la visite"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prochaine visite</label>
                  <DatePicker date={nextVisitDate} onDateChange={setNextVisitDate} />
                </div>
                <Button onClick={handleAddVetVisit} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visites Vétérinaires existantes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vétérinaire</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Prochaine visite</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vetVisits.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell>{new Date(visit.visit_date).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{visit.visit_type || '-'}</TableCell>
                        <TableCell>{visit.vet_name || '-'}</TableCell>
                        <TableCell>{visit.notes || '-'}</TableCell>
                        <TableCell>
                          {visit.next_visit_date ? new Date(visit.next_visit_date).toLocaleDateString('fr-FR') : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVetVisit(visit.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
