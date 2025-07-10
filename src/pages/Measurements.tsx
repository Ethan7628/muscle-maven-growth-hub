
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, TrendingUp, Target, Plus, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts";
import { toast } from "sonner";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([
    { date: "2024-01-08", biceps: 36.5, chest: 102.3, waist: 81.2, thighs: 58.7, shoulders: 118.5 },
    { date: "2024-01-01", biceps: 36.2, chest: 101.8, waist: 81.5, thighs: 58.4, shoulders: 118.1 },
    { date: "2023-12-25", biceps: 35.8, chest: 101.2, waist: 82.1, thighs: 58.0, shoulders: 117.8 },
    { date: "2023-12-18", biceps: 35.5, chest: 100.8, waist: 82.4, thighs: 57.8, shoulders: 117.5 },
    { date: "2023-12-11", biceps: 35.2, chest: 100.4, waist: 82.8, thighs: 57.5, shoulders: 117.2 },
    { date: "2023-12-04", biceps: 35.0, chest: 100.0, waist: 83.0, thighs: 57.2, shoulders: 117.0 }
  ]);

  const [newMeasurement, setNewMeasurement] = useState({
    biceps: "",
    chest: "",
    waist: "",
    thighs: "",
    shoulders: ""
  });

  const [goals, setGoals] = useState({
    biceps: 38.0,
    chest: 105.0,
    waist: 80.0,
    thighs: 60.0,
    shoulders: 120.0
  });

  const latestMeasurement = measurements[0];
  
  const addMeasurement = () => {
    const hasValues = Object.values(newMeasurement).some(value => value !== "");
    
    if (!hasValues) {
      toast.error("Please enter at least one measurement");
      return;
    }

    const measurement = {
      date: new Date().toISOString().split('T')[0],
      biceps: parseFloat(newMeasurement.biceps) || latestMeasurement.biceps,
      chest: parseFloat(newMeasurement.chest) || latestMeasurement.chest,
      waist: parseFloat(newMeasurement.waist) || latestMeasurement.waist,
      thighs: parseFloat(newMeasurement.thighs) || latestMeasurement.thighs,
      shoulders: parseFloat(newMeasurement.shoulders) || latestMeasurement.shoulders
    };

    setMeasurements(prev => [measurement, ...prev]);
    setNewMeasurement({ biceps: "", chest: "", waist: "", thighs: "", shoulders: "" });
    toast.success("Measurements updated! 📏");
  };

  const getProgressData = () => {
    return [
      { 
        name: 'Biceps', 
        current: latestMeasurement.biceps, 
        goal: goals.biceps, 
        progress: (latestMeasurement.biceps / goals.biceps) * 100,
        fill: '#00D4FF'
      },
      { 
        name: 'Chest', 
        current: latestMeasurement.chest, 
        goal: goals.chest, 
        progress: (latestMeasurement.chest / goals.chest) * 100,
        fill: '#39FF14'
      },
      { 
        name: 'Shoulders', 
        current: latestMeasurement.shoulders, 
        goal: goals.shoulders, 
        progress: (latestMeasurement.shoulders / goals.shoulders) * 100,
        fill: '#FF6B35'
      },
      { 
        name: 'Thighs', 
        current: latestMeasurement.thighs, 
        goal: goals.thighs, 
        progress: (latestMeasurement.thighs / goals.thighs) * 100,
        fill: '#8B5CF6'
      }
    ];
  };

  const getGrowthChange = (bodyPart) => {
    if (measurements.length < 2) return 0;
    const current = measurements[0][bodyPart];
    const previous = measurements[1][bodyPart];
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Ruler className="h-8 w-8 text-primary" />
            Body Measurements
          </h1>
          <p className="text-muted-foreground mt-2">
            Track precise measurements and monitor growth progress
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-background">
          <Plus className="h-4 w-4 mr-2" />
          New Measurement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['biceps', 'chest', 'shoulders', 'thighs'].map((bodyPart) => (
          <Card key={bodyPart} className="metric-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground capitalize">
                {bodyPart}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMeasurement[bodyPart]} cm</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="text-sm text-secondary font-medium">
                  +{getGrowthChange(bodyPart)}% this week
                </span>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress to goal</span>
                  <span>{Math.round((latestMeasurement[bodyPart] / goals[bodyPart]) * 100)}%</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((latestMeasurement[bodyPart] / goals[bodyPart]) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="input" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20">
          <TabsTrigger value="input" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Input Measurements
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Progress Charts
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Goal Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-secondary" />
                Update Measurements
              </CardTitle>
              <p className="text-muted-foreground">
                Enter new measurements (leave empty to keep previous values)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.keys(newMeasurement).map((bodyPart) => (
                  <div key={bodyPart}>
                    <Label htmlFor={bodyPart} className="capitalize">
                      {bodyPart} (cm)
                    </Label>
                    <Input
                      id={bodyPart}
                      type="number"
                      step="0.1"
                      placeholder={latestMeasurement[bodyPart].toString()}
                      value={newMeasurement[bodyPart]}
                      onChange={(e) => setNewMeasurement(prev => ({ 
                        ...prev, 
                        [bodyPart]: e.target.value 
                      }))}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={addMeasurement} className="w-full bg-secondary hover:bg-secondary/90 text-background">
                <Plus className="h-4 w-4 mr-2" />
                Save Measurements
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Measurement History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {measurements.slice(0, 5).map((measurement, index) => (
                  <div key={measurement.date} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        {new Date(measurement.date).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Biceps: {measurement.biceps}cm | Chest: {measurement.chest}cm | Shoulders: {measurement.shoulders}cm
                      </p>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-primary/20 text-primary">
                        Latest
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Growth Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={measurements.slice().reverse()}>
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Line 
                      type="monotone" 
                      dataKey="biceps" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      name="Biceps"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="chest" 
                      stroke="hsl(var(--secondary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                      name="Chest"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="shoulders" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                      name="Shoulders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Goal Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={getProgressData()}>
                    <RadialBar 
                      dataKey="progress" 
                      cornerRadius={10} 
                    />
                    <Legend 
                      iconSize={12}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: '20px' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {getProgressData().map((item) => (
                  <div key={item.name} className="text-center p-4 bg-muted/10 rounded-lg">
                    <h4 className="font-medium text-sm text-muted-foreground">{item.name}</h4>
                    <div className="text-lg font-bold mt-1">{item.current} cm</div>
                    <div className="text-xs text-muted-foreground">Goal: {item.goal} cm</div>
                    <Badge 
                      variant="outline" 
                      className="mt-2"
                      style={{ color: item.fill, borderColor: item.fill }}
                    >
                      {item.progress.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Measurements;
