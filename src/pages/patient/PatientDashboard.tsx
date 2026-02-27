import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { consultationApi, prescriptionApi } from '@/db/api';
import type { Consultation, Prescription } from '@/types';
import { Calendar, FileText, MessageSquare, Activity, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [consultationsData, prescriptionsData] = await Promise.all([
        consultationApi.getPatientConsultations(profile!.id, 5),
        prescriptionApi.getPatientPrescriptions(profile!.id, 5),
      ]);
      setConsultations(consultationsData);
      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Consultations',
      value: consultations.length,
      icon: Calendar,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Prescriptions',
      value: prescriptions.length,
      icon: FileText,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Pending Consultations',
      value: consultations.filter((c) => c.status === 'pending').length,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/patient/ai-chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Health Assistant</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Get instant health advice</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/patient/consultations/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Book Consultation</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Schedule with a doctor</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/patient/records">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">View your health history</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Consultations</CardTitle>
                <CardDescription>Your latest medical consultations</CardDescription>
              </div>
              <Link to="/patient/consultations">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 bg-muted" />
                ))}
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No consultations yet</p>
                <Link to="/patient/consultations/new">
                  <Button variant="link" className="mt-2">
                    Book your first consultation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium capitalize">{consultation.consultation_type.replace('_', ' ')}</p>
                        <Badge className={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{consultation.symptoms}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(consultation.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Link to={`/patient/consultations/${consultation.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Prescriptions</CardTitle>
                <CardDescription>Your latest prescriptions</CardDescription>
              </div>
              <Link to="/patient/prescriptions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 bg-muted" />
                ))}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No prescriptions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {prescription.medications.length} Medication{prescription.medications.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dr. {prescription.doctor?.full_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(prescription.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Link to={`/patient/prescriptions/${prescription.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
