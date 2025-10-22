import { LayoutDashboard, Car, History, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
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

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Parking Spots", url: "/parking", icon: Car },
  { title: "Activity", url: "/activity", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          {!isCollapsed && (
            <>
              <h1 className="text-xl font-bold text-sidebar-foreground">
                Vayno
              </h1>
              <p className="text-sm text-sidebar-foreground/70 mt-1">
                Manage your parking
              </p>
            </>
          )}
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarMenuButton className="w-full text-destructive hover:bg-destructive/10">
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
