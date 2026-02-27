-- Add medical_history column to consultations table
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS medical_history TEXT;