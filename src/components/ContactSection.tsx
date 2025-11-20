import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Insert into database
    const { error } = await supabase
      .from('contact_inquiries')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      }]);
    
    if (error) {
      toast.error(t('contact.error'));
      console.error('Error submitting inquiry:', error);
      return;
    }
    
    // Send confirmation email
    try {
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }
      });
      
      if (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't show error to user, form was still submitted successfully
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't show error to user, form was still submitted successfully
    }
    
    toast.success(t('contact.success'));
    
    // Reset form
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-2xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-center text-ivory/80 mb-8">
            {t('contact.intro')}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gold mb-2 font-display">
                {t('contact.name')} *
              </label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold rounded-full"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gold mb-2 font-display">
                {t('contact.email')} *
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold rounded-full"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gold mb-2 font-display">
                {t('contact.phone')}
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold rounded-full"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-gold mb-2 font-display">
                {t('contact.message')} *
              </label>
              <Textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-input border-gold/30 text-foreground focus:border-gold resize-none rounded-[2rem]"
              />
            </div>
            
            <Button 
              type="submit"
              size="lg"
              className="w-full bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full hover:scale-105"
            >
              {t('contact.send')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
