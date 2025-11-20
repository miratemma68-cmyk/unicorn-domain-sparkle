import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  question_en: string | null;
  question_es: string | null;
  answer: string;
  answer_en: string | null;
  answer_es: string | null;
  display_order: number;
}

export const FAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFAQ, setNewFAQ] = useState({
    question: "",
    question_en: "",
    question_es: "",
    answer: "",
    answer_en: "",
    answer_es: "",
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      toast.error("Erreur lors du chargement des FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast.error("Question et réponse (FR) sont obligatoires");
      return;
    }

    try {
      const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.display_order)) : 0;
      
      const { error } = await supabase.from("faqs").insert({
        ...newFAQ,
        display_order: maxOrder + 1,
      });

      if (error) throw error;

      toast.success("FAQ ajoutée");
      setNewFAQ({
        question: "",
        question_en: "",
        question_es: "",
        answer: "",
        answer_en: "",
        answer_es: "",
      });
      loadFAQs();
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleUpdate = async (id: string, updates: Partial<FAQ>) => {
    try {
      const { error } = await supabase
        .from("faqs")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast.success("FAQ mise à jour");
      loadFAQs();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette FAQ ?")) return;

    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);

      if (error) throw error;

      toast.success("FAQ supprimée");
      loadFAQs();
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = faqs.findIndex(f => f.id === id);
    if (currentIndex === -1) return;
    
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === faqs.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const current = faqs[currentIndex];
    const target = faqs[targetIndex];

    try {
      await supabase.from("faqs").update({ display_order: target.display_order }).eq("id", current.id);
      await supabase.from("faqs").update({ display_order: current.display_order }).eq("id", target.id);

      toast.success("Ordre modifié");
      loadFAQs();
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Erreur lors du réordonnancement");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Ajouter une FAQ</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Question (FR) *"
              value={newFAQ.question}
              onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
            />
            <Input
              placeholder="Question (EN)"
              value={newFAQ.question_en}
              onChange={(e) => setNewFAQ({ ...newFAQ, question_en: e.target.value })}
            />
            <Input
              placeholder="Question (ES)"
              value={newFAQ.question_es}
              onChange={(e) => setNewFAQ({ ...newFAQ, question_es: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Textarea
              placeholder="Réponse (FR) *"
              value={newFAQ.answer}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
            />
            <Textarea
              placeholder="Réponse (EN)"
              value={newFAQ.answer_en}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer_en: e.target.value })}
            />
            <Textarea
              placeholder="Réponse (ES)"
              value={newFAQ.answer_es}
              onChange={(e) => setNewFAQ({ ...newFAQ, answer_es: e.target.value })}
            />
          </div>
          <Button onClick={handleAdd} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={faq.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                {editingId === faq.id ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        defaultValue={faq.question}
                        onBlur={(e) => handleUpdate(faq.id, { question: e.target.value })}
                        placeholder="Question (FR)"
                      />
                      <Input
                        defaultValue={faq.question_en || ""}
                        onBlur={(e) => handleUpdate(faq.id, { question_en: e.target.value })}
                        placeholder="Question (EN)"
                      />
                      <Input
                        defaultValue={faq.question_es || ""}
                        onBlur={(e) => handleUpdate(faq.id, { question_es: e.target.value })}
                        placeholder="Question (ES)"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Textarea
                        defaultValue={faq.answer}
                        onBlur={(e) => handleUpdate(faq.id, { answer: e.target.value })}
                        placeholder="Réponse (FR)"
                      />
                      <Textarea
                        defaultValue={faq.answer_en || ""}
                        onBlur={(e) => handleUpdate(faq.id, { answer_en: e.target.value })}
                        placeholder="Réponse (EN)"
                      />
                      <Textarea
                        defaultValue={faq.answer_es || ""}
                        onBlur={(e) => handleUpdate(faq.id, { answer_es: e.target.value })}
                        placeholder="Réponse (ES)"
                      />
                    </div>
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Terminer
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground mb-1">FR</p>
                        <p className="font-medium">{faq.question}</p>
                        <p className="text-sm text-muted-foreground mt-2">{faq.answer}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground mb-1">EN</p>
                        <p className="font-medium">{faq.question_en || "-"}</p>
                        <p className="text-sm text-muted-foreground mt-2">{faq.answer_en || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground mb-1">ES</p>
                        <p className="font-medium">{faq.question_es || "-"}</p>
                        <p className="text-sm text-muted-foreground mt-2">{faq.answer_es || "-"}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setEditingId(faq.id)}>
                      Modifier
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleReorder(faq.id, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleReorder(faq.id, "down")}
                  disabled={index === faqs.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(faq.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
