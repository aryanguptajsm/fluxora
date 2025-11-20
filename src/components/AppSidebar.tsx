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
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const historyItems = [
  { id: 1, title: "Cyberpunk cityscape", time: "2 hours ago" },
  { id: 2, title: "Fantasy dragon", time: "5 hours ago" },
  { id: 3, title: "Abstract art piece", time: "1 day ago" },
  { id: 4, title: "Portrait illustration", time: "2 days ago" },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground">Fluxora</span>
            <span className="text-xs text-muted-foreground">AI Studio</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-3">
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3">
            <History className="mr-2 h-3 w-3 inline" />
            Recent History
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[400px]">
              <SidebarMenu>
                {historyItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild className="hover:bg-sidebar-accent transition-colors">
                      <button className="w-full text-left">
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate text-sidebar-foreground">
                            {item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">{item.time}</div>
                        </div>
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
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
