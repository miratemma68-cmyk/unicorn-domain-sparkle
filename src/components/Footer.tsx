export const Footer = () => {
  return (
    <footer className="border-t border-gold/30 bg-midnight/80 backdrop-blur-sm py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-serif text-gold mb-4">Le Domaine des Licornes</h3>
            <p className="text-ivory/70">
              Élevage familial premium de Ragdolls<br />
              LOOF - Le domaine des licornes seal
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">Navigation</h3>
            <ul className="space-y-2 text-ivory/70">
              <li><a href="#domaine" className="hover:text-gold transition-colors">Le Domaine</a></li>
              <li><a href="#licornes" className="hover:text-gold transition-colors">Nos Licornes</a></li>
              <li><a href="#education" className="hover:text-gold transition-colors">Éducation</a></li>
              <li><a href="#adoption" className="hover:text-gold transition-colors">Adoption</a></li>
              <li><a href="#faq" className="hover:text-gold transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-gold mb-4">Contact</h3>
            <ul className="space-y-2 text-ivory/70">
              <li>Email: contact@domainedeslicornes.com</li>
              <li>Suivez-nous sur les réseaux sociaux</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-ivory/60">
          <p>&copy; {new Date().getFullYear()} Le Domaine des Licornes. Tous droits réservés.</p>
          <p className="mt-2 text-sm italic">
            "Où l'élégance médiévale rencontre la grâce féline"
          </p>
        </div>
      </div>
    </footer>
  );
};
