import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr' || saved === 'es') ? saved : 'fr';
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
    common: {
      back: "Retour",
    },
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
      title: "Le Domaine des Licornes Seal",
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
      viewGallery: "Voir la Galerie",
      laurenceTitle: "Laurence, notre éleveuse",
      laurenceP1: "Passionnée par les Ragdolls depuis plus de 10 ans, Laurence a fondé Le Domaine des Licornes Seal avec la vision de créer un élevage familial où chaque chat est traité comme un membre de la famille.",
      laurenceP2: "Son expertise et son dévouement garantissent que chaque chaton bénéficie d'une socialisation optimale et d'un environnement stimulant dès ses premiers jours. Elle accompagne personnellement chaque famille adoptante pour assurer une transition harmonieuse.",
      laurenceQuote: "Chaque Ragdoll est unique et mérite une attention particulière. Mon objectif est de faire correspondre chaque chaton avec la famille parfaite pour lui.",
      galleryTitle: "Galerie",
      galleryEmpty: "Photos et vidéos à venir..."
    },
    cats: {
      title: "Nos Licornes",
      breeding: "Nos Reproductrices",
      externalBreeders: "Nos Reproducteurs Externes",
      kittens: "Nos Chatons",
      available: "Disponible",
      noKittens: "Aucun chaton disponible pour le moment",
      viewProfile: "Voir le profil",
      alohaDesc: "Notre magnifique Ragdoll, douce et élégante comme une licorne",
      utahDesc: "Une princesse parmi les Ragdolls, noble et majestueuse"
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
      viewMethod: "Notre méthode en images",
      methodImagesTitle: "Notre méthode en images",
      methodEmpty: "Photos et vidéos à venir..."
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
      country: "Pays",
      message: "Message",
      send: "Envoyer",
      sending: "Envoi...",
      success: "Message envoyé avec succès !",
      error: "Erreur lors de l'envoi"
    },
    faq: {
      title: "Questions Fréquentes",
      q1: "Qu'est-ce qui rend le Ragdoll unique ?",
      a1: "Le Ragdoll est réputé pour son tempérament exceptionnel : calme, affectueux et docile. Il se détend complètement lorsqu'on le prend dans les bras, d'où son nom 'poupée de chiffon'. C'est le compagnon idéal pour les familles.",
      q2: "À quel âge puis-je adopter un chaton ?",
      a2: "Nos chatons quittent l'élevage à partir de 12-14 semaines, jamais avant. Cette période permet une socialisation optimale avec leur mère et leurs frères et sœurs, garantissant un caractère équilibré.",
      q3: "Les Ragdolls s'entendent-ils avec les autres animaux ?",
      a3: "Oui, excellemment ! Les Ragdolls sont connus pour leur sociabilité. Nos chatons sont habitués dès leur plus jeune âge à côtoyer d'autres chats et animaux, facilitant leur intégration dans tout type de foyer.",
      q4: "Quel suivi proposez-vous après l'adoption ?",
      a4: "Nous restons disponibles à vie pour accompagner nos adoptants. Vous recevrez des conseils personnalisés, pourrez nous contacter à tout moment, et rejoindrez notre communauté d'adoptants.",
      q5: "Comment sont élevés vos chatons ?",
      a5: "Nos chatons grandissent dans un environnement familial privilégié, entourés d'amour et d'attention constante. Ils bénéficient d'une pré-éducation exclusive, d'une socialisation précoce et d'un suivi vétérinaire rigoureux.",
      q6: "Quels sont les frais d'adoption ?",
      a6: "Les tarifs varient selon le chaton et sa destination (compagnie ou reproduction). Contactez-nous pour obtenir des informations détaillées et personnalisées selon votre projet."
    },
    dashboard: {
      title: "Espace Client",
      loading: "Chargement...",
      signOut: "Déconnexion",
      signOutSuccess: "Déconnexion réussie",
      myUnicorns: "Mes Licornes",
      myProfile: "Mon Profil",
      loadingKittens: "Chargement des chatons...",
      noKittens: "Aucun chaton assigné pour le moment",
      contactInfo: "Contactez-nous pour plus d'informations",
      gender: "Sexe",
      color: "Couleur",
      weight: "Poids",
      notSpecified: "Non spécifié",
      male: "Mâle",
      female: "Femelle",
      profileTitle: "Informations du profil",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      errorLoadingKittens: "Erreur lors du chargement des chatons"
    },
    kittenDetail: {
      loading: "Chargement...",
      notFound: "Chaton non trouvé",
      backToKittens: "Retour à Nos Chatons",
      noPhoto: "Aucune photo",
      age: "Âge",
      birthDate: "Date de naissance",
      gender: "Sexe",
      male: "Mâle",
      female: "Femelle",
      color: "Couleur",
      weight: "Poids",
      about: "À propos",
      gallery: "Galerie",
      day: "jour",
      days: "jours",
      month: "mois",
      months: "mois",
      year: "an",
      years: "ans",
      and: "et"
    },
    admin: {
      title: "Administration",
      back: "Retour",
      breedingCats: "Reproducteurs",
      translations: "Traductions",
      kittenData: "Données Chatons",
      kittens: "Chatons Media",
      domainGallery: "Galerie Domaine",
      education: "Éducation",
      testimonials: "Témoignages",
      management: "Gestion"
    },
    catDetail: {
      loading: "Chargement...",
      notFound: "Chat non trouvé",
      backToOurUnicorns: "Retour à Nos Licornes",
      breederMale: "Reproducteur",
      breederFemale: "Reproductrice",
      information: "Informations",
      birthDate: "Date de naissance",
      color: "Couleur",
      loofNumber: "N° LOOF",
      chipNumber: "N° Puce",
      personality: "Caractère",
      pedigree: "Pedigree",
      gallery: "Galerie",
      years: "ans",
      videoNotSupported: "Votre navigateur ne supporte pas la lecture de vidéos."
    },
    footer: {
      title: "Le Domaine des Licornes Seal",
      subtitle: "Élevage familial premium de Ragdolls",
      loof: "LOOF - Le domaine des licornes seal",
      navigation: "Navigation",
      contact: "Contact",
      email: "Email: contact@domainedeslicornes.com",
      social: "Suivez-nous sur les réseaux sociaux",
      copyright: "Tous droits réservés.",
      tagline: "Où l'élégance médiévale rencontre la grâce féline"
    }
  },
  en: {
    common: {
      back: "Back",
    },
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
      title: "Le Domaine des Licornes Seal",
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
      viewGallery: "View Gallery",
      laurenceTitle: "Laurence, our breeder",
      laurenceP1: "Passionate about Ragdolls for over 10 years, Laurence founded Le Domaine des Licornes Seal with the vision of creating a family cattery where each cat is treated as a family member.",
      laurenceP2: "Her expertise and dedication ensure that each kitten benefits from optimal socialization and a stimulating environment from its first days. She personally accompanies each adopting family to ensure a harmonious transition.",
      laurenceQuote: "Each Ragdoll is unique and deserves special attention. My goal is to match each kitten with the perfect family for them.",
      galleryTitle: "Gallery",
      galleryEmpty: "Photos and videos coming soon..."
    },
    cats: {
      title: "Our Unicorns",
      breeding: "Our Breeding Cats",
      externalBreeders: "Our External Breeders",
      kittens: "Our Kittens",
      available: "Available",
      noKittens: "No kittens available at the moment",
      viewProfile: "View profile",
      alohaDesc: "Our magnificent Ragdoll, gentle and elegant like a unicorn",
      utahDesc: "A princess among Ragdolls, noble and majestic"
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
      viewMethod: "Our method in images",
      methodImagesTitle: "Our method in images",
      methodEmpty: "Photos and videos coming soon..."
    },
    dashboard: {
      title: "Client Area",
      loading: "Loading...",
      signOut: "Sign Out",
      signOutSuccess: "Successfully signed out",
      myUnicorns: "My Unicorns",
      myProfile: "My Profile",
      loadingKittens: "Loading kittens...",
      noKittens: "No kittens assigned at the moment",
      contactInfo: "Contact us for more information",
      gender: "Gender",
      color: "Color",
      weight: "Weight",
      notSpecified: "Not specified",
      male: "Male",
      female: "Female",
      profileTitle: "Profile information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      errorLoadingKittens: "Error loading kittens"
    },
    kittenDetail: {
      loading: "Loading...",
      notFound: "Kitten not found",
      backToKittens: "Back to Our Kittens",
      noPhoto: "No photo",
      age: "Age",
      birthDate: "Birth Date",
      gender: "Gender",
      male: "Male",
      female: "Female",
      color: "Color",
      weight: "Weight",
      about: "About",
      gallery: "Gallery",
      day: "day",
      days: "days",
      month: "month",
      months: "months",
      year: "year",
      years: "years",
      and: "and"
    },
    admin: {
      title: "Administration",
      back: "Back",
      breedingCats: "Breeding Cats",
      translations: "Translations",
      kittenData: "Kittens Data",
      kittens: "Kittens Media",
      domainGallery: "Domain Gallery",
      education: "Education",
      testimonials: "Testimonials",
      management: "Management"
    },
    catDetail: {
      loading: "Loading...",
      notFound: "Cat not found",
      backToOurUnicorns: "Back to Our Unicorns",
      breederMale: "Stud",
      breederFemale: "Queen",
      information: "Information",
      birthDate: "Birth Date",
      color: "Color",
      loofNumber: "LOOF No.",
      chipNumber: "Chip No.",
      personality: "Personality",
      pedigree: "Pedigree",
      gallery: "Gallery",
      videoNotSupported: "Your browser does not support video playback.",
      years: "years"
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
      country: "Country",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "Error sending message"
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "What makes the Ragdoll unique?",
      a1: "The Ragdoll is renowned for its exceptional temperament: calm, affectionate, and docile. It relaxes completely when held in your arms, hence its name 'rag doll'. It's the ideal companion for families.",
      q2: "At what age can I adopt a kitten?",
      a2: "Our kittens leave the cattery from 12-14 weeks onwards, never before. This period allows optimal socialization with their mother and siblings, ensuring a balanced character.",
      q3: "Do Ragdolls get along with other animals?",
      a3: "Yes, excellently! Ragdolls are known for their sociability. Our kittens are accustomed from a young age to being around other cats and animals, facilitating their integration into any type of household.",
      q4: "What follow-up do you offer after adoption?",
      a4: "We remain available for life to support our adopters. You will receive personalized advice, can contact us at any time, and join our community of adopters.",
      q5: "How are your kittens raised?",
      a5: "Our kittens grow up in a privileged family environment, surrounded by love and constant attention. They benefit from exclusive pre-education, early socialization, and rigorous veterinary monitoring.",
      q6: "What are the adoption fees?",
      a6: "Prices vary depending on the kitten and its destination (companion or breeding). Contact us to obtain detailed and personalized information according to your project."
    },
    footer: {
      title: "Le Domaine des Licornes Seal",
      subtitle: "Premium Ragdoll Cattery",
      loof: "LOOF - Le domaine des licornes seal",
      navigation: "Navigation",
      contact: "Contact",
      email: "Email: contact@domainedeslicornes.com",
      social: "Follow us on social media",
      copyright: "All rights reserved.",
      tagline: "Where medieval elegance meets feline grace"
    }
  },
  es: {
    common: {
      back: "Volver",
    },
    nav: {
      domain: "El Dominio",
      cats: "Nuestros Unicornios",
      education: "Educación",
      adoption: "Adopción",
      faq: "FAQ",
      contact: "Contacto",
      dashboard: "Panel",
      administration: "Administración",
      clientSpace: "Área Cliente"
    },
    hero: {
      title: "Le Domaine des Licornes Seal",
      subtitle: "Criador Premium de Ragdolls",
      tagline: "Donde la elegancia medieval se encuentra con la gracia felina",
      discoverCats: "Descubre Nuestros Unicornios",
      contactUs: "Contáctenos"
    },
    domain: {
      title: "El Dominio",
      intro1: "Bienvenido a nuestro criadero familiar, donde cada Ragdoll se cría con amor, respeto y según los más altos estándares éticos.",
      intro2: "Inspirados por la nobleza de los unicornios de los tapices medievales, hemos creado un refugio de paz donde nuestros gatos prosperan en un entorno privilegiado, rodeados de atención y cuidados constantes.",
      values: "Nuestros Valores",
      value1: "Ética y bienestar animal en el corazón de nuestras prácticas",
      value2: "Crianza familiar en un entorno excepcional",
      value3: "Pre-educación cuidadosa de cada gatito",
      value4: "Acompañamiento personalizado para los adoptantes",
      discoverLaurence: "Descubrir a Laurence",
      viewGallery: "Ver Galería",
      laurenceTitle: "Laurence, nuestra criadora",
      laurenceP1: "Apasionada por los Ragdolls durante más de 10 años, Laurence fundó Le Domaine des Licornes Seal con la visión de crear un criadero familiar donde cada gato es tratado como un miembro de la familia.",
      laurenceP2: "Su experiencia y dedicación garantizan que cada gatito se beneficie de una socialización óptima y un entorno estimulante desde sus primeros días. Acompaña personalmente a cada familia adoptiva para garantizar una transición armoniosa.",
      laurenceQuote: "Cada Ragdoll es único y merece una atención especial. Mi objetivo es hacer coincidir cada gatito con la familia perfecta para él.",
      galleryTitle: "Galería",
      galleryEmpty: "Fotos y videos próximamente..."
    },
    cats: {
      title: "Nuestros Unicornios",
      breeding: "Nuestros Reproductoras",
      externalBreeders: "Nuestros Reproductores Externos",
      kittens: "Nuestros Gatitos",
      available: "Disponible",
      noKittens: "No hay gatitos disponibles en este momento",
      viewProfile: "Ver perfil",
      alohaDesc: "Nuestro magnífico Ragdoll, dulce y elegante como un unicornio",
      utahDesc: "Una princesa entre los Ragdolls, noble y majestuosa"
    },
    education: {
      title: "Educación",
      intro: "Nuestros gatitos se benefician de una pre-educación exclusiva que garantiza su desarrollo y sociabilidad excepcional.",
      method: "Nuestro Método",
      method1: "Socialización temprana con humanos y otros animales",
      method2: "Estimulación cognitiva adaptada a cada etapa",
      method3: "Aprendizaje de limpieza y buenos hábitos",
      method4: "Seguimiento veterinario riguroso y vacunaciones completas",
      method5: "Documentación detallada de su evolución",
      conclusion: "Cada gatito es tratado como un pequeño unicornio precioso, recibiendo toda la atención necesaria para convertirse en un compañero equilibrado.",
      viewMethod: "Nuestro método en imágenes",
      methodImagesTitle: "Nuestro método en imágenes",
      methodEmpty: "Fotos y videos próximamente..."
    },
    dashboard: {
      title: "Área Cliente",
      loading: "Cargando...",
      signOut: "Cerrar sesión",
      signOutSuccess: "Sesión cerrada con éxito",
      myUnicorns: "Mis Unicornios",
      myProfile: "Mi Perfil",
      loadingKittens: "Cargando gatitos...",
      noKittens: "No hay gatitos asignados en este momento",
      contactInfo: "Contáctenos para más información",
      gender: "Sexo",
      color: "Color",
      weight: "Peso",
      notSpecified: "No especificado",
      male: "Macho",
      female: "Hembra",
      profileTitle: "Información del perfil",
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
      errorLoadingKittens: "Error al cargar los gatitos"
    },
    kittenDetail: {
      loading: "Cargando...",
      notFound: "Gatito no encontrado",
      backToKittens: "Volver a Nuestros Gatitos",
      noPhoto: "Sin foto",
      age: "Edad",
      birthDate: "Fecha de nacimiento",
      gender: "Sexo",
      male: "Macho",
      female: "Hembra",
      color: "Color",
      weight: "Peso",
      about: "Acerca de",
      gallery: "Galería",
      day: "día",
      days: "días",
      month: "mes",
      months: "meses",
      year: "año",
      years: "años",
      and: "y"
    },
    admin: {
      title: "Administración",
      back: "Volver",
      breedingCats: "Reproductores",
      translations: "Traducciones",
      kittenData: "Datos Gatitos",
      kittens: "Gatitos Media",
      domainGallery: "Galería del Dominio",
      education: "Educación",
      testimonials: "Testimonios",
      management: "Gestión"
    },
    catDetail: {
      loading: "Cargando...",
      notFound: "Gato no encontrado",
      backToOurUnicorns: "Volver a Nuestros Unicornios",
      breederMale: "Reproductor",
      breederFemale: "Reproductora",
      information: "Información",
      birthDate: "Fecha de nacimiento",
      color: "Color",
      loofNumber: "N° LOOF",
      chipNumber: "N° Chip",
      personality: "Personalidad",
      pedigree: "Pedigrí",
      gallery: "Galería",
      videoNotSupported: "Su navegador no admite la reproducción de videos.",
      years: "años",
      viewDetails: "Ver detalles"
    },
    adoption: {
      title: "Adopción",
      intro: "Adoptar un Ragdoll de Le Domaine des Licornes significa dar la bienvenida a un compañero excepcional en tu vida. Te acompañamos en cada paso de este maravilloso viaje.",
      step1Title: "Primer Contacto",
      step1Desc: "Completa nuestro formulario para expresar tu interés",
      step2Title: "Reunión",
      step2Desc: "Visita nuestro criadero y conoce a nuestros unicornios",
      step3Title: "Adopción",
      step3Desc: "Da la bienvenida a tu compañero con seguimiento personalizado",
      whatYouGet: "Lo que recibes",
      benefit1: "Certificado de salud completo",
      benefit2: "Registro de vacunación actualizado",
      benefit3: "Pedigrí LOOF certificado",
      benefit4: "Kit de inicio personalizado",
      benefit5: "Guía de educación detallada",
      benefit6: "Seguimiento post-adopción de por vida",
      startAdoption: "Comienza tu adopción",
      clientTestimonials: "Nuestros clientes cuentan"
    },
    contact: {
      title: "Contacto",
      intro: "¿Tienes preguntas o te gustaría conocer a nuestros unicornios? Estamos aquí para apoyarte en tu proyecto de adopción.",
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      country: "País",
      message: "Mensaje",
      send: "Enviar",
      sending: "Enviando...",
      success: "¡Mensaje enviado con éxito!",
      error: "Error al enviar el mensaje"
    },
    faq: {
      title: "Preguntas Frecuentes",
      q1: "¿Qué hace único al Ragdoll?",
      a1: "El Ragdoll es conocido por su temperamento excepcional: tranquilo, cariñoso y dócil. Se relaja completamente cuando se le sostiene en brazos, de ahí su nombre 'muñeca de trapo'. Es el compañero ideal para las familias.",
      q2: "¿A qué edad puedo adoptar un gatito?",
      a2: "Nuestros gatitos dejan el criadero a partir de las 12-14 semanas, nunca antes. Este período permite una socialización óptima con su madre y hermanos, garantizando un carácter equilibrado.",
      q3: "¿Los Ragdolls se llevan bien con otros animales?",
      a3: "¡Sí, excelentemente! Los Ragdolls son conocidos por su sociabilidad. Nuestros gatitos están acostumbrados desde muy jóvenes a convivir con otros gatos y animales, facilitando su integración en cualquier tipo de hogar.",
      q4: "¿Qué seguimiento ofrecen después de la adopción?",
      a4: "Permanecemos disponibles de por vida para acompañar a nuestros adoptantes. Recibirá consejos personalizados, podrá contactarnos en cualquier momento y se unirá a nuestra comunidad de adoptantes.",
      q5: "¿Cómo se crían sus gatitos?",
      a5: "Nuestros gatitos crecen en un entorno familiar privilegiado, rodeados de amor y atención constante. Se benefician de una pre-educación exclusiva, socialización temprana y seguimiento veterinario riguroso.",
      q6: "¿Cuáles son los costos de adopción?",
      a6: "Los precios varían según el gatito y su destino (compañía o reproducción). Contáctenos para obtener información detallada y personalizada según su proyecto."
    },
    footer: {
      title: "Le Domaine des Licornes Seal",
      subtitle: "Criadero Premium de Ragdolls",
      loof: "LOOF - Le domaine des licornes seal",
      navigation: "Navegación",
      contact: "Contacto",
      email: "Email: contact@domainedeslicornes.com",
      social: "Síguenos en las redes sociales",
      copyright: "Todos los derechos reservados.",
      tagline: "Donde la elegancia medieval se encuentra con la gracia felina"
    }
  }
};