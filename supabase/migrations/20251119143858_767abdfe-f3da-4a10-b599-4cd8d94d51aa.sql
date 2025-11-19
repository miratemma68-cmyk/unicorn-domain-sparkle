-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create kittens table
CREATE TABLE public.kittens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  color TEXT,
  breed_info TEXT,
  microchip_number TEXT,
  registration_number TEXT,
  current_weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_kittens association table
CREATE TABLE public.client_kittens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  kitten_id UUID REFERENCES public.kittens(id) ON DELETE CASCADE NOT NULL,
  adoption_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (client_id, kitten_id)
);

-- Create kitten_updates table
CREATE TABLE public.kitten_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitten_id UUID REFERENCES public.kittens(id) ON DELETE CASCADE NOT NULL,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kitten_milestones table
CREATE TABLE public.kitten_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitten_id UUID REFERENCES public.kittens(id) ON DELETE CASCADE NOT NULL,
  milestone_date DATE NOT NULL,
  milestone_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kitten_vet_visits table
CREATE TABLE public.kitten_vet_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitten_id UUID REFERENCES public.kittens(id) ON DELETE CASCADE NOT NULL,
  visit_date DATE NOT NULL,
  vet_name TEXT,
  visit_type TEXT,
  notes TEXT,
  next_visit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kitten_media table
CREATE TABLE public.kitten_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitten_id UUID REFERENCES public.kittens(id) ON DELETE CASCADE NOT NULL,
  update_id UUID REFERENCES public.kitten_updates(id) ON DELETE SET NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kittens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_kittens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitten_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitten_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitten_vet_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitten_media ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kittens
CREATE POLICY "Clients can view their assigned kittens"
  ON public.kittens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_kittens
      WHERE kitten_id = kittens.id
        AND client_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all kittens"
  ON public.kittens FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for client_kittens
CREATE POLICY "Clients can view their own kitten assignments"
  ON public.client_kittens FOR SELECT
  USING (auth.uid() = client_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage kitten assignments"
  ON public.client_kittens FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kitten_updates
CREATE POLICY "Clients can view updates for their kittens"
  ON public.kitten_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_kittens
      WHERE kitten_id = kitten_updates.kitten_id
        AND client_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all updates"
  ON public.kitten_updates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kitten_milestones
CREATE POLICY "Clients can view milestones for their kittens"
  ON public.kitten_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_kittens
      WHERE kitten_id = kitten_milestones.kitten_id
        AND client_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all milestones"
  ON public.kitten_milestones FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kitten_vet_visits
CREATE POLICY "Clients can view vet visits for their kittens"
  ON public.kitten_vet_visits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_kittens
      WHERE kitten_id = kitten_vet_visits.kitten_id
        AND client_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all vet visits"
  ON public.kitten_vet_visits FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for kitten_media
CREATE POLICY "Clients can view media for their kittens"
  ON public.kitten_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_kittens
      WHERE kitten_id = kitten_media.kitten_id
        AND client_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage all media"
  ON public.kitten_media FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for kitten media
INSERT INTO storage.buckets (id, name, public)
VALUES ('kitten-media', 'kitten-media', false);

-- Storage RLS policies
CREATE POLICY "Admins can upload kitten media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kitten-media'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update kitten media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'kitten-media'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete kitten media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'kitten-media'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Authenticated users can view kitten media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'kitten-media' AND auth.uid() IS NOT NULL);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kittens_updated_at
  BEFORE UPDATE ON public.kittens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign client role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();