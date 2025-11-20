import { useEffect, useState } from "react";
import tapestrySmell from "@/assets/tapestry-smell.jpg";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap } from "lucide-react";

interface EducationMedia {
  id: string;
  media_type: string;
  file_url: string;
  caption: string | null;
}

export const EducationSection = () => {
  const [educationMedia, setEducationMedia] = useState<EducationMedia[]>([]);

  useEffect(() => {
    loadEducationMedia();
  }, []);

  const loadEducationMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('education_media')
        .select('id, media_type, file_url, caption')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setEducationMedia(data || []);
    } catch (error) {
      console.error('Error loading education media:', error);
    }
  };

  return (
    <section id="education" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-display text-gold medieval-glow text-center mb-12">
          Éducation
        </h2>

        {/* Introduction Section */}
        <div className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <img 
                src={tapestrySmell} 
                alt="La Dame à la Licorne - L'Odorat" 
                className="w-full rounded-[3rem] tapestry-border shadow-2xl"
              />
            </div>
            
            <div className="space-y-6 text-ivory/90 order-1 md:order-2">
              <p className="text-lg leading-relaxed">
                Nos chatons bénéficient d'une pré-éducation exclusive qui garantit 
                leur épanouissement et leur sociabilité exceptionnelle.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-display text-gold">Notre Méthode</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Socialisation précoce avec humains et autres animaux</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Stimulation cognitive adaptée à chaque étape</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Apprentissage de la propreté et des bonnes habitudes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Suivi vétérinaire rigoureux et vaccinations complètes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-gold text-2xl">✦</span>
                    <span>Documentation détaillée de leur évolution</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-lg leading-relaxed italic">
                Chaque chaton est traité comme une petite licorne précieuse, 
                recevant toute l'attention nécessaire pour devenir un compagnon équilibré.
              </p>

              {/* Navigation Button */}
              <div className="mt-8">
                <a 
                  href="#methode-images"
                  className="inline-flex items-center justify-center gap-2 bg-crimson hover:bg-crimson-dark text-ivory border-2 border-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] rounded-full hover:scale-105 font-display text-lg px-8 py-4"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('methode-images')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <GraduationCap className="w-5 h-5" />
                  Notre méthode en images
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Notre méthode en images */}
        <div id="methode-images" className="tapestry-border bg-card/80 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 mt-12">
          <h3 className="text-3xl font-display text-gold medieval-glow text-center mb-8">
            Notre méthode en images
          </h3>
          
          {educationMedia.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationMedia.map((item) => (
                <div 
                  key={item.id}
                  className="aspect-video rounded-[2rem] overflow-hidden tapestry-border bg-midnight/30 group hover:scale-105 transition-transform duration-300"
                >
                  {item.media_type === 'video' ? (
                    <video
                      src={item.file_url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img 
                      src={item.file_url}
                      alt={item.caption || "Photo méthode éducative"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item}
                  className="aspect-video rounded-[2rem] overflow-hidden tapestry-border bg-midnight/30 flex items-center justify-center group hover:scale-105 transition-transform duration-300"
                >
                  <span className="text-gold/30 text-4xl group-hover:text-gold/50 transition-colors">✦</span>
                </div>
              ))}
            </div>
          )}
          
          {educationMedia.length === 0 && (
            <p className="text-center text-ivory/60 mt-8 italic">
              Photos et vidéos à venir...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};