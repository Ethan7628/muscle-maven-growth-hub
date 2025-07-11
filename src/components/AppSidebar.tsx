import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Ruler, 
  Apple, 
  Target,
  Activity,
  Calendar,
  Trophy,
  User,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 transition-all duration-200 rounded-md p-2 ${
      isActive 
        ? "bg-primary/20 text-primary border-r-2 border-primary" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    }`;

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} border-r border-border bg-card/50 backdrop-blur-sm min-h-screen`}>
      <SidebarContent className="py-4 px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 w-full">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavClassName({ isActive })}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              Analytics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11 w-full">
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavClassName({ isActive })}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium truncate">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <div className="px-3 py-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {currentUser?.displayName || currentUser?.email || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}