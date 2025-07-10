
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Ruler, 
  Apple, 
  Target,
  Activity,
  Calendar,
  Trophy
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Workouts", url: "/workouts", icon: Dumbbell },
  { title: "Progress Photos", url: "/progress", icon: TrendingUp },
  { title: "Measurements", url: "/measurements", icon: Ruler },
  { title: "Nutrition", url: "/nutrition", icon: Apple },
  { title: "Goals", url: "/goals", icon: Target },
];

const analyticsItems = [
  { title: "Performance", url: "/analytics", icon: Activity },
  { title: "Reports", url: "/reports", icon: Calendar },
  { title: "Achievements", url: "/achievements", icon: Trophy },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 transition-all duration-200 ${
      isActive 
        ? "bg-primary/20 text-primary border-r-2 border-primary" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Sidebar className={`${state === "collapsed" ? "w-16" : "w-64"} border-r border-border bg-card/50 backdrop-blur-sm`}>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink to={item.url} end className={getNavClassName}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state !== "collapsed" && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Analytics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11">
                      <NavLink to={item.url} className={getNavClassName}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
