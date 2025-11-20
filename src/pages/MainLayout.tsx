import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Toggle */}
          <header className="sticky top-0 z-40 flex items-center gap-3 h-16 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg p-2">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1">
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fluxora AI Studio
              </h2>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Ready to create</span>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

