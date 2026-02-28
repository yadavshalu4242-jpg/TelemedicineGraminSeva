-- add approval flag for doctors
ALTER TABLE public.profiles
ADD COLUMN approved boolean NOT NULL DEFAULT false;

-- ensure existing doctors are marked approved so we don't lock out pre-existing accounts
UPDATE public.profiles SET approved = true WHERE role = 'doctor';
