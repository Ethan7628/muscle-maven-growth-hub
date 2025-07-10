
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity, 
  Flame, 
  Trophy,
  Plus,
  Camera,
  Ruler
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";

const strengthData = [
  { week: 'W1', weight: 135, soreness: 2 },
  { week: 'W2', weight: 140, soreness: 1 },
  { week: 'W3', weight: 145, soreness: 3 },
  { week: 'W4', weight: 150, soreness: 1 },
  { week: 'W5', weight: 155, soreness: 2 },
  { week: 'W6', weight: 160, soreness: 0 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back, Athlete! 💪
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
            You don't have to feel sore to be growing. Consistency builds strength.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button 
            className="bg-primary hover:bg-primary/90 text-background font-semibold w-full sm:w-auto"
            onClick={() => window.location.href = '/workouts'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Workout
          </Button>
          <Button 
            variant="outline" 
            className="border-secondary text-secondary hover:bg-secondary/10 w-full sm:w-auto"
            onClick={() => window.location.href = '/progress'}
          >
            <Camera className="h-4 w-4 mr-2" />
            Progress Photo
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="metric-card border-0">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Weekly Streak</CardTitle>
              <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-accent">6</div>
            <p className="text-xs text-muted-foreground mt-1">weeks consistent</p>
            <div className="mt-2 sm:mt-3">
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Strength Gain</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">+18%</div>
            <p className="text-xs text-muted-foreground mt-1">vs last month</p>
            <Badge variant="secondary" className="mt-2 bg-secondary/20 text-secondary">
              Personal Record!
            </Badge>
          </CardContent>
        </Card>

        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Muscle Growth</CardTitle>
              <Ruler className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">+2.4cm</div>
            <p className="text-xs text-muted-foreground mt-1">chest measurement</p>
            <div className="mt-3">
              <Progress value={68} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
              <Target className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground mt-1">to 80kg goal</p>
            <div className="mt-3">
              <Progress value={73} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Strength vs Soreness Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Track how your strength progresses regardless of soreness levels
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strengthData}>
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Insight:</strong> Your strength increased 18% over 6 weeks with minimal soreness correlation.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" />
              Weekly Soreness Patterns
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Understanding your recovery without dependency on soreness
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strengthData}>
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Bar 
                    dataKey="soreness" 
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">4</div>
                <div className="text-xs text-muted-foreground">Low Soreness</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">2</div>
                <div className="text-xs text-muted-foreground">Moderate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">0</div>
                <div className="text-xs text-muted-foreground">High Soreness</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Logged chest workout", detail: "Bench Press: 160lbs x 8 reps", time: "2 hours ago", soreness: "None" },
              { action: "Progress photo uploaded", detail: "Front view comparison", time: "1 day ago", soreness: "Slight" },
              { action: "Measurements updated", detail: "Biceps: +0.5cm growth", time: "3 days ago", soreness: "None" },
              { action: "Personal record achieved!", detail: "Deadlift: 200lbs", time: "5 days ago", soreness: "Noticeable" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${activity.soreness === 'None' ? 'border-green-500 text-green-400' : 
                                     activity.soreness === 'Slight' ? 'border-yellow-500 text-yellow-400' : 
                                     'border-red-500 text-red-400'}`}
                  >
                    {activity.soreness}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
