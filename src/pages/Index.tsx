import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { DomainSection } from "@/components/DomainSection";
import { CatsSection } from "@/components/CatsSection";
import { EducationSection } from "@/components/EducationSection";
import { AdoptionSection } from "@/components/AdoptionSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <DomainSection />
      <CatsSection />
      <EducationSection />
      <AdoptionSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
