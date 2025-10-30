import {
  LayoutDashboard,
  Car,
  History,
  Settings,
  Users,
  Building2,
  Cog,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const USER_MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Parking Spots", url: "/parking", icon: Car },
  { title: "Activity", url: "/activity", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
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
  { title: "Activity", url: "/activity", icon: History },
];
