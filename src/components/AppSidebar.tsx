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
    <Sidebar className="border-r border-sidebar-border bg-sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold text-foreground">Fluxora</span>
            <span className="text-xs text-muted-foreground">AI Studio</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="p-3">
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow justify-start">
            <Plus className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
            <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3">
            <History className="mr-2 h-3 w-3 inline group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Recent History</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[400px]">
              <SidebarMenu>
                {historyItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild className="hover:bg-sidebar-accent transition-colors">
                      <button className="w-full text-left">
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0 group-data-[collapsible=icon]:mr-0 mr-2" />
                        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
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
          <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Theme</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
