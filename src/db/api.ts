import { supabase } from './supabase';
import type {
  Profile,
  Consultation,
  Prescription,
  MedicalRecord,
  Symptom,
  ChatMessage,
  UserRole,
  ConsultationStatus,
  ConsultationType,
  RecordType,
  Language,
  Medication,
} from '@/types';

// Profile API
export const profileApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as Profile | null;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Profile;
  },

  async getAllProfiles(role?: UserRole) {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Profile[];
  },

  async updateUserRole(userId: string, role: UserRole) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Profile;
  },
};

// Consultation API
export const consultationApi = {
  async createConsultation(consultation: {
    patient_id: string;
    consultation_type: ConsultationType;
    symptoms?: string;
    medical_history?: string;
    scheduled_at?: string;
    status?: ConsultationStatus;
  }) {
    const { data, error } = await supabase
      .from('consultations')
      .insert(consultation)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Consultation;
  },

  async getConsultation(id: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        patient:profiles!consultations_patient_id_fkey(*),
        doctor:profiles!consultations_doctor_id_fkey(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Consultation | null;
  },

  async getConsultationById(id: string) {
    return this.getConsultation(id);
  },

  async getPatientConsultations(patientId: string, limit = 20) {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        doctor:profiles!consultations_doctor_id_fkey(*)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Consultation[];
  },

  async getDoctorConsultations(doctorId: string, status?: ConsultationStatus, limit = 20) {
    let query = supabase
      .from('consultations')
      .select(`
        *,
        patient:profiles!consultations_patient_id_fkey(*)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Consultation[];
  },

  async getPendingConsultations(limit = 20) {
    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        patient:profiles!consultations_patient_id_fkey(*)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Consultation[];
  },

  async updateConsultation(id: string, updates: Partial<Consultation>) {
    const { data, error } = await supabase
      .from('consultations')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Consultation;
  },

  async assignDoctor(consultationId: string, doctorId: string) {
    const { data, error } = await supabase
      .from('consultations')
      .update({ doctor_id: doctorId, status: 'in_progress' })
      .eq('id', consultationId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Consultation;
  },
};

// Prescription API
export const prescriptionApi = {
  async createPrescription(prescription: {
    consultation_id?: string;
    doctor_id: string;
    patient_id: string;
    medications: Medication[];
    instructions?: string;
    qr_code_data?: string;
    valid_until?: string;
  }) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert(prescription)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Prescription;
  },

  async getPrescription(id: string) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:profiles!prescriptions_doctor_id_fkey(*),
        patient:profiles!prescriptions_patient_id_fkey(*),
        consultation:consultations(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Prescription | null;
  },

  async getPatientPrescriptions(patientId: string, limit = 20) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:profiles!prescriptions_doctor_id_fkey(*)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Prescription[];
  },

  async getDoctorPrescriptions(doctorId: string, limit = 20) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:profiles!prescriptions_patient_id_fkey(*)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Prescription[];
  },
};

// Medical Records API
export const medicalRecordApi = {
  async createRecord(record: {
    patient_id: string;
    record_type: RecordType;
    title: string;
    description?: string;
    file_url?: string;
    metadata?: Record<string, unknown>;
  }) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert(record)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as MedicalRecord;
  },

  async getPatientRecords(patientId: string, recordType?: RecordType, limit = 50) {
    let query = supabase
      .from('medical_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (recordType) {
      query = query.eq('record_type', recordType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as MedicalRecord[];
  },

  async deleteRecord(id: string) {
    const { error } = await supabase.from('medical_records').delete().eq('id', id);

    if (error) throw error;
  },
};

// Symptoms Database API
export const symptomsApi = {
  async searchSymptoms(query: string, language: Language = 'en', limit = 10) {
    const { data, error } = await supabase
      .from('symptoms_database')
      .select('*')
      .eq('language', language)
      .ilike('symptom_name', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return (data || []) as Symptom[];
  },

  async getAllSymptoms(language: Language = 'en') {
    const { data, error } = await supabase
      .from('symptoms_database')
      .select('*')
      .eq('language', language)
      .order('symptom_name');

    if (error) throw error;
    return (data || []) as Symptom[];
  },

  async getSymptomsByCategory(category: string, language: Language = 'en') {
    const { data, error } = await supabase
      .from('symptoms_database')
      .select('*')
      .eq('language', language)
      .eq('category', category)
      .order('symptom_name');

    if (error) throw error;
    return (data || []) as Symptom[];
  },
};

// Chat Messages API
export const chatApi = {
  async saveMessage(message: {
    user_id: string;
    consultation_id?: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: Record<string, unknown>;
  }) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ChatMessage;
  },

  async getUserMessages(userId: string, consultationId?: string, limit = 50) {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (consultationId) {
      query = query.eq('consultation_id', consultationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as ChatMessage[];
  },

  async getConsultationMessages(consultationId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as ChatMessage[];
  },
};

// Storage API for medical images
export const storageApi = {
  async uploadMedicalImage(file: File, patientId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${patientId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('app-9x8mtlzrh2wx_medical_images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from('app-9x8mtlzrh2wx_medical_images').getPublicUrl(fileName);

    return { path: data.path, url: publicUrl };
  },

  async deleteMedicalImage(path: string) {
    const { error } = await supabase.storage.from('app-9x8mtlzrh2wx_medical_images').remove([path]);

    if (error) throw error;
  },

  getPublicUrl(path: string) {
    const {
      data: { publicUrl },
    } = supabase.storage.from('app-9x8mtlzrh2wx_medical_images').getPublicUrl(path);

    return publicUrl;
  },
};

// Edge Functions API
export const edgeFunctionsApi = {
  async sendChatMessage(messages: { role: string; content: string }[], userId?: string, consultationId?: string) {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { messages, userId, consultationId },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in ai-chat:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to send chat message');
    }

    return data;
  },

  async transcribeAudio(audioFile: File, language: string = 'en') {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('language', language);
    formData.append('response_format', 'verbose_json');

    const { data, error } = await supabase.functions.invoke('speech-to-text', {
      body: formData,
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in speech-to-text:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to transcribe audio');
    }

    return data;
  },

  async textToSpeech(text: string, voice: string = 'heart') {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { input: text, voice, response_format: 'mp3' },
    });

    if (error) {
      const errorMsg = await error?.context?.text();
      console.error('Edge function error in text-to-speech:', errorMsg || error?.message);
      throw new Error(errorMsg || error?.message || 'Failed to generate speech');
    }

    return data;
  },
};
