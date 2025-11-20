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
import { Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Kitten {
  id: string;
  name: string;
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
      .select('id, name')
      .order('name');

    if (error) {
      toast.error('Erreur lors du chargement des chatons');
      return;
    }

    setKittens(data || []);
    setLoading(false);
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
      <Card>
        <CardHeader>
          <CardTitle>Sélectionner un chaton</CardTitle>
          <CardDescription>Choisissez le chaton pour gérer ses données</CardDescription>
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
        <Tabs defaultValue="milestones" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="vet-visits">Visites Vétérinaires</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="vet-visits" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
