import { useState, useRef, useCallback } from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X, Check, RotateCcw, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onPhotoCapture: (photoUrl: string, photoData?: any) => void;
  photoType?: "Front" | "Side" | "Back" | "Meal" | "Progress";
  triggerText?: string;
  category?: 'progress' | 'meal' | 'general';
}

export function CameraCapture({ 
  onPhotoCapture, 
  photoType = "Front", 
  triggerText = "Take Photo",
  category = 'general'
}: CameraCaptureProps) {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoMetadata, setPhotoMetadata] = useState({
    title: '',
    notes: '',
    category: category
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: photoType === "Front" ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions or use file upload.");
    }
  }, [photoType]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    setIsCapturing(true);
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob and create URL for preview
    canvas.toBlob((blob) => {
      if (blob) {
        const photoUrl = URL.createObjectURL(blob);
        setCapturedPhoto(photoUrl);
        stopCamera();
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.8);
  }, [stopCamera]);

  const uploadPhotoToFirebase = async (file: File | Blob, fileName: string) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const storageRef = ref(storage, `photos/${currentUser.uid}/${category}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  };

  const saveToFirestore = async (photoUrl: string) => {
    if (!currentUser) return;

    const photoData = {
      url: photoUrl,
      title: photoMetadata.title || `${photoType} ${category} photo`,
      notes: photoMetadata.notes,
      category: category,
      photoType: photoType,
      userId: currentUser.uid,
      createdAt: new Date(),
      metadata: {
        type: category,
        photoType: photoType,
        timestamp: Date.now()
      }
    };

    const docRef = await addDoc(collection(db, 'photos'), photoData);
    return { id: docRef.id, ...photoData };
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) {
      if (!currentUser) {
        toast.error("Please log in to upload photos");
      }
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `${category}_${photoType}_${Date.now()}_${file.name}`;
      const downloadURL = await uploadPhotoToFirebase(file, fileName);
      
      const savedData = await saveToFirestore(downloadURL);
      
      onPhotoCapture(downloadURL, savedData);
      toast.success(`${photoType} photo uploaded successfully! 📸`);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onPhotoCapture, photoType, category, currentUser]);

  const confirmPhoto = useCallback(async () => {
    if (!capturedPhoto || !canvasRef.current || !currentUser) {
      if (!currentUser) {
        toast.error("Please log in to save photos");
      }
      return;
    }

    setIsUploading(true);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.8);
      });

      const fileName = `${category}_${photoType}_${Date.now()}.jpg`;
      const downloadURL = await uploadPhotoToFirebase(blob, fileName);
      
      const savedData = await saveToFirestore(downloadURL);
      
      onPhotoCapture(downloadURL, savedData);
      toast.success(`${photoType} photo saved successfully! 📸`);
      setIsOpen(false);
      setCapturedPhoto(null);
      setPhotoMetadata({ title: '', notes: '', category: category });
      
    } catch (error) {
      console.error('Error saving photo:', error);
      toast.error('Failed to save photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [capturedPhoto, onPhotoCapture, photoType, category, currentUser, photoMetadata]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedPhoto(null);
    setPhotoMetadata({ title: '', notes: '', category: category });
    setIsOpen(false);
  }, [stopCamera, category]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => setIsOpen(true)}
          >
            <Camera className="h-4 w-4 mr-2" />
            {triggerText}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Capture {photoType} {category === 'meal' ? 'Meal' : 'Progress'} Photo
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {!capturedPhoto ? (
              <>
                {/* Camera View */}
                <Card className="border-dashed border-2 border-muted">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] bg-muted/20 rounded-lg overflow-hidden relative">
                      {stream ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-4">Camera not started</p>
                            <Button onClick={startCamera} className="bg-primary hover:bg-primary/90">
                              Start Camera
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Camera overlay guidelines */}
                      {stream && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="w-full h-full border-2 border-primary/30 rounded-lg">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-primary rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Camera Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {stream && (
                    <Button
                      onClick={capturePhoto}
                      disabled={isCapturing || isUploading}
                      className="flex-1 bg-primary hover:bg-primary/90 text-background py-3"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isCapturing ? "Capturing..." : "Take Photo"}
                    </Button>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1 sm:flex-none"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={isUploading}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Photo Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Photo Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] bg-muted/20 rounded-lg overflow-hidden">
                      <img
                        src={capturedPhoto}
                        alt={`${photoType} ${category} photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Photo Metadata */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="photo-title">Photo Title</Label>
                      <Input
                        id="photo-title"
                        placeholder={`${photoType} ${category === 'progress' ? 'Progress Update' : category === 'meal' ? 'Meal Description' : 'Photo'}`}
                        value={photoMetadata.title}
                        onChange={(e) => setPhotoMetadata(prev => ({ ...prev, title: e.target.value }))}
                        disabled={isUploading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="photo-notes">Notes (optional)</Label>
                      <Input
                        id="photo-notes"
                        placeholder="Add any notes..."
                        value={photoMetadata.notes}
                        onChange={(e) => setPhotoMetadata(prev => ({ ...prev, notes: e.target.value }))}
                        disabled={isUploading}
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Confirmation Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={confirmPhoto}
                    disabled={isUploading}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-background py-3"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving to Cloud...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Save to Cloud
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={retakePhoto}
                      disabled={isUploading}
                      className="flex-1 sm:flex-none"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      disabled={isUploading}
                      className="flex-1 sm:flex-none"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Hidden canvas for photo processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}