-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Doctors can view assigned consultations" ON consultations;

-- Create new policy allowing doctors to view all consultations (assigned + pending)
CREATE POLICY "Doctors can view all consultations"
ON consultations FOR SELECT
TO authenticated
USING (
  is_doctor(auth.uid()) OR 
  doctor_id = auth.uid() OR 
  patient_id = auth.uid()
);