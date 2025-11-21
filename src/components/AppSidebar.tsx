import { Plus, History, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

const historyItems = [
  { id: 1, title: "Golden lion at sunset", time: "2 hours ago" },
  { id: 2, title: "Futuristic city lights", time: "5 hours ago" },
  { id: 3, title: "Abstract digital art", time: "1 day ago" },
  { id: 4, title: "Mountain landscape", time: "2 days ago" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">Fluxora</span>
              <span className="text-xs text-muted-foreground">AI Studio</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-3">
          <Button 
            className={`w-full bg-gradient-primary hover:opacity-90 transition-all shadow-glow ${isCollapsed ? 'px-0 justify-center' : ''}`}
            onClick={() => window.location.reload()}
          >
            <Plus className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span className="font-medium">New Chat</span>}
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs uppercase tracking-wider text-muted-foreground px-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <History className={`h-3 w-3 inline ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span>Recent</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[400px]">
              <SidebarMenu>
                {historyItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild className="hover:bg-sidebar-accent transition-all">
                      <button className={`w-full text-left ${isCollapsed ? 'justify-center px-0' : ''}`}>
                        <Sparkles className={`h-4 w-4 text-primary flex-shrink-0 ${!isCollapsed ? 'mr-2' : ''}`} />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate text-sidebar-foreground">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground">{item.time}</div>
                          </div>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span className="text-xs text-muted-foreground font-medium">Theme</span>}
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
