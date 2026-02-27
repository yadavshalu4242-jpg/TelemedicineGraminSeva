import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { consultationApi } from '@/db/api';
import type { Consultation } from '@/types';
import { Calendar, Clock, User, FileText, CheckCircle, Video, Mic, MessageSquare, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function DoctorConsultationsPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'pending'>('my');

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [myConsultations, pending] = await Promise.all([
        consultationApi.getDoctorConsultations(profile!.id),
        consultationApi.getPendingConsultations(50),
      ]);
      setConsultations(myConsultations);
      setPendingConsultations(pending);
    } catch (error) {
      console.error('Failed to load consultations:', error);
      toast.error('परामर्श लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (consultationId: string) => {
    try {
      await consultationApi.assignDoctor(consultationId, profile!.id);
      toast.success('परामर्श स्वीकार किया गया');
      loadData();
    } catch (error) {
      console.error('Failed to accept consultation:', error);
      toast.error('परामर्श स्वीकार करने में विफल');
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video Call';
      case 'voice':
        return 'Voice Call';
      case 'chat':
        return 'Chat';
      case 'in_person':
        return 'In Person';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'voice':
        return Mic;
      case 'chat':
        return MessageSquare;
      case 'in_person':
        return UserIcon;
      default:
        return MessageSquare;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">परामर्श</h1>
          <p className="text-muted-foreground">अपने रोगी परामर्श प्रबंधित करें</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my">मेरे परामर्श ({consultations.length})</TabsTrigger>
            <TabsTrigger value="pending">लंबित अनुरोध ({pendingConsultations.length})</TabsTrigger>
          </TabsList>

          {/* My Consultations */}
          <TabsContent value="my" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 bg-muted" />
                  ))}
                </>
              ) : consultations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">अभी तक कोई परामर्श नहीं</h3>
                    <p className="text-muted-foreground text-center">
                      आपने अभी तक कोई परामर्श स्वीकार नहीं किया है। लंबित अनुरोध टैब देखें।
                    </p>
                  </CardContent>
                </Card>
              ) : (
                consultations.map((consultation) => (
                  <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              {consultation.patient?.full_name || 'Unknown Patient'}
                            </CardTitle>
                            <Badge className={getStatusColor(consultation.status)}>
                              {consultation.status === 'pending' ? 'Pending' : 
                               consultation.status === 'in_progress' ? 'In Progress' :
                               consultation.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </Badge>
                            <Badge variant="outline" className="capitalize gap-1">
                              {(() => {
                                const TypeIcon = getTypeIcon(consultation.consultation_type);
                                return (
                                  <>
                                    <TypeIcon className="h-3 w-3" />
                                    {getTypeLabel(consultation.consultation_type)}
                                  </>
                                );
                              })()}
                            </Badge>
                          </div>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(consultation.created_at), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Symptoms */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">लक्षण</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{consultation.symptoms}</p>
                      </div>

                      {/* Diagnosis */}
                      {consultation.diagnosis && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">निदान</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{consultation.diagnosis}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link to={`/doctor/consultations/${consultation.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <FileText className="h-4 w-4" />
                            विवरण देखें
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Pending Requests */}
          <TabsContent value="pending" className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 bg-muted" />
                  ))}
                </>
              ) : pendingConsultations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">कोई लंबित अनुरोध नहीं</h3>
                    <p className="text-muted-foreground text-center">
                      इस समय कोई लंबित परामर्श अनुरोध नहीं है।
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingConsultations.map((consultation) => (
                  <Card key={consultation.id} className="hover:shadow-lg transition-shadow border-warning/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              {consultation.patient?.full_name || 'Unknown Patient'}
                            </CardTitle>
                            <Badge className="bg-warning/10 text-warning">New Request</Badge>
                            <Badge variant="outline" className="capitalize gap-1">
                              {(() => {
                                const TypeIcon = getTypeIcon(consultation.consultation_type);
                                return (
                                  <>
                                    <TypeIcon className="h-3 w-3" />
                                    {getTypeLabel(consultation.consultation_type)}
                                  </>
                                );
                              })()}
                            </Badge>
                          </div>
                          <CardDescription className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(consultation.created_at), 'MMM dd, yyyy HH:mm')}</span>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Symptoms */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">लक्षण</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{consultation.symptoms}</p>
                      </div>

                      {/* Medical History */}
                      {consultation.medical_history && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">चिकित्सा इतिहास</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{consultation.medical_history}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => handleAccept(consultation.id)} className="flex-1 gap-2">
                          <CheckCircle className="h-4 w-4" />
                          परामर्श स्वीकार करें
                        </Button>
                        <Link to={`/doctor/consultations/${consultation.id}`}>
                          <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            विवरण देखें
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
