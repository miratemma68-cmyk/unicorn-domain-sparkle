-- Create FAQ table with multilingual support
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  question_en TEXT,
  question_es TEXT,
  answer TEXT NOT NULL,
  answer_en TEXT,
  answer_es TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Admins can manage all FAQs
CREATE POLICY "Admins can manage FAQs"
ON public.faqs
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Anyone can view FAQs
CREATE POLICY "Anyone can view FAQs"
ON public.faqs
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing FAQs from the code
INSERT INTO public.faqs (question, question_en, question_es, answer, answer_en, answer_es, display_order) VALUES
('Qu''est-ce qu''un Ragdoll ?', 'What is a Ragdoll?', '¿Qué es un Ragdoll?', 'Le Ragdoll est une race de chat domestique de grande taille, connu pour son tempérament doux et sa tendance à devenir mou lorsqu''on le prend dans les bras.', 'The Ragdoll is a large breed of domestic cat, known for its gentle temperament and tendency to go limp when picked up.', 'El Ragdoll es una raza de gato doméstico de gran tamaño, conocido por su temperamento suave y su tendencia a ponerse flácido cuando se le levanta.', 1),
('Quelle est l''origine du Ragdoll ?', 'What is the origin of the Ragdoll?', '¿Cuál es el origen del Ragdoll?', 'La race Ragdoll a été développée dans les années 1960 en Californie par Ann Baker.', 'The Ragdoll breed was developed in the 1960s in California by Ann Baker.', 'La raza Ragdoll fue desarrollada en la década de 1960 en California por Ann Baker.', 2),
('Les Ragdolls sont-ils hypoallergéniques ?', 'Are Ragdolls hypoallergenic?', '¿Son los Ragdolls hipoalergénicos?', 'Non, les Ragdolls ne sont pas hypoallergéniques. Cependant, certaines personnes allergiques peuvent les tolérer mieux que d''autres races.', 'No, Ragdolls are not hypoallergenic. However, some allergic people may tolerate them better than other breeds.', 'No, los Ragdolls no son hipoalergénicos. Sin embargo, algunas personas alérgicas pueden tolerarlos mejor que otras razas.', 3),
('Combien pèse un Ragdoll adulte ?', 'How much does an adult Ragdoll weigh?', '¿Cuánto pesa un Ragdoll adulto?', 'Les mâles pèsent généralement entre 6 et 9 kg, tandis que les femelles pèsent entre 4,5 et 6,8 kg.', 'Males typically weigh between 6 and 9 kg, while females weigh between 4.5 and 6.8 kg.', 'Los machos suelen pesar entre 6 y 9 kg, mientras que las hembras pesan entre 4,5 y 6,8 kg.', 4),
('Quel est le caractère du Ragdoll ?', 'What is the temperament of the Ragdoll?', '¿Cuál es el temperamento del Ragdoll?', 'Les Ragdolls sont connus pour être doux, affectueux, et sociables. Ils s''entendent bien avec les enfants et les autres animaux.', 'Ragdolls are known to be gentle, affectionate, and sociable. They get along well with children and other animals.', 'Los Ragdolls son conocidos por ser gentiles, cariñosos y sociables. Se llevan bien con los niños y otros animales.', 5),
('Comment entretenir le pelage d''un Ragdoll ?', 'How to maintain a Ragdoll''s coat?', '¿Cómo mantener el pelaje de un Ragdoll?', 'Le pelage du Ragdoll nécessite un brossage régulier (2-3 fois par semaine) pour éviter les nœuds et maintenir sa beauté.', 'The Ragdoll''s coat requires regular brushing (2-3 times per week) to prevent knots and maintain its beauty.', 'El pelaje del Ragdoll requiere un cepillado regular (2-3 veces por semana) para evitar nudos y mantener su belleza.', 6);