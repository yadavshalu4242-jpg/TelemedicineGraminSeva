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
import type { Consultation } from '@/types';
import { Calendar, FileText, Users, Activity, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function DoctorDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allConsultations, pending] = await Promise.all([
        consultationApi.getDoctorConsultations(profile!.id, undefined, 10),
        consultationApi.getPendingConsultations(10),
      ]);
      setConsultations(allConsultations);
      setPendingConsultations(pending);
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
      title: 'Pending Requests',
      value: pendingConsultations.length,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Active Cases',
      value: consultations.filter((c) => c.status === 'in_progress').length,
      icon: Activity,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
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

  const handleAcceptConsultation = async (consultationId: string) => {
    try {
      await consultationApi.assignDoctor(consultationId, profile!.id);
      loadData();
    } catch (error) {
      console.error('Failed to accept consultation:', error);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
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

        {/* Pending Consultation Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Consultation Requests</CardTitle>
            <CardDescription>New patients waiting for consultation</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 bg-muted" />
                ))}
              </div>
            ) : pendingConsultations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{consultation.patient?.full_name || 'Unknown Patient'}</p>
                        <Badge className="capitalize">{consultation.consultation_type.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{consultation.symptoms}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(consultation.created_at), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleAcceptConsultation(consultation.id)}>
                        Accept
                      </Button>
                      <Link to={`/doctor/consultations/${consultation.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Consultations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Consultations</CardTitle>
                <CardDescription>Your assigned consultations</CardDescription>
              </div>
              <Link to="/doctor/consultations">
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
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.slice(0, 5).map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{consultation.patient?.full_name || 'Unknown Patient'}</p>
                        <Badge className={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{consultation.symptoms}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(consultation.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Link to={`/doctor/consultations/${consultation.id}`}>
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
