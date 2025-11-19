import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import tapestrySight from "@/assets/tapestry-sight.jpg";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Qu'est-ce qui rend le Ragdoll unique ?",
      answer: "Le Ragdoll est réputé pour son tempérament exceptionnel : calme, affectueux et docile. Il se détend complètement lorsqu'on le prend dans les bras, d'où son nom 'poupée de chiffon'. C'est le compagnon idéal pour les familles."
    },
    {
      question: "À quel âge puis-je adopter un chaton ?",
      answer: "Nos chatons quittent l'élevage à partir de 12-14 semaines, jamais avant. Cette période permet une socialisation optimale avec leur mère et leurs frères et sœurs, garantissant un caractère équilibré."
    },
    {
      question: "Les Ragdolls s'entendent-ils avec les autres animaux ?",
      answer: "Oui, excellemment ! Les Ragdolls sont connus pour leur sociabilité. Nos chatons sont habitués dès leur plus jeune âge à côtoyer d'autres chats et animaux, facilitant leur intégration dans tout type de foyer."
    },
    {
      question: "Quel suivi proposez-vous après l'adoption ?",
      answer: "Nous restons disponibles à vie pour accompagner nos adoptants. Vous recevrez des conseils personnalisés, pourrez nous contacter à tout moment, et rejoindrez notre communauté d'adoptants."
    },
    {
      question: "Comment sont élevés vos chatons ?",
      answer: "Nos chatons grandissent dans un environnement familial privilégié, entourés d'amour et d'attention constante. Ils bénéficient d'une pré-éducation exclusive, d'une socialisation précoce et d'un suivi vétérinaire rigoureux."
    },
    {
      question: "Quels sont les frais d'adoption ?",
      answer: "Les tarifs varient selon le chaton et sa destination (compagnie ou reproduction). Contactez-nous pour obtenir des informations détaillées et personnalisées selon votre projet."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div 
          style={{
            backgroundImage: `url(${tapestrySight})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-lg p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gold medieval-glow text-center mb-8">
            Questions Fréquentes
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gold/30 rounded-lg px-6 bg-card/40 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-gold hover:text-gold-light font-serif text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-ivory/80 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
