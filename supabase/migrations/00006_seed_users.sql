-- seed initial admin, doctor, and patient profiles

INSERT INTO public.profiles (id, email, phone, role, approved, full_name, avatar_url, language, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'admin@miaoda.com', null, 'admin', true, 'System Administrator', null, 'en', now(), now()),
  (gen_random_uuid(), 'doctor@miaoda.com', null, 'doctor', true, 'Dr. John Doe', null, 'en', now(), now()),
  (gen_random_uuid(), 'patient@miaoda.com', null, 'patient', true, 'Jane Patient', null, 'en', now(), now());
