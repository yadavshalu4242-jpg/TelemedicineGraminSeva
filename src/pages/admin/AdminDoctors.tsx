import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { profileApi } from '@/db/api';
import type { Profile } from '@/types';
import { UserCog, Trash2, Edit2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getAllProfiles('doctor');
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      setDoctors(doctors.filter((d) => d.id !== doctorId));
      toast.success('Doctor deleted successfully');
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      toast.error('Failed to delete doctor');
    }
  };

  const handleApproveDoctor = async (doctorId: string) => {
    try {
      const updated = await profileApi.updateProfile(doctorId, { approved: true });
      setDoctors(doctors.map((d) => (d.id === doctorId ? updated : d)));
      toast.success('Doctor approved');
    } catch (error) {
      console.error('Failed to approve doctor:', error);
      toast.error('Unable to approve doctor');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserCog className="h-8 w-8" />
              Doctor Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage all healthcare providers in the system</p>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Doctors</CardTitle>
            <CardDescription>Total: {filteredDoctors.length} doctors</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 bg-muted" />
                ))}
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <UserCog className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No doctors found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.full_name || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{doctor.email || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{doctor.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                        <TableCell>
                          {doctor.approved ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">Yes</Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {doctor.created_at ? new Date(doctor.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {!doctor.approved && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveDoctor(doctor.id)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-primary">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this doctor? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex justify-end gap-2">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDoctor(doctor.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
