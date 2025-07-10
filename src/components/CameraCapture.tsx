import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Upload, X, Check, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onPhotoCapture: (photoBlob: Blob, photoType: string) => void;
  photoType?: "Front" | "Side" | "Back";
  triggerText?: string;
}

export function CameraCapture({ 
  onPhotoCapture, 
  photoType = "Front", 
  triggerText = "Take Photo" 
}: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
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
    
    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const photoUrl = URL.createObjectURL(blob);
        setCapturedPhoto(photoUrl);
        stopCamera();
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.8);
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const photoUrl = URL.createObjectURL(file);
      setCapturedPhoto(photoUrl);
      
      // Convert file to blob for consistency
      onPhotoCapture(file, photoType);
      toast.success(`${photoType} progress photo uploaded! 📸`);
    } else {
      toast.error("Please select a valid image file");
    }
  }, [onPhotoCapture, photoType]);

  const confirmPhoto = useCallback(() => {
    if (!capturedPhoto || !canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        onPhotoCapture(blob, photoType);
        toast.success(`${photoType} progress photo saved! 📸`);
        setIsOpen(false);
        setCapturedPhoto(null);
      }
    }, 'image/jpeg', 0.8);
  }, [capturedPhoto, onPhotoCapture, photoType]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedPhoto(null);
    setIsOpen(false);
  }, [stopCamera]);

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
              Capture {photoType} Progress Photo
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
                      disabled={isCapturing}
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
                      className="flex-1 sm:flex-none"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleClose}
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
                        alt={`${photoType} progress photo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Photo Confirmation Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={confirmPhoto}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-background py-3"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save Photo
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={retakePhoto}
                      className="flex-1 sm:flex-none"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Retake
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleClose}
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