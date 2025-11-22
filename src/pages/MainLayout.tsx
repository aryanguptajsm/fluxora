import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, LogIn } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface HistoryItem {
  id: number;
  title: string;
  time: string;
  prompt: string;
  images: Array<{ url: string; prompt: string; timestamp: number }>;
}

const MainLayout = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveToHistory = (images: Array<{ url: string; prompt: string; timestamp: number }>, prompt: string) => {
    const newId = Date.now();
    const newItem: HistoryItem = {
      id: newId,
      title: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''),
      time: 'Just now',
      prompt,
      images
    };
    setHistoryItems(prev => [newItem, ...prev]);
    setCurrentHistoryId(newId);
  };

  const loadFromHistory = (historyId: number) => {
    setCurrentHistoryId(historyId);
  };

  const startNewChat = () => {
    setCurrentHistoryId(null);
  };

  const handleDeleteHistory = (id: number) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    if (currentHistoryId === id) {
      setCurrentHistoryId(null);
    }
    toast.success("History item deleted");
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          historyItems={historyItems} 
          onHistoryClick={loadFromHistory}
          onNewChat={startNewChat}
          currentHistoryId={currentHistoryId}
          onDeleteHistory={handleDeleteHistory}
        />
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Toggle */}
          <header className="sticky top-0 z-40 flex items-center gap-3 h-16 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg p-2">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1">
              <h2 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Fluxora AI
              </h2>
            </div>
            <div className="text-xs text-muted-foreground hidden md:flex items-center gap-2 mr-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow"></span>
              <span className="font-medium">Ready to create</span>
            </div>
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-primary hover:opacity-90 transition-all shadow-glow font-semibold"
                size="sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            <Outlet context={{ saveToHistory, loadFromHistory: loadFromHistory, currentHistoryId, historyItems }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

