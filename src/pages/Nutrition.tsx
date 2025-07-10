
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Apple, Camera, Plus, TrendingUp, Target, Utensils } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

const Nutrition = () => {
  const [dailyIntake, setDailyIntake] = useState({
    calories: 2450,
    protein: 165,
    carbs: 280,
    fats: 85
  });

  const [goals] = useState({
    calories: 2800,
    protein: 180,
    carbs: 320,
    fats: 95
  });

  const [meals, setMeals] = useState([
    {
      id: 1,
      name: "Protein Smoothie",
      time: "07:30",
      calories: 380,
      protein: 35,
      carbs: 45,
      fats: 8,
      photo: true
    },
    {
      id: 2,
      name: "Chicken & Rice Bowl",
      time: "12:15",
      calories: 650,
      protein: 45,
      carbs: 78,
      fats: 18,
      photo: true
    },
    {
      id: 3,
      name: "Greek Yogurt + Berries",
      time: "15:30",
      calories: 220,
      protein: 20,
      carbs: 25,
      fats: 6,
      photo: false
    },
    {
      id: 4,
      name: "Salmon & Vegetables",
      time: "19:00",
      calories: 580,
      protein: 42,
      carbs: 35,
      fats: 28,
      photo: true
    }
  ]);

  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  const weeklyData = [
    { day: 'Mon', calories: 2650, protein: 175 },
    { day: 'Tue', calories: 2420, protein: 160 },
    { day: 'Wed', calories: 2780, protein: 185 },
    { day: 'Thu', days: 2550, protein: 170 },
    { day: 'Fri', calories: 2450, protein: 165 },
    { day: 'Sat', calories: 2850, protein: 190 },
    { day: 'Sun', calories: 2720, protein: 180 }
  ];

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) {
      toast.error("Please enter meal name and calories");
      return;
    }

    const meal = {
      id: Date.now(),
      name: newMeal.name,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      calories: parseInt(newMeal.calories),
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fats: parseInt(newMeal.fats) || 0,
      photo: false
    };

    setMeals(prev => [...prev, meal]);
    setDailyIntake(prev => ({
      calories: prev.calories + meal.calories,
      protein: prev.protein + meal.protein,
      carbs: prev.carbs + meal.carbs,
      fats: prev.fats + meal.fats
    }));

    setNewMeal({ name: "", calories: "", protein: "", carbs: "", fats: "" });
    toast.success("Meal logged successfully! 🍽️");
  };

  const macroData = [
    { name: 'Protein', value: dailyIntake.protein * 4, fill: '#00D4FF' },
    { name: 'Carbs', value: dailyIntake.carbs * 4, fill: '#39FF14' },
    { name: 'Fats', value: dailyIntake.fats * 9, fill: '#FF6B35' }
  ];

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Apple className="h-8 w-8 text-primary" />
            Nutrition Tracker
          </h1>
          <p className="text-muted-foreground mt-2">
            Photo-based meal logging with smart macro analysis
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-background">
            <Camera className="h-4 w-4 mr-2" />
            Photo Meal
          </Button>
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Calories", current: dailyIntake.calories, goal: goals.calories, unit: "kcal", icon: Target },
          { label: "Protein", current: dailyIntake.protein, goal: goals.protein, unit: "g", icon: TrendingUp },
          { label: "Carbs", current: dailyIntake.carbs, goal: goals.carbs, unit: "g", icon: Apple },
          { label: "Fats", current: dailyIntake.fats, goal: goals.fats, unit: "g", icon: Utensils }
        ].map((macro) => {
          const percentage = getProgressPercentage(macro.current, macro.goal);
          return (
            <Card key={macro.label} className="metric-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {macro.label}
                  </CardTitle>
                  <macro.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {macro.current}<span className="text-sm font-normal text-muted-foreground">/{macro.goal}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{macro.unit}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span className={getProgressColor(percentage)}>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20">
          <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Today's Meals
          </TabsTrigger>
          <TabsTrigger value="add" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Add Meal
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-background">
            Weekly Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {meals.map((meal) => (
                <Card key={meal.id} className="glass-effect border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          {meal.photo ? (
                            <Camera className="h-6 w-6 text-primary" />
                          ) : (
                            <Utensils className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{meal.name}</h4>
                          <p className="text-sm text-muted-foreground">{meal.time}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {meal.calories} cal
                            </Badge>
                            <Badge variant="outline" className="text-xs text-primary">
                              {meal.protein}g protein
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          C: {meal.carbs}g | F: {meal.fats}g
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
                  <Target className="h-5 w-5 text-accent" />
                  Macro Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {macroData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.fill }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{Math.round(item.value)} cal</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-secondary" />
                Log New Meal
              </CardTitle>
              <p className="text-muted-foreground">
                Manually enter meal details or use AI photo recognition
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meal-name">Meal Name</Label>
                  <Input
                    id="meal-name"
                    placeholder="e.g. Grilled Chicken Salad"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="450"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, calories: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="35"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, protein: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="45"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fats">Fats (g)</Label>
                  <Input
                    id="fats"
                    type="number"
                    placeholder="12"
                    value={newMeal.fats}
                    onChange={(e) => setNewMeal(prev => ({ ...prev, fats: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={addMeal} className="flex-1 bg-secondary hover:bg-secondary/90 text-background">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Camera className="h-4 w-4 mr-2" />
                  Photo + AI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Nutrition Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">2,632</div>
                  <div className="text-sm text-muted-foreground">Avg Daily Calories</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">172g</div>
                  <div className="text-sm text-muted-foreground">Avg Daily Protein</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">94%</div>
                  <div className="text-sm text-muted-foreground">Goal Adherence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Nutrition;
