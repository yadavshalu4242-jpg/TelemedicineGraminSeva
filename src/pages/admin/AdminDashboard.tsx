import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { profileApi } from '@/db/api';
import type { Profile } from '@/types';
import { Users, UserCog, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getAllProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Users',
      value: profiles.length,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Patients',
      value: profiles.filter((p) => p.role === 'patient').length,
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Doctors',
      value: profiles.filter((p) => p.role === 'doctor').length,
      icon: UserCog,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Admins',
      value: profiles.filter((p) => p.role === 'admin').length,
      icon: Activity,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Platform statistics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 bg-muted" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">User Growth</p>
                    <p className="text-sm text-muted-foreground">Total registered users</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <span className="text-2xl font-bold">{profiles.length}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Active Healthcare Providers</p>
                    <p className="text-sm text-muted-foreground">Doctors available for consultation</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{profiles.filter((p) => p.role === 'doctor').length}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <p className="font-medium">Patient Base</p>
                    <p className="text-sm text-muted-foreground">Registered patients</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    <span className="text-2xl font-bold">{profiles.filter((p) => p.role === 'patient').length}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View and manage all system users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Doctor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage healthcare providers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure platform settings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
