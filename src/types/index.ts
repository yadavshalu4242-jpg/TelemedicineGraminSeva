export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

// User role types
export type UserRole = 'patient' | 'doctor' | 'admin';

// Consultation types
export type ConsultationStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ConsultationType = 'ai_chat' | 'voice' | 'video' | 'ar_diagnosis';

// Record types
export type RecordType = 'image' | 'video' | 'document' | 'note';

// Chat role types
export type ChatRole = 'user' | 'assistant';

// Language types
export type Language = 'en' | 'hi' | 'mr';

// Profile interface
export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  approved?: boolean; // doctors must be approved by admin before accessing dashboard
  full_name: string | null;
  avatar_url: string | null;
  language: Language;
  created_at: string;
  updated_at: string;
}

// Consultation interface
export interface Consultation {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  status: ConsultationStatus;
  consultation_type: ConsultationType;
  symptoms: string | null;
  medical_history: string | null;
  diagnosis: string | null;
  notes: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  patient?: Profile;
  doctor?: Profile;
}

// Prescription interface
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  consultation_id: string | null;
  doctor_id: string;
  patient_id: string;
  medications: Medication[];
  instructions: string | null;
  qr_code_data: string | null;
  valid_until: string | null;
  created_at: string;
  doctor?: Profile;
  patient?: Profile;
  consultation?: Consultation;
}

// Medical record interface
export interface MedicalRecord {
  id: string;
  patient_id: string;
  record_type: RecordType;
  title: string;
  description: string | null;
  file_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Symptom database interface
export interface Symptom {
  id: string;
  symptom_name: string;
  category: string | null;
  severity: string | null;
  related_conditions: string[];
  recommendations: string | null;
  language: Language;
  created_at: string;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  user_id: string;
  consultation_id: string | null;
  role: ChatRole;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// API message format for chat
export interface ApiChatMessage {
  role: 'user' | 'model';
  content: string;
}
