
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Clock, 
  FileCheck, 
  Home, 
  Settings, 
  Shield, 
  Users, 
  Wallet 
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function AdminSidebar() {
  const location = useLocation();
  
  return (
    <div className="h-full w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link to="/admin" className="flex items-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
          </div>
          <span className="ml-2 text-xl font-bold">Admin</span>
        </Link>
      </div>
      
      <div className="px-3 py-2">
        <div className="space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
