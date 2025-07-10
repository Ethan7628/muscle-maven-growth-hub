
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Dumbbell, Clock, TrendingUp, Zap } from "lucide-react";
import { toast } from "sonner";

const Workouts = () => {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      date: "2024-01-08",
      exercises: [
        { name: "Bench Press", sets: 4, reps: 8, weight: 160, duration: 12 },
        { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 50, duration: 10 },
        { name: "Chest Flies", sets: 3, reps: 12, weight: 30, duration: 8 }
      ],
      soreness: "None",
      totalDuration: 45
    },
    {
      id: 2,
      date: "2024-01-06",
      exercises: [
        { name: "Deadlift", sets: 4, reps: 6, weight: 200, duration: 15 },
        { name: "Pull-ups", sets: 3, reps: 8, weight: 0, duration: 8 },
        { name: "Barbell Rows", sets: 4, reps: 8, weight: 120, duration: 12 }
      ],
      soreness: "Slight",
      totalDuration: 50
    }
  ]);

  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    duration: ""
  });

  const [currentWorkout, setCurrentWorkout] = useState({
    exercises: [],
    soreness: "None",
    date: new Date().toISOString().split('T')[0]
  });

  const addExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) {
      toast.error("Please fill in exercise name, sets, and reps");
      return;
    }

    const exercise = {
      name: newExercise.name,
      sets: parseInt(newExercise.sets),
      reps: parseInt(newExercise.reps),
      weight: parseInt(newExercise.weight) || 0,
      duration: parseInt(newExercise.duration) || 0
    };

    setCurrentWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));

    setNewExercise({ name: "", sets: "", reps: "", weight: "", duration: "" });
    toast.success("Exercise added to workout!");
  };

  const saveWorkout = () => {
    if (currentWorkout.exercises.length === 0) {
      toast.error("Add at least one exercise to save workout");
      return;
    }

    const totalDuration = currentWorkout.exercises.reduce((sum, ex) => sum + ex.duration, 0);
    
    const workout = {
      id: Date.now(),
      date: currentWorkout.date,
      exercises: currentWorkout.exercises,
      soreness: currentWorkout.soreness,
      totalDuration
    };

    setWorkouts(prev => [workout, ...prev]);
    setCurrentWorkout({ exercises: [], soreness: "None", date: new Date().toISOString().split('T')[0] });
    toast.success("Workout saved successfully! 💪");
  };

  const getSorenessColor = (soreness) => {
    switch (soreness) {
      case "None": return "border-green-500 text-green-400 bg-green-500/10";
      case "Slight": return "border-yellow-500 text-yellow-400 bg-yellow-500/10";
      case "Noticeable": return "border-red-500 text-red-400 bg-red-500/10";
      default: return "border-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-primary" />
            Workout Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your exercises and analyze progressive overload patterns
          </p>
        </div>
      </div>

      <Tabs defaultValue="log" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/20">
          <TabsTrigger value="log" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Log Workout
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Workout History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-secondary" />
                New Exercise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    placeholder="e.g. Bench Press"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    placeholder="4"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder="8"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="160"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="12"
                    value={newExercise.duration}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={addExercise} className="w-full bg-secondary hover:bg-secondary/90 text-background">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </CardContent>
          </Card>

          {currentWorkout.exercises.length > 0 && (
            <Card className="glass-effect border-0">
              <CardHeader>
                <CardTitle>Current Workout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                          {exercise.duration} min
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex-1">
                    <Label htmlFor="soreness">Soreness Check-in</Label>
                    <Select value={currentWorkout.soreness} onValueChange={(value) => setCurrentWorkout(prev => ({ ...prev, soreness: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Slight">Slight</SelectItem>
                        <SelectItem value="Noticeable">Noticeable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={saveWorkout} className="bg-primary hover:bg-primary/90 text-background mt-6">
                    <Zap className="h-4 w-4 mr-2" />
                    Save Workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {workouts.map((workout) => (
            <Card key={workout.id} className="glass-effect border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {new Date(workout.date).toLocaleDateString()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                      {workout.totalDuration} min
                    </Badge>
                    <Badge variant="outline" className={getSorenessColor(workout.soreness)}>
                      {workout.soreness}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/5 rounded-lg">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-medium">{exercise.duration} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workouts;
