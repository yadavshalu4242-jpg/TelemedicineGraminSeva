-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('patient', 'doctor', 'admin');

-- Create consultation status enum
CREATE TYPE public.consultation_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Create consultation type enum
CREATE TYPE public.consultation_type AS ENUM ('ai_chat', 'voice', 'video', 'ar_diagnosis');

-- Create record type enum
CREATE TYPE public.record_type AS ENUM ('image', 'video', 'document', 'note');

-- Create chat role enum
CREATE TYPE public.chat_role AS ENUM ('user', 'assistant');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  role public.user_role NOT NULL DEFAULT 'patient'::public.user_role,
  full_name text,
  avatar_url text,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultations table
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.consultation_status NOT NULL DEFAULT 'pending'::public.consultation_status,
  consultation_type public.consultation_type NOT NULL,
  symptoms text,
  diagnosis text,
  notes text,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES public.consultations(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  medications jsonb NOT NULL DEFAULT '[]'::jsonb,
  instructions text,
  qr_code_data text,
  valid_until timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  record_type public.record_type NOT NULL,
  title text NOT NULL,
  description text,
  file_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create symptoms_database table
CREATE TABLE public.symptoms_database (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_name text NOT NULL,
  category text,
  severity text,
  related_conditions jsonb DEFAULT '[]'::jsonb,
  recommendations text,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  consultation_id uuid REFERENCES public.consultations(id) ON DELETE CASCADE,
  role public.chat_role NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX idx_consultations_doctor ON public.consultations(doctor_id);
CREATE INDEX idx_consultations_status ON public.consultations(status);
CREATE INDEX idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON public.prescriptions(doctor_id);
CREATE INDEX idx_medical_records_patient ON public.medical_records(patient_id);
CREATE INDEX idx_chat_messages_user ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_consultation ON public.chat_messages(consultation_id);
CREATE INDEX idx_symptoms_language ON public.symptoms_database(language);

-- Create storage bucket for medical images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-9x8mtlzrh2wx_medical_images', 'app-9x8mtlzrh2wx_medical_images', true);

-- Storage policies for medical images
CREATE POLICY "Authenticated users can upload medical images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'app-9x8mtlzrh2wx_medical_images');

CREATE POLICY "Public can view medical images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'app-9x8mtlzrh2wx_medical_images');

CREATE POLICY "Users can update their own medical images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'app-9x8mtlzrh2wx_medical_images');

CREATE POLICY "Users can delete their own medical images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'app-9x8mtlzrh2wx_medical_images');

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'admin'::public.user_role
  );
$$;

-- Helper function to check if user is doctor
CREATE OR REPLACE FUNCTION public.is_doctor(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = uid AND p.role = 'doctor'::public.user_role
  );
$$;

-- Trigger function to sync auth.users to profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO public.profiles (id, email, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'patient'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for user sync
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Doctors can view patient profiles" ON public.profiles
  FOR SELECT TO authenticated USING (
    public.is_doctor(auth.uid()) OR auth.uid() = id
  );

-- Create public view for shareable profile info
CREATE VIEW public.public_profiles AS
  SELECT id, full_name, role, avatar_url FROM public.profiles;

-- RLS Policies for consultations
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to consultations" ON public.consultations
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Patients can view their own consultations" ON public.consultations
  FOR SELECT TO authenticated USING (patient_id = auth.uid());

CREATE POLICY "Patients can create consultations" ON public.consultations
  FOR INSERT TO authenticated WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update their own pending consultations" ON public.consultations
  FOR UPDATE TO authenticated 
  USING (patient_id = auth.uid() AND status = 'pending'::public.consultation_status)
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can view assigned consultations" ON public.consultations
  FOR SELECT TO authenticated USING (
    doctor_id = auth.uid() OR public.is_doctor(auth.uid())
  );

CREATE POLICY "Doctors can update assigned consultations" ON public.consultations
  FOR UPDATE TO authenticated 
  USING (doctor_id = auth.uid() OR public.is_doctor(auth.uid()))
  WITH CHECK (doctor_id = auth.uid() OR public.is_doctor(auth.uid()));

-- RLS Policies for prescriptions
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to prescriptions" ON public.prescriptions
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Patients can view their own prescriptions" ON public.prescriptions
  FOR SELECT TO authenticated USING (patient_id = auth.uid());

CREATE POLICY "Doctors can create prescriptions" ON public.prescriptions
  FOR INSERT TO authenticated WITH CHECK (
    doctor_id = auth.uid() AND public.is_doctor(auth.uid())
  );

CREATE POLICY "Doctors can view their prescriptions" ON public.prescriptions
  FOR SELECT TO authenticated USING (doctor_id = auth.uid());

-- RLS Policies for medical_records
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to medical records" ON public.medical_records
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Patients can manage their own medical records" ON public.medical_records
  FOR ALL TO authenticated USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Doctors can view medical records" ON public.medical_records
  FOR SELECT TO authenticated USING (public.is_doctor(auth.uid()));

-- RLS Policies for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can create their own chat messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS Policies for symptoms_database (public read)
ALTER TABLE public.symptoms_database ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view symptoms database" ON public.symptoms_database
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage symptoms database" ON public.symptoms_database
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Insert sample symptoms data for offline checker
INSERT INTO public.symptoms_database (symptom_name, category, severity, related_conditions, recommendations, language) VALUES
('Fever', 'General', 'Medium', '["Common Cold", "Flu", "Infection"]', 'Rest, stay hydrated, monitor temperature. Consult doctor if fever persists beyond 3 days.', 'en'),
('Headache', 'Neurological', 'Low', '["Tension", "Migraine", "Dehydration"]', 'Rest in a quiet dark room, stay hydrated. Consult doctor if severe or persistent.', 'en'),
('Cough', 'Respiratory', 'Medium', '["Common Cold", "Bronchitis", "Allergies"]', 'Stay hydrated, avoid irritants. Consult doctor if cough persists or worsens.', 'en'),
('Chest Pain', 'Cardiovascular', 'High', '["Heart Attack", "Angina", "Anxiety"]', 'Seek immediate medical attention if severe or accompanied by shortness of breath.', 'en'),
('Shortness of Breath', 'Respiratory', 'High', '["Asthma", "Pneumonia", "Heart Failure"]', 'Seek immediate medical attention, especially if sudden or severe.', 'en'),
('बुखार', 'सामान्य', 'Medium', '["सामान्य सर्दी", "फ्लू", "संक्रमण"]', 'आराम करें, हाइड्रेटेड रहें, तापमान की निगरानी करें। यदि बुखार 3 दिनों से अधिक रहता है तो डॉक्टर से परामर्श लें।', 'hi'),
('सिरदर्द', 'न्यूरोलॉजिकल', 'Low', '["तनाव", "माइग्रेन", "निर्जलीकरण"]', 'शांत अंधेरे कमरे में आराम करें, हाइड्रेटेड रहें। यदि गंभीर या लगातार हो तो डॉक्टर से परामर्श लें।', 'hi'),
('ताप', 'सामान्य', 'Medium', '["सामान्य सर्दी", "फ्लू", "संसर्ग"]', 'विश्रांती घ्या, हायड्रेटेड राहा, तापमान तपासा। जर ताप 3 दिवसांपेक्षा जास्त काळ राहिला तर डॉक्टरांचा सल्ला घ्या।', 'mr'),
('डोकेदुखी', 'न्यूरोलॉजिकल', 'Low', '["तणाव", "मायग्रेन", "निर्जलीकरण"]', 'शांत अंधाऱ्या खोलीत विश्रांती घ्या, हायड्रेटेड राहा। जर गंभीर किंवा सतत असेल तर डॉक्टरांचा सल्ला घ्या।', 'mr');