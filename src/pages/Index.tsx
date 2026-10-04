import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { DomainSection } from "@/components/DomainSection";
import { CatsSection } from "@/components/CatsSection";
import { PreviousLittersSection } from "@/components/PreviousLittersSection";
import { EducationSection } from "@/components/EducationSection";
import { AdoptionSection } from "@/components/AdoptionSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { SalesConditionsSection } from "@/components/SalesConditionsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll vers la section correspondant au hash dans l'URL
    if (location.hash) {
      const elementId = location.hash.substring(1); // Enlève le #
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <DomainSection />
      <CatsSection />
      <PreviousLittersSection />
      <EducationSection />

      <AdoptionSection />
      <TestimonialsSection />
      <SalesConditionsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
