
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-14 sm:h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center h-full px-3 sm:px-4 gap-2 sm:gap-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-background font-bold text-xs sm:text-sm">💪</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FlexTracker
              </h1>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-background via-card/20 to-background overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
