
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Bell,
  Clock, 
  FileCheck, 
  Home, 
  Settings, 
  Shield, 
  Users, 
  Wallet 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isCollapsed?: boolean;
}

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "KYC Verification",
    href: "/admin/kyc",
    icon: FileCheck,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: Clock,
  },
  {
    title: "Wallet Monitoring",
    href: "/admin/wallets",
    icon: Wallet,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ isCollapsed = false }: AdminSidebarProps) {
  const location = useLocation();
  
  return (
    <div className="h-full flex flex-col">
      <div className={cn(
        "p-6 flex items-center",
        isCollapsed && "justify-center p-2"
      )}>
        <Link to="/admin" className="flex items-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
          </div>
          {!isCollapsed && <span className="ml-2 text-xl font-bold">Admin</span>}
        </Link>
      </div>
      
      <div className={cn(
        "px-3 py-2 flex-1 overflow-y-auto",
        isCollapsed && "px-2"
      )}>
        <div className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
                isCollapsed 
                  ? "justify-center px-2" 
                  : "px-3",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon className={cn(
                "h-4 w-4", 
                !isCollapsed && "mr-2"
              )} />
              {!isCollapsed && item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
