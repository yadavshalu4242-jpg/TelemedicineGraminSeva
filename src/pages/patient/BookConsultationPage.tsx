import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { consultationApi } from '@/db/api';
import type { ConsultationType } from '@/types';
import { Calendar, Video, Mic, MessageSquare, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function BookConsultationPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    consultation_type: 'chat' as ConsultationType,
    symptoms: '',
    medical_history: '',
    preferred_date: '',
    preferred_time: '',
  });

  const consultationTypes = [
    { value: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face video consultation' },
    { value: 'voice', label: 'Voice Call', icon: Mic, description: 'Audio-only consultation' },
    { value: 'chat', label: 'Chat', icon: MessageSquare, description: 'Text-based consultation' },
    { value: 'in_person', label: 'In Person', icon: User, description: 'Physical visit to clinic' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setLoading(true);

    try {
      const consultation = await consultationApi.createConsultation({
        patient_id: profile!.id,
        consultation_type: formData.consultation_type,
        symptoms: formData.symptoms,
        medical_history: formData.medical_history || undefined,
        status: 'pending',
      });

      toast.success('Consultation booked successfully!');
      navigate(`/patient/consultations/${consultation.id}`);
    } catch (error) {
      console.error('Failed to book consultation:', error);
      toast.error('Failed to book consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button variant="ghost" className="gap-2 mb-4" onClick={() => navigate('/patient/consultations')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Consultations
          </Button>
          <h1 className="text-3xl font-bold mb-2">Book a Consultation</h1>
          <p className="text-muted-foreground">Fill in the details to schedule your medical consultation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultation Type */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Type</CardTitle>
              <CardDescription>Choose how you would like to consult with a doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultationTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.consultation_type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, consultation_type: type.value as ConsultationType })}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms</CardTitle>
              <CardDescription>Describe your current symptoms in detail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">What symptoms are you experiencing? *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms, when they started, and their severity..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be as detailed as possible to help the doctor understand your condition
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card>
            <CardHeader>
              <CardTitle>Medical History (Optional)</CardTitle>
              <CardDescription>Any relevant medical history or current medications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical_history">Medical History</Label>
                <Textarea
                  id="medical_history"
                  placeholder="Any chronic conditions, allergies, current medications, or previous surgeries..."
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferred Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Preferred Schedule (Optional)</CardTitle>
              <CardDescription>When would you prefer to have the consultation?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_date">Preferred Date</Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_time">Preferred Time</Label>
                  <Input
                    id="preferred_time"
                    type="time"
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: The actual consultation time will be confirmed by the doctor
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Booking...' : 'Book Consultation'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/patient/consultations')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
