import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useAuth";
import { SUPERADMIN_MENU_ITEMS } from "@/lib/sidebarMenus";

export const AppSidebar = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { logout } = useLogout();

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-5 border-b border-sidebar-border">
          {!isCollapsed && (
            <>
              <h1 className="text-xl font-semibold text-sidebar-foreground tracking-tight">
                Vayno
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Smart parking management
              </p>
            </>
          )}
        </div>

        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            {!isCollapsed && (
              <div className="px-4 pb-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Overview
                </p>
              </div>
            )}
            <SidebarMenu>
              {SUPERADMIN_MENU_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={[
                          "relative flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          isActive
                            ? "bg-primary text-white ring-1 ring-primary/20"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                        ].join(" ")}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <span className="absolute left-1 h-6 w-1 rounded-full bg-primary" />
                        )}
                        <item.icon
                          className={[
                            "h-5 w-5",
                            isActive ? "text-white" : "text-muted-foreground",
                          ].join(" ")}
                        />
                        {!isCollapsed ? (
                          <span className={isActive ? "text-white" : undefined}>
                            {item.title}
                          </span>
                        ) : (
                          <span className="sr-only">{item.title}</span>
                        )}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <SidebarMenuButton
            className="w-full text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </SidebarMenuButton>
          {!isCollapsed && (
            <div className="mt-3 text-[11px] text-muted-foreground">v1.0.0</div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
