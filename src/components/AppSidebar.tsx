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

interface HistoryItem {
  id: number;
  title: string;
  time: string;
  prompt: string;
  images: Array<{ url: string; prompt: string; timestamp: number }>;
}

interface AppSidebarProps {
  historyItems?: HistoryItem[];
  onHistoryClick?: (id: number) => void;
  onNewChat?: () => void;
  currentHistoryId?: number | null;
}

export function AppSidebar({ historyItems = [], onHistoryClick, onNewChat, currentHistoryId }: AppSidebarProps) {
  const { state } = useSidebar();
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
            onClick={onNewChat}
          >
            <Plus className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span className="font-medium">New Chat</span>}
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs uppercase tracking-wider text-muted-foreground px-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <History className={`h-3 w-3 inline ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span className="font-semibold">Recent</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[400px]">
              {historyItems.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-xs text-muted-foreground">No history yet</p>
                </div>
              ) : (
                <SidebarMenu>
                  {historyItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-sidebar-accent transition-all group relative ${
                          currentHistoryId === item.id ? 'bg-sidebar-accent border-l-2 border-primary' : ''
                        }`}
                      >
                        <button 
                          className={`w-full text-left ${isCollapsed ? 'justify-center px-0' : ''}`}
                          onClick={() => onHistoryClick?.(item.id)}
                        >
                          <div className="flex items-start gap-2 w-full">
                            <Sparkles className={`h-4 w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform ${!isCollapsed ? 'mt-0.5' : ''}`} />
                            {!isCollapsed && (
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium truncate transition-colors ${
                                  currentHistoryId === item.id ? 'text-primary' : 'text-sidebar-foreground group-hover:text-primary'
                                }`}>
                                  {item.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.time}</div>
                                <div className="text-xs text-muted-foreground/70 truncate mt-1 italic">
                                  "{item.prompt}"
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <span className="text-xs text-muted-foreground font-semibold">Theme</span>}
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
