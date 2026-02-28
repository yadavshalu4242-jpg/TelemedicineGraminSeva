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
import { Calendar, Clock, User, Plus, FileText, Video, Mic, MessageSquare, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ConsultationsPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    if (profile?.id) {
      loadConsultations();
    }
  }, [profile?.id]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const data = await consultationApi.getPatientConsultations(profile!.id);
      setConsultations(data);
    } catch (error) {
      console.error('Failed to load consultations:', error);
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
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
        return t('consultation.type.video');
      case 'voice':
        return t('consultation.type.voice');
      case 'chat':
        return t('consultation.type.chat');
      case 'in_person':
        return t('consultation.type.inPerson');
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

  const filteredConsultations = consultations.filter((c) => {
    if (activeTab === 'all') return true;
    return c.status === activeTab;
  });

  const counts = {
    all: consultations.length,
    pending: consultations.filter((c) => c.status === 'pending').length,
    in_progress: consultations.filter((c) => c.status === 'in_progress').length,
    completed: consultations.filter((c) => c.status === 'completed').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('nav.consultations')}</h1>
            <p className="text-muted-foreground">{t('consultation.manage')}</p>
          </div>
          <Link to="/patient/consultations/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('consultation.book')}
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">{t('consultation.all')} ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">{t('consultation.pending')} ({counts.pending})</TabsTrigger>
            <TabsTrigger value="in_progress">{t('consultation.inProgress')} ({counts.in_progress})</TabsTrigger>
            <TabsTrigger value="completed">{t('consultation.completed')} ({counts.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 bg-muted" />
                  ))}
                </>
              ) : filteredConsultations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('consultation.notFound')}</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {activeTab === 'all'
                        ? t('consultation.notFoundDesc')
                        : activeTab === 'pending' ? t('consultation.noPending') : activeTab === 'in_progress' ? t('consultation.noInProgress') : t('consultation.noCompleted')}
                    </p>
                    <Link to="/patient/consultations/new">
                      <Button>{t('consultation.bookFirst')}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                filteredConsultations.map((consultation) => (
                  <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">
                              Consultation #{consultation.id.slice(0, 8)}
                            </CardTitle>
                            <Badge className={getStatusColor(consultation.status)}>
                              {consultation.status === 'pending' ? t('consultation.status.pending') :
                                consultation.status === 'in_progress' ? t('consultation.status.inProgress') :
                                  consultation.status === 'completed' ? t('consultation.status.completed') : t('consultation.status.cancelled')}
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
                            {consultation.doctor ? (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Dr. {consultation.doctor.full_name}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-warning">
                                <Clock className="h-4 w-4" />
                                <span>Waiting for doctor assignment</span>
                              </div>
                            )}
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
                        <h4 className="text-sm font-semibold mb-2">{t('consultation.symptoms')}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{consultation.symptoms}</p>
                      </div>

                      {/* Diagnosis */}
                      {consultation.diagnosis && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">{t('consultation.diagnosis')}</h4>
                          <p className="text-sm text-muted-foreground">{consultation.diagnosis}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link to={`/patient/consultations/${consultation.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <FileText className="h-4 w-4" />
                            {t('consultation.viewDetails')}
                          </Button>
                        </Link>
                        {consultation.status === 'pending' && (
                          <Button
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={async () => {
                              if (confirm(t('consultation.cancelConfirm'))) {
                                try {
                                  await consultationApi.updateConsultation(consultation.id, {
                                    status: 'cancelled',
                                  });
                                  toast.success(t('consultation.cancelSuccess'));
                                  loadConsultations();
                                } catch (error) {
                                  toast.error(t('consultation.cancelError'));
                                }
                              }
                            }}
                          >
                            {t('common.cancel')}
                          </Button>
                        )}
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
