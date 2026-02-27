import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { prescriptionApi } from '@/db/api';
import type { Prescription } from '@/types';
import { FileText, Calendar, User, QrCode, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function PrescriptionsPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    if (profile?.id) {
      loadPrescriptions();
    }
  }, [profile?.id]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionApi.getPatientPrescriptions(profile!.id, 50);
      setPrescriptions(data);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = (prescription: Prescription) => {
    const canvas = document.querySelector(`#qr-${prescription.id} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `prescription-${prescription.id}.png`;
      link.href = url;
      link.click();
      toast.success('QR code downloaded');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('nav.prescriptions')}</h1>
            <p className="text-muted-foreground">View and manage your digital prescriptions</p>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 bg-muted" />
              ))}
            </>
          ) : prescriptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Prescriptions Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Your prescriptions will appear here after consultations
                </p>
                <Link to="/patient/consultations/new">
                  <Button>Book a Consultation</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            prescriptions.map((prescription) => (
              <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Prescription #{prescription.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Dr. {prescription.doctor?.full_name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(prescription.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <QrCode className="h-4 w-4" />
                          QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Prescription QR Code</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4 py-4">
                          <div id={`qr-${prescription.id}`}>
                            <QRCodeDataUrl
                              text={prescription.qr_code_data || JSON.stringify(prescription)}
                              width={256}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground text-center">
                            Scan this QR code at the pharmacy to retrieve your prescription
                          </p>
                          <Button onClick={() => downloadQRCode(prescription)} className="gap-2">
                            <Download className="h-4 w-4" />
                            Download QR Code
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Medications */}
                  <div>
                    <h4 className="font-semibold mb-2">Medications</h4>
                    <div className="space-y-2">
                      {prescription.medications.map((med, index) => (
                        <div key={index} className="p-3 rounded-lg bg-muted">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {med.dosage} • {med.frequency}
                              </p>
                            </div>
                            <Badge variant="outline">{med.duration}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  {prescription.instructions && (
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                        {prescription.instructions}
                      </p>
                    </div>
                  )}

                  {/* Valid Until */}
                  {prescription.valid_until && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">
                        Valid until {format(new Date(prescription.valid_until), 'MMM dd, yyyy')}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
