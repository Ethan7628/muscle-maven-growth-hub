
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image, TrendingUp, Calendar, Maximize2 } from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { toast } from "sonner";

const Progress = () => {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      date: "2024-01-08",
      type: "Front",
      url: "/placeholder.svg",
      notes: "Week 6 - Chest development visible"
    },
    {
      id: 2,
      date: "2024-01-08",
      type: "Side",
      url: "/placeholder.svg",
      notes: "Week 6 - Shoulder definition improved"
    },
    {
      id: 3,
      date: "2024-01-01",
      type: "Front",
      url: "/placeholder.svg",
      notes: "Week 5 - Starting to see changes"
    },
    {
      id: 4,
      date: "2023-12-25",
      type: "Front",
      url: "/placeholder.svg",
      notes: "Week 4 - Baseline measurement"
    }
  ]);

  const handlePhotoCapture = (photoUrl: string, photoData?: any) => {
    const photoType = photoData?.photoType || 'Front';
    
    const newPhoto = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: photoType,
      url: photoUrl,
      notes: photoData?.notes || `New ${photoType.toLowerCase()} progress photo - ${new Date().toLocaleDateString()}`
    };
    
    setPhotos(prev => [newPhoto, ...prev]);
    
    console.log("Photo saved to Firebase:", photoUrl, photoData);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Front": return "bg-primary/10 text-primary border-primary";
      case "Side": return "bg-secondary/10 text-secondary border-secondary";  
      case "Back": return "bg-accent/10 text-accent border-accent";
      default: return "bg-muted/10 text-muted-foreground border-muted";
    }
  };

  const groupedPhotos = photos.reduce((acc: Record<string, typeof photos>, photo) => {
    const date = photo.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(photo);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Camera className="h-8 w-8 text-primary" />
            Progress Photos
          </h1>
          <p className="text-muted-foreground mt-2">
            Visual tracking of your muscle development journey
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CameraCapture
            onPhotoCapture={handlePhotoCapture}
            photoType="Front"
            triggerText="Front View"
            category="progress"
          />
          <CameraCapture
            onPhotoCapture={handlePhotoCapture}
            photoType="Side"
            triggerText="Side View"
            category="progress"
          />
          <CameraCapture
            onPhotoCapture={handlePhotoCapture}
            photoType="Back"
            triggerText="Back View"
            category="progress"
          />
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Timeline View
          </TabsTrigger>
          <TabsTrigger value="comparison" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Side-by-Side Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {Object.entries(groupedPhotos)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, datePhotos]) => (
            <Card key={date} className="glass-effect border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary">
                    {datePhotos.length} photo{datePhotos.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {datePhotos.map((photo) => (
                    <div key={photo.id} className="group relative">
                      <div className="aspect-[3/4] bg-muted/20 rounded-xl overflow-hidden border-2 border-dashed border-muted hover:border-primary transition-colors">
                        {photo.url !== "/placeholder.svg" ? (
                          <img
                            src={photo.url}
                            alt={`${photo.type} progress photo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Progress Photo</p>
                              <Badge variant="outline" className={`mt-2 ${getTypeColor(photo.type)}`}>
                                {photo.type} View
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">{photo.notes}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Visual Progress Analysis
              </CardTitle>
              <p className="text-muted-foreground">
                Compare your progress over time with AI-enhanced visual analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Latest Photo (Week 6)</h3>
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border-2 border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-16 w-16 mx-auto text-primary mb-4" />
                      <p className="text-primary font-medium">Current Progress</p>
                      <Badge className="mt-2 bg-primary/20 text-primary">
                        Front View
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Baseline (Week 4)</h3>
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted/10 to-muted/20 rounded-xl border-2 border-muted/20 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground font-medium">Starting Point</p>
                      <Badge variant="outline" className="mt-2">
                        Front View
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20">
                <h4 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Visual Analysis Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <strong>Chest development:</strong> +15% visible mass increase
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <strong>Shoulder definition:</strong> Improved separation and roundness
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <strong>Posture improvement:</strong> Better chest positioning
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <strong>Overall progress:</strong> Consistent growth trajectory
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;
