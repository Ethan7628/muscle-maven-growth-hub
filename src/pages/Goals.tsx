
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Trophy, Calendar, Plus, Flame, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Gain 2kg Lean Mass",
      type: "Weight",
      target: 2,
      current: 1.4,
      unit: "kg",
      deadline: "2024-03-01",
      status: "On Track",
      priority: "High"
    },
    {
      id: 2,
      title: "Bench Press 180lbs",
      type: "Strength",
      target: 180,
      current: 160,
      unit: "lbs",
      deadline: "2024-02-15",
      status: "On Track",
      priority: "High"
    },
    {
      id: 3,
      title: "40cm Biceps",
      type: "Measurement",
      target: 40,
      current: 36.5,
      unit: "cm",
      deadline: "2024-04-01",
      status: "Behind",
      priority: "Medium"
    },
    {
      id: 4,
      title: "6-Week Consistency",
      type: "Habit",
      target: 42,
      current: 35,
      unit: "workouts",
      deadline: "2024-01-20",
      status: "Ahead",
      priority: "High"
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "",
    target: "",
    unit: "",
    deadline: "",
    priority: "Medium"
  });

  const addGoal = () => {
    if (!newGoal.title || !newGoal.type || !newGoal.target || !newGoal.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const goal = {
      id: Date.now(),
      title: newGoal.title,
      type: newGoal.type,
      target: parseFloat(newGoal.target),
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      status: "Not Started",
      priority: newGoal.priority
    };

    setGoals(prev => [goal, ...prev]);
    setNewGoal({ title: "", type: "", target: "", unit: "", deadline: "", priority: "Medium" });
    toast.success("New goal created! 🎯");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Ahead": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Behind": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Not Started": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const achievements = [
    {
      title: "First 100 Workouts",
      description: "Completed your first 100 workout sessions",
      date: "2023-12-15",
      icon: "🏆"
    },
    {
      title: "Consistency King",
      description: "30 days without missing a workout",
      date: "2023-12-01",
      icon: "🔥"
    },
    {
      title: "Strength Milestone",
      description: "Deadlifted 2x your body weight",
      date: "2023-11-20",
      icon: "💪"
    },
    {
      title: "Progress Photo Pro", 
      description: "Uploaded 50 progress photos",
      date: "2023-11-10",
      icon: "📸"
    }
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Goals & Achievements
          </h1>
          <p className="text-muted-foreground mt-2">
            Set targets, track progress, and celebrate victories
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-background">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{goals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">total goals</p>
          </CardContent>
        </Card>

        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Track</CardTitle>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">
              {goals.filter(g => g.status === "On Track" || g.status === "Ahead").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">goals progressing</p>
          </CardContent>
        </Card>

        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
              <Trophy className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{achievements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">unlocked</p>
          </CardContent>
        </Card>

        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <Flame className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground mt-1">goal completion</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Active Goals
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Create Goal
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.current, goal.target);
              const daysLeft = getDaysRemaining(goal.deadline);
              
              return (
                <Card key={goal.id} className="glass-effect border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="outline" className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Progress</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={`font-medium ${daysLeft < 7 ? 'text-red-400' : 'text-muted-foreground'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-muted/20">
                      <p className="text-xs text-muted-foreground">
                        <strong>Goal Type:</strong> {goal.type}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-secondary" />
                Create New Goal
              </CardTitle>
              <p className="text-muted-foreground">
                Set a specific, measurable target to track your progress
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g. Bench Press 200lbs"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="goal-type">Goal Type</Label>
                  <Select value={newGoal.type} onValueChange={(value) => setNewGoal(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Weight">Weight</SelectItem>
                      <SelectItem value="Measurement">Measurement</SelectItem>
                      <SelectItem value="Habit">Habit</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="target-value">Target Value</Label>
                  <Input
                    id="target-value"
                    type="number"
                    placeholder="200"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="lbs, kg, cm, days"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="deadline">Target Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>

              <Button onClick={addGoal} className="w-full bg-secondary hover:bg-secondary/90 text-background">
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="glass-effect border-0">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{achievement.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Unlocked {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Achievement Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl mb-2">🏃‍♂️</div>
                  <div className="text-lg font-semibold">Marathon Lifter</div>
                  <div className="text-sm text-muted-foreground">Complete 500 workouts</div>
                  <Progress value={35} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">175/500</div>
                </div>

                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-lg font-semibold">Power Lifter</div>
                  <div className="text-sm text-muted-foreground">Deadlift 3x body weight</div>
                  <Progress value={67} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">200/300 lbs</div>
                </div>

                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-lg font-semibold">Growth Master</div>
                  <div className="text-sm text-muted-foreground">5cm total muscle growth</div>
                  <Progress value={48} className="mt-2" />
                  <div className="text-xs text-muted-foreground mt-1">2.4/5.0 cm</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;
