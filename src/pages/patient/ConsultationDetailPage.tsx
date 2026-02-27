import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { consultationApi, prescriptionApi } from '@/db/api';
import type { Consultation } from '@/types';
import { Calendar, User, FileText, ArrowLeft, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ConsultationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, isDoctor, isPatient } = useAuth();
  const { t } = useLanguage();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadConsultation();
    }
  }, [id]);

  const loadConsultation = async () => {
    try {
      setLoading(true);
      const data = await consultationApi.getConsultationById(id!);
      setConsultation(data);
      setDiagnosis(data.diagnosis || '');
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Failed to load consultation:', error);
      toast.error('Failed to load consultation details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!isDoctor) return;

    setUpdating(true);
    try {
      await consultationApi.assignDoctor(id!, profile!.id);
      toast.success('Consultation accepted successfully');
      loadConsultation();
    } catch (error) {
      console.error('Failed to accept consultation:', error);
      toast.error('Failed to accept consultation');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateDiagnosis = async () => {
    if (!isDoctor || !diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    setUpdating(true);
    try {
      await consultationApi.updateConsultation(id!, {
        diagnosis: diagnosis.trim(),
        notes: notes.trim() || null,
        status: 'in_progress',
      });
      toast.success('Diagnosis updated successfully');
      loadConsultation();
    } catch (error) {
      console.error('Failed to update diagnosis:', error);
      toast.error('Failed to update diagnosis');
    } finally {
      setUpdating(false);
    }
  };

  const handleComplete = async () => {
    if (!isDoctor) return;

    if (!diagnosis.trim()) {
      toast.error('Please add a diagnosis before completing');
      return;
    }

    setUpdating(true);
    try {
      await consultationApi.updateConsultation(id!, {
        status: 'completed',
        diagnosis: diagnosis.trim(),
        notes: notes.trim() || null,
      });
      toast.success('Consultation completed successfully');
      loadConsultation();
    } catch (error) {
      console.error('Failed to complete consultation:', error);
      toast.error('Failed to complete consultation');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this consultation?')) return;

    setUpdating(true);
    try {
      await consultationApi.updateConsultation(id!, { status: 'cancelled' });
      toast.success('Consultation cancelled');
      navigate(isDoctor ? '/doctor/consultations' : '/patient/consultations');
    } catch (error) {
      console.error('Failed to cancel consultation:', error);
      toast.error('Failed to cancel consultation');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'in_progress':
        return 'bg-primary/10 text-primary';
      case 'completed':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 bg-muted" />
          <Skeleton className="h-64 bg-muted" />
          <Skeleton className="h-48 bg-muted" />
        </div>
      </MainLayout>
    );
  }

  if (!consultation) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertTitle>Consultation Not Found</AlertTitle>
            <AlertDescription>The consultation you're looking for doesn't exist or you don't have access to it.</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            className="gap-2 mb-4"
            onClick={() => navigate(isDoctor ? '/doctor/consultations' : '/patient/consultations')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Consultations
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Consultation Details</h1>
              <p className="text-muted-foreground">ID: {consultation.id.slice(0, 8)}</p>
            </div>
            <Badge className={getStatusColor(consultation.status)}>{consultation.status.replace('_', ' ')}</Badge>
          </div>
        </div>

        {/* Pending Alert for Doctor */}
        {isDoctor && consultation.status === 'pending' && !consultation.doctor_id && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertTitle>New Consultation Request</AlertTitle>
            <AlertDescription>
              This consultation is waiting for a doctor to accept it. Would you like to take this consultation?
            </AlertDescription>
            <div className="mt-4">
              <Button onClick={handleAccept} disabled={updating} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                {updating ? 'Accepting...' : 'Accept Consultation'}
              </Button>
            </div>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Patient</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{consultation.patient?.full_name || 'Unknown'}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Doctor</Label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {consultation.doctor ? `Dr. ${consultation.doctor.full_name}` : 'Not assigned yet'}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Consultation Type</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium capitalize">{consultation.consultation_type.replace('_', ' ')}</span>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Created</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{format(new Date(consultation.created_at), 'MMM dd, yyyy HH:mm')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle>Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{consultation.symptoms}</p>
          </CardContent>
        </Card>

        {/* Medical History */}
        {consultation.medical_history && (
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{consultation.medical_history}</p>
            </CardContent>
          </Card>
        )}

        {/* Diagnosis - Editable for Doctor */}
        {isDoctor && consultation.doctor_id === profile?.id && consultation.status !== 'cancelled' ? (
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis & Treatment</CardTitle>
              <CardDescription>Add your diagnosis and treatment recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Textarea
                  id="diagnosis"
                  placeholder="Enter your diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes or recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateDiagnosis} disabled={updating || !diagnosis.trim()}>
                  {updating ? 'Saving...' : 'Save Diagnosis'}
                </Button>
                {consultation.status === 'in_progress' && (
                  <Button onClick={handleComplete} disabled={updating || !diagnosis.trim()} variant="outline">
                    Complete Consultation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          consultation.diagnosis && (
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{consultation.diagnosis}</p>
                {consultation.notes && (
                  <div className="mt-4">
                    <Label className="text-muted-foreground">Additional Notes</Label>
                    <p className="text-muted-foreground whitespace-pre-wrap mt-1">{consultation.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {consultation.status === 'pending' && (
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleCancel} disabled={updating}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Consultation
              </Button>
            )}
            {isDoctor && consultation.status === 'completed' && (
              <Button
                variant="outline"
                onClick={() => navigate(`/doctor/prescriptions/new?consultation=${consultation.id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Prescription
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
