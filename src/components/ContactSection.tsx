import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('contact_inquiries')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      }]);
    
    if (error) {
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
      console.error('Error submitting inquiry:', error);
      return;
    }
    
    toast.success("Votre message a été envoyé avec succès !");
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-lg p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gold medieval-glow text-center mb-4">
            Contactez-nous
          </h2>
          <p className="text-center text-ivory/80 mb-8">
            Prêt à rencontrer votre future licorne ?
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gold mb-2 font-serif">
                Nom *
              </label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gold mb-2 font-serif">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gold mb-2 font-serif">
                Téléphone
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gold mb-2 font-serif">
                Message *
              </label>
              <Textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold resize-none"
                placeholder="Parlez-nous de votre projet d'adoption..."
              />
            </div>
            
            <Button 
              type="submit"
              size="lg"
              className="w-full bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)]"
            >
              Envoyer votre message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
