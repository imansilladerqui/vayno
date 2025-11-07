import { LayoutDashboard, Users, Building2, Cog } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const USER_MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Business Settings", url: "/businesses", icon: Cog },
];

export const SUPERADMIN_MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Businesses", url: "/businesses", icon: Building2 },
];
