import { useState, useEffect } from "react";
import { Plus, History, Sparkles, Clock, LogOut, Search, Trash2, ChevronDown, Pin, LogIn } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

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
  onDeleteHistory?: (id: number) => void;
}

export function AppSidebar({ historyItems = [], onHistoryClick, onNewChat, currentHistoryId, onDeleteHistory }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedItems, setPinnedItems] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  const togglePin = (id: number) => {
    setPinnedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredHistory = historyItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const aIsPinned = pinnedItems.includes(a.id);
    const bIsPinned = pinnedItems.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">Fluxora AI</span>
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

        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className={`w-full flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground px-3 hover:bg-sidebar-accent rounded-md transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <History className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && <span className="font-semibold truncate">History</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${historyOpen ? 'rotate-180' : ''}`} />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            
            <CollapsibleContent>
              <SidebarGroupContent>
                {!isCollapsed && historyItems.length > 0 && (
                  <div className="px-3 py-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-7 text-xs bg-sidebar-accent/50 border-sidebar-border"
                      />
                    </div>
                  </div>
                )}
                
                <ScrollArea className="h-[350px] will-change-scroll">
                  {historyItems.length === 0 ? (
                    <div className="px-3 py-8 text-center">
                      <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground font-medium">No history yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Start creating images!</p>
                    </div>
                  ) : (
                    <SidebarMenu>
                      {sortedHistory.map((item) => {
                        const isPinned = pinnedItems.includes(item.id);
                        return (
                          <SidebarMenuItem key={item.id}>
                            <div className={`group/item hover:bg-sidebar-accent transition-all relative ${
                              currentHistoryId === item.id ? 'bg-sidebar-accent border-l-2 border-primary' : ''
                            }`}>
                              <SidebarMenuButton 
                                asChild 
                                className="hover:bg-transparent"
                              >
                                <button 
                                  className={`w-full text-left ${isCollapsed ? 'justify-center px-0' : 'pr-20'}`}
                                  onClick={() => onHistoryClick?.(item.id)}
                                >
                                  {isCollapsed ? (
                                    <Sparkles className="h-4 w-4 text-primary flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                  ) : (
                                    <div className="flex items-start gap-2 w-full min-w-0">
                                      <Sparkles className="h-4 w-4 text-primary flex-shrink-0 group-hover/item:scale-110 transition-transform mt-0.5" />
                                      <div className="flex-1 min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-1 min-w-0">
                                          {isPinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
                                          <span className={`text-sm font-medium truncate transition-colors ${
                                            currentHistoryId === item.id ? 'text-primary' : 'text-sidebar-foreground group-hover/item:text-primary'
                                          }`}>{item.title}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{item.time}</div>
                                        <div className="text-xs text-muted-foreground/70 line-clamp-2 leading-snug">
                                          {item.prompt}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </button>
                              </SidebarMenuButton>
                              
                              {!isCollapsed && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePin(item.id);
                                    }}
                                  >
                                    <Pin className={`h-3 w-3 ${isPinned ? 'fill-primary text-primary' : ''}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteHistory?.(item.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  )}
                </ScrollArea>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user ? (
          <Button
            variant="outline"
            className={`w-full bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 ${isCollapsed ? 'px-0 justify-center' : ''}`}
            onClick={handleSignOut}
          >
            <LogOut className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </Button>
        ) : (
          <Button
            variant="outline"
            className={`w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 ${isCollapsed ? 'px-0 justify-center' : ''}`}
            onClick={handleSignIn}
          >
            <LogIn className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : ''}`} />
            {!isCollapsed && <span className="font-medium">Sign In</span>}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
