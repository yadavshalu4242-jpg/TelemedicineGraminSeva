import { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Video, Square, RefreshCw, Save, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { storageApi, medicalRecordApi } from '@/db/api';

export default function ARDiagnosisPage() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup: stop camera when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setCameraActive(true);
      toast.success('Camera started successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      toast.success('Camera stopped');
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add AR overlay (example: grid lines for measurement)
    context.strokeStyle = 'rgba(37, 99, 235, 0.5)';
    context.lineWidth = 2;

    // Draw grid
    const gridSize = 50;
    for (let x = 0; x < canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    // Draw center crosshair
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    context.strokeStyle = 'rgba(37, 99, 235, 0.8)';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(centerX - 30, centerY);
    context.lineTo(centerX + 30, centerY);
    context.moveTo(centerX, centerY - 30);
    context.lineTo(centerX, centerY + 30);
    context.stroke();

    // Convert to data URL
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    toast.success('Image captured successfully');
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setNotes('');
  };

  const saveRecord = async () => {
    if (!capturedImage || !profile) {
      toast.error('Please capture an image first');
      return;
    }

    setSaving(true);

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `ar_diagnosis_${Date.now()}.jpg`, { type: 'image/jpeg' });

      // Upload to storage
      const { url } = await storageApi.uploadMedicalImage(file, profile.id);

      // Save medical record
      await medicalRecordApi.createRecord({
        patient_id: profile.id,
        record_type: 'image',
        title: 'AR Diagnosis Capture',
        description: notes || 'AR-assisted diagnostic image',
        file_url: url,
        metadata: {
          capture_type: 'ar_diagnosis',
          timestamp: new Date().toISOString(),
        },
      });

      toast.success('AR diagnosis record saved successfully');
      retakeImage();
      stopCamera();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Failed to save record. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">AR Diagnosis</h1>
          <p className="text-muted-foreground">
            Use augmented reality tools to capture and analyze medical images with visual guides
          </p>
        </div>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>How to Use AR Diagnosis</AlertTitle>
          <AlertDescription>
            1. Start the camera to activate AR view
            <br />
            2. Position the area to be examined within the AR guides
            <br />
            3. Capture the image when properly aligned
            <br />
            4. Add notes and save to your medical records
          </AlertDescription>
        </Alert>

        {/* Camera Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Camera Controls</CardTitle>
            <CardDescription>Activate camera to start AR diagnosis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {!cameraActive ? (
                <Button onClick={startCamera} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button onClick={stopCamera} variant="destructive" className="gap-2">
                    <Square className="h-4 w-4" />
                    Stop Camera
                  </Button>
                  {!capturedImage && (
                    <Button onClick={captureImage} className="gap-2">
                      <Camera className="h-4 w-4" />
                      Capture Image
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Camera Status */}
            <div className="flex items-center gap-2">
              <Badge variant={cameraActive ? 'default' : 'secondary'}>
                {cameraActive ? '● Camera Active' : '○ Camera Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AR View */}
        <Card>
          <CardHeader>
            <CardTitle>AR View</CardTitle>
            <CardDescription>
              {capturedImage ? 'Captured image with AR overlay' : 'Live camera feed with AR guides'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    style={{ display: cameraActive ? 'block' : 'none' }}
                  />
                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Camera not active</p>
                        <p className="text-sm text-muted-foreground">Click "Start Camera" to begin</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
              )}

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* AR Overlay Instructions */}
              {cameraActive && !capturedImage && (
                <div className="absolute top-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-lg">
                  <p className="text-sm font-medium">AR Guides Active</p>
                  <p className="text-xs opacity-90">Align the subject with the center crosshair</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Captured Image Actions */}
        {capturedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Save Diagnosis Record</CardTitle>
              <CardDescription>Add notes and save to your medical records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any observations or notes about this image..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveRecord} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Record'}
                </Button>
                <Button onClick={retakeImage} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retake
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Medical Disclaimer</AlertTitle>
          <AlertDescription>
            AR diagnosis is a visual aid tool only. Images captured should be reviewed by qualified healthcare
            professionals. This tool does not provide medical diagnosis or treatment recommendations.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
}
