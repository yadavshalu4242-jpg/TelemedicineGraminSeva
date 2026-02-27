import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { medicalRecordApi } from '@/db/api';
import type { MedicalRecord, RecordType } from '@/types';
import { FileText, Image, Video, FileIcon, Calendar, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function MedicalRecordsPage() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<RecordType | 'all'>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    if (profile?.id) {
      loadRecords();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredRecords(records);
    } else {
      setFilteredRecords(records.filter((r) => r.record_type === selectedType));
    }
  }, [selectedType, records]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordApi.getPatientRecords(profile!.id);
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Failed to load medical records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      await medicalRecordApi.deleteRecord(recordId);
      toast.success('Record deleted successfully');
      loadRecords();
    } catch (error) {
      console.error('Failed to delete record:', error);
      toast.error('Failed to delete record');
    }
  };

  const getRecordIcon = (type: RecordType) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'document':
        return <FileIcon className="h-5 w-5" />;
      case 'note':
        return <FileText className="h-5 w-5" />;
    }
  };

  const getRecordColor = (type: RecordType) => {
    switch (type) {
      case 'image':
        return 'text-primary';
      case 'video':
        return 'text-secondary';
      case 'document':
        return 'text-warning';
      case 'note':
        return 'text-success';
    }
  };

  const recordCounts = {
    all: records.length,
    image: records.filter((r) => r.record_type === 'image').length,
    video: records.filter((r) => r.record_type === 'video').length,
    document: records.filter((r) => r.record_type === 'document').length,
    note: records.filter((r) => r.record_type === 'note').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('nav.medicalRecords')}</h1>
            <p className="text-muted-foreground">View and manage your medical records</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as RecordType | 'all')}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({recordCounts.all})
            </TabsTrigger>
            <TabsTrigger value="image">
              <Image className="h-4 w-4 mr-2" />
              Images ({recordCounts.image})
            </TabsTrigger>
            <TabsTrigger value="video">
              <Video className="h-4 w-4 mr-2" />
              Videos ({recordCounts.video})
            </TabsTrigger>
            <TabsTrigger value="document">
              <FileIcon className="h-4 w-4 mr-2" />
              Documents ({recordCounts.document})
            </TabsTrigger>
            <TabsTrigger value="note">
              <FileText className="h-4 w-4 mr-2" />
              Notes ({recordCounts.note})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 bg-muted" />
              ))}
            </>
          ) : filteredRecords.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                <p className="text-muted-foreground text-center">
                  {selectedType === 'all'
                    ? 'You have no medical records yet'
                    : `No ${selectedType} records found`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`${getRecordColor(record.record_type)}`}>
                        {getRecordIcon(record.record_type)}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {record.record_type}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{record.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(record.created_at), 'MMM dd, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview */}
                  {record.file_url && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      {record.record_type === 'image' ? (
                        <img
                          src={record.file_url}
                          alt={record.title}
                          className="w-full h-full object-cover"
                        />
                      ) : record.record_type === 'video' ? (
                        <video
                          src={record.file_url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getRecordIcon(record.record_type)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {record.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{record.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{record.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {record.file_url && (
                            <div className="rounded-lg overflow-hidden bg-muted">
                              {record.record_type === 'image' ? (
                                <img
                                  src={record.file_url}
                                  alt={record.title}
                                  className="w-full"
                                />
                              ) : record.record_type === 'video' ? (
                                <video
                                  src={record.file_url}
                                  className="w-full"
                                  controls
                                />
                              ) : null}
                            </div>
                          )}
                          {record.description && (
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">{record.description}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(record.created_at), 'MMMM dd, yyyy HH:mm')}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
