import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const translations = {
  fr: {
    nav: {
      domain: "Le Domaine",
      cats: "Nos Licornes",
      education: "Éducation",
      adoption: "Adoption",
      faq: "FAQ",
      contact: "Contact",
      dashboard: "Dashboard",
      administration: "Administration",
      clientSpace: "Espace Client"
    },
    hero: {
      title: "Le Domaine des Licornes",
      subtitle: "Élevage Premium de Ragdolls",
      tagline: "Où l'élégance médiévale rencontre la grâce féline",
      discoverCats: "Découvrez Nos Licornes",
      contactUs: "Contactez-nous"
    },
    domain: {
      title: "Le Domaine",
      intro1: "Bienvenue dans notre élevage familial, où chaque Ragdoll est élevé avec amour, respect et selon les plus hauts standards éthiques.",
      intro2: "Inspirés par la noblesse des licornes des tapisseries médiévales, nous avons créé un havre de paix où nos chats s'épanouissent dans un environnement privilégié, entourés d'attention et de soins constants.",
      values: "Nos Valeurs",
      value1: "Éthique et bien-être animal au cœur de nos pratiques",
      value2: "Élevage familial dans un cadre exceptionnel",
      value3: "Pré-éducation soignée de chaque chaton",
      value4: "Accompagnement personnalisé des adoptants",
      discoverLaurence: "Découvrir Laurence",
      viewGallery: "Voir la Galerie"
    },
    cats: {
      title: "Nos Licornes",
      breeding: "Nos Reproducteurs",
      kittens: "Nos Chatons",
      available: "Disponible",
      noKittens: "Aucun chaton disponible pour le moment",
      viewProfile: "Voir le profil"
    },
    education: {
      title: "Éducation",
      intro: "Nos chatons bénéficient d'une pré-éducation exclusive qui garantit leur épanouissement et leur sociabilité exceptionnelle.",
      method: "Notre Méthode",
      method1: "Socialisation précoce avec humains et autres animaux",
      method2: "Stimulation cognitive adaptée à chaque étape",
      method3: "Apprentissage de la propreté et des bonnes habitudes",
      method4: "Suivi vétérinaire rigoureux et vaccinations complètes",
      method5: "Documentation détaillée de leur évolution",
      conclusion: "Chaque chaton est traité comme une petite licorne précieuse, recevant toute l'attention nécessaire pour devenir un compagnon équilibré.",
      viewMethod: "Notre méthode en images"
    },
    adoption: {
      title: "Adoption",
      intro: "Adopter un Ragdoll du Domaine des Licornes, c'est accueillir un compagnon d'exception dans votre vie. Nous vous accompagnons à chaque étape de ce merveilleux voyage.",
      step1Title: "Premier Contact",
      step1Desc: "Remplissez notre formulaire pour exprimer votre intérêt",
      step2Title: "Rencontre",
      step2Desc: "Visitez notre élevage et faites connaissance avec nos licornes",
      step3Title: "Adoption",
      step3Desc: "Accueillez votre compagnon avec un suivi personnalisé",
      whatYouGet: "Ce que vous recevez",
      benefit1: "Certificat de santé complet",
      benefit2: "Carnet de vaccination à jour",
      benefit3: "Pedigree LOOF certifié",
      benefit4: "Kit de démarrage personnalisé",
      benefit5: "Guide d'éducation détaillé",
      benefit6: "Suivi post-adoption à vie",
      startAdoption: "Commencez votre adoption",
      clientTestimonials: "Nos clients racontent"
    },
    contact: {
      title: "Contact",
      intro: "Vous avez des questions ou souhaitez rencontrer nos licornes ? Nous sommes là pour vous accompagner dans votre projet d'adoption.",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      message: "Message",
      send: "Envoyer",
      sending: "Envoi...",
      success: "Message envoyé avec succès !",
      error: "Erreur lors de l'envoi"
    }
  },
  en: {
    nav: {
      domain: "The Domain",
      cats: "Our Unicorns",
      education: "Education",
      adoption: "Adoption",
      faq: "FAQ",
      contact: "Contact",
      dashboard: "Dashboard",
      administration: "Administration",
      clientSpace: "Client Area"
    },
    hero: {
      title: "Le Domaine des Licornes",
      subtitle: "Premium Ragdoll Breeding",
      tagline: "Where medieval elegance meets feline grace",
      discoverCats: "Discover Our Unicorns",
      contactUs: "Contact Us"
    },
    domain: {
      title: "The Domain",
      intro1: "Welcome to our family breeding, where each Ragdoll is raised with love, respect and according to the highest ethical standards.",
      intro2: "Inspired by the nobility of unicorns from medieval tapestries, we have created a haven of peace where our cats thrive in a privileged environment, surrounded by constant attention and care.",
      values: "Our Values",
      value1: "Ethics and animal welfare at the heart of our practices",
      value2: "Family breeding in an exceptional setting",
      value3: "Careful pre-education of each kitten",
      value4: "Personalized support for adopters",
      discoverLaurence: "Discover Laurence",
      viewGallery: "View Gallery"
    },
    cats: {
      title: "Our Unicorns",
      breeding: "Our Breeding Cats",
      kittens: "Our Kittens",
      available: "Available",
      noKittens: "No kittens available at the moment",
      viewProfile: "View profile"
    },
    education: {
      title: "Education",
      intro: "Our kittens benefit from exclusive pre-education that guarantees their development and exceptional sociability.",
      method: "Our Method",
      method1: "Early socialization with humans and other animals",
      method2: "Cognitive stimulation adapted to each stage",
      method3: "Learning cleanliness and good habits",
      method4: "Rigorous veterinary monitoring and complete vaccinations",
      method5: "Detailed documentation of their evolution",
      conclusion: "Each kitten is treated like a precious little unicorn, receiving all the attention necessary to become a balanced companion.",
      viewMethod: "Our method in images"
    },
    adoption: {
      title: "Adoption",
      intro: "Adopting a Ragdoll from Le Domaine des Licornes means welcoming an exceptional companion into your life. We accompany you at every step of this wonderful journey.",
      step1Title: "First Contact",
      step1Desc: "Fill out our form to express your interest",
      step2Title: "Meeting",
      step2Desc: "Visit our breeding and meet our unicorns",
      step3Title: "Adoption",
      step3Desc: "Welcome your companion with personalized follow-up",
      whatYouGet: "What you receive",
      benefit1: "Complete health certificate",
      benefit2: "Up-to-date vaccination record",
      benefit3: "Certified LOOF pedigree",
      benefit4: "Personalized starter kit",
      benefit5: "Detailed education guide",
      benefit6: "Lifetime post-adoption follow-up",
      startAdoption: "Start your adoption",
      clientTestimonials: "Our clients tell"
    },
    contact: {
      title: "Contact",
      intro: "Do you have questions or would like to meet our unicorns? We are here to support you in your adoption project.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Error sending message"
    }
  }
};