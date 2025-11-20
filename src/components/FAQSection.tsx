import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tapestrySight from "@/assets/tapestry-sight.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

export const FAQSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    },
    {
      question: t('faq.q4'),
      answer: t('faq.a4')
    },
    {
      question: t('faq.q5'),
      answer: t('faq.a5')
    },
    {
      question: t('faq.q6'),
      answer: t('faq.a6')
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
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-8 border-gold text-gold hover:bg-gold/10 rounded-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
        
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-8">
            {t('faq.title')}
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gold/30 rounded-[2rem] px-6 bg-card/40 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-gold hover:text-gold-light font-display text-lg">
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
