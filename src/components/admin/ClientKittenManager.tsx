import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { z } from "zod";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
}

interface Kitten {
  id: string;
  name: string;
}

interface ClientKitten {
  id: string;
  client_id: string;
  kitten_id: string;
  adoption_date: string | null;
  created_at: string;
  profiles: Profile;
  kittens: Kitten;
}

const clientKittenSchema = z.object({
  client_id: z.string().uuid({ message: "Client invalide" }),
  kitten_id: z.string().uuid({ message: "Chaton invalide" }),
  adoption_date: z.string().optional(),
});

export const ClientKittenManager = () => {
  const [clients, setClients] = useState<Profile[]>([]);
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [assignments, setAssignments] = useState<ClientKitten[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedKitten, setSelectedKitten] = useState<string>("");
  const [adoptionDate, setAdoptionDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("email");

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Load kittens
      const { data: kittensData, error: kittensError } = await supabase
        .from("kittens")
        .select("id, name")
        .order("name");

      if (kittensError) throw kittensError;
      setKittens(kittensData || []);

      // Load existing assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("client_kittens")
        .select(`
          id,
          client_id,
          kitten_id,
          adoption_date,
          created_at,
          profiles!client_kittens_client_id_fkey (id, email, full_name),
          kittens!client_kittens_kitten_id_fkey (id, name)
        `)
        .order("created_at", { ascending: false });

      if (assignmentsError) throw assignmentsError;
      console.log("Assignments loaded:", assignmentsData);
      setAssignments(assignmentsData as unknown as ClientKitten[] || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  const handleAssign = async () => {
    try {
      setLoading(true);

      const formattedDate = adoptionDate ? adoptionDate.toISOString().split('T')[0] : null;

      const validationResult = clientKittenSchema.safeParse({
        client_id: selectedClient,
        kitten_id: selectedKitten,
        adoption_date: formattedDate || undefined,
      });

      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return;
      }

      const { error } = await supabase.from("client_kittens").insert({
        client_id: selectedClient,
        kitten_id: selectedKitten,
        adoption_date: formattedDate,
      });

      if (error) throw error;

      toast.success("Association créée avec succès");
      setSelectedClient("");
      setSelectedKitten("");
      setAdoptionDate(undefined);
      loadData();
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      toast.error(error.message || "Erreur lors de la création de l'association");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("client_kittens")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Association supprimée");
      loadData();
    } catch (error: any) {
      console.error("Error deleting assignment:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/80 backdrop-blur-sm rounded-[3rem] border-2 border-gold/30">
        <h3 className="text-2xl font-display text-gold mb-6">
          Nouvelle Association Client-Chaton
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory/90">Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="rounded-full border-gold/30">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.full_name || client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory/90">Chaton</label>
            <Select value={selectedKitten} onValueChange={setSelectedKitten}>
              <SelectTrigger className="rounded-full border-gold/30">
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ivory/90">
              Date d'adoption (optionnel)
            </label>
            <DatePicker
              date={adoptionDate}
              onDateChange={setAdoptionDate}
              placeholder="Date d'adoption"
            />
          </div>
        </div>

        <Button
          onClick={handleAssign}
          disabled={!selectedClient || !selectedKitten || loading}
          className="mt-6 bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer l'association
        </Button>
      </Card>

      <Card className="p-6 bg-card/80 backdrop-blur-sm rounded-[3rem] border-2 border-gold/30">
        <h3 className="text-2xl font-display text-gold mb-6">
          Associations Existantes
        </h3>

        <div className="space-y-3">
          {assignments.length === 0 ? (
            <p className="text-ivory/60 text-center py-8 italic">
              Aucune association pour le moment
            </p>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 bg-midnight/30 rounded-[2rem] border border-gold/20 hover:border-gold/40 transition-colors"
              >
                <div className="flex-1 grid md:grid-cols-3 gap-4 text-ivory/90">
                  <div>
                    <span className="text-gold text-sm">Client:</span>
                    <p className="font-medium">
                      {assignment.profiles.full_name || assignment.profiles.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-gold text-sm">Chaton:</span>
                    <p className="font-medium">{assignment.kittens.name}</p>
                  </div>
                  <div>
                    <span className="text-gold text-sm">Date d'adoption:</span>
                    <p className="font-medium">
                      {assignment.adoption_date
                        ? new Date(assignment.adoption_date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Non spécifiée"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(assignment.id)}
                  className="text-crimson hover:text-crimson-dark hover:bg-crimson/10 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
