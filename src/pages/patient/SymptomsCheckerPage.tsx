import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { symptomsApi } from '@/db/api';
import type { Symptom } from '@/types';
import { Search, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SymptomsCheckerPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, [language]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = symptoms.filter((symptom) =>
        symptom.symptom_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSymptoms(filtered);
    } else {
      setFilteredSymptoms(symptoms);
    }
  }, [searchQuery, symptoms]);

  const loadSymptoms = async () => {
    try {
      setLoading(true);
      const data = await symptomsApi.getAllSymptoms(language);
      setSymptoms(data);
      setFilteredSymptoms(data);
    } catch (error) {
      console.error('Failed to load symptoms:', error);
      toast.error('Failed to load symptoms database');
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom: Symptom) => {
    const isSelected = selectedSymptoms.find((s) => s.id === symptom.id);
    if (isSelected) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptom.id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }
    setShowResults(true);
  };

  const clearSelection = () => {
    setSelectedSymptoms([]);
    setShowResults(false);
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'low':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <XCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getOverallSeverity = () => {
    if (selectedSymptoms.some((s) => s.severity?.toLowerCase() === 'high')) {
      return 'high';
    }
    if (selectedSymptoms.some((s) => s.severity?.toLowerCase() === 'medium')) {
      return 'medium';
    }
    return 'low';
  };

  const getAllRelatedConditions = () => {
    const conditions = new Set<string>();
    selectedSymptoms.forEach((symptom) => {
      symptom.related_conditions.forEach((condition) => conditions.add(condition));
    });
    return Array.from(conditions);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('symptom.checker')}</h1>
          <p className="text-muted-foreground">
            Select your symptoms to get health recommendations. This tool works offline.
          </p>
        </div>

        {/* Search and Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom Search */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Search Symptoms</CardTitle>
                <CardDescription>Find and select symptoms you are experiencing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('symptom.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-20 bg-muted" />
                      ))}
                    </div>
                  ) : filteredSymptoms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No symptoms found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredSymptoms.map((symptom) => {
                        const isSelected = selectedSymptoms.find((s) => s.id === symptom.id);
                        return (
                          <div
                            key={symptom.id}
                            onClick={() => toggleSymptom(symptom)}
                            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-accent'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{symptom.symptom_name}</h4>
                                  {symptom.severity && (
                                    <Badge className={getSeverityColor(symptom.severity)}>
                                      <span className="flex items-center gap-1">
                                        {getSeverityIcon(symptom.severity)}
                                        {symptom.severity}
                                      </span>
                                    </Badge>
                                  )}
                                </div>
                                {symptom.category && (
                                  <p className="text-sm text-muted-foreground">{symptom.category}</p>
                                )}
                              </div>
                              {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Selected Symptoms */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Selected Symptoms</CardTitle>
                <CardDescription>{selectedSymptoms.length} symptom(s) selected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[300px]">
                  {selectedSymptoms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No symptoms selected</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSymptoms.map((symptom) => (
                        <div key={symptom.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                          <span className="text-sm font-medium">{symptom.symptom_name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSymptom(symptom)}
                            className="h-6 w-6 p-0"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="space-y-2">
                  <Button onClick={analyzeSymptoms} className="w-full" disabled={selectedSymptoms.length === 0}>
                    Analyze Symptoms
                  </Button>
                  {selectedSymptoms.length > 0 && (
                    <Button onClick={clearSelection} variant="outline" className="w-full">
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analysis Results */}
        {showResults && selectedSymptoms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Based on your selected symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Severity */}
              <Alert className={getSeverityColor(getOverallSeverity())}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-semibold">
                  Overall Severity: {getOverallSeverity().toUpperCase()}
                </AlertTitle>
                <AlertDescription>
                  {getOverallSeverity() === 'high' &&
                    '⚠️ High severity symptoms detected. Please seek immediate medical attention.'}
                  {getOverallSeverity() === 'medium' &&
                    '⚠️ Medium severity symptoms. Consider consulting a doctor soon.'}
                  {getOverallSeverity() === 'low' &&
                    '✓ Low severity symptoms. Monitor your condition and consult if symptoms persist.'}
                </AlertDescription>
              </Alert>

              {/* Possible Conditions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Possible Related Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {getAllRelatedConditions().map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                <div className="space-y-3">
                  {selectedSymptoms.map((symptom) => (
                    <div key={symptom.id} className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">{symptom.symptom_name}</h4>
                      <p className="text-sm text-muted-foreground">{symptom.recommendations}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  This symptom checker is for informational purposes only and does not constitute medical advice.
                  Always consult with a qualified healthcare professional for proper diagnosis and treatment. In case
                  of emergency, call emergency services immediately.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
