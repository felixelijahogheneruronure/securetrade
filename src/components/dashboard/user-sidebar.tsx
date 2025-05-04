
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Clock, 
  CreditCard, 
  Home, 
  Settings, 
  Users, 
  Wallet 
} from "lucide-react";
import { cn } from "@/lib/utils";

const userNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Wallets",
    href: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Clock,
  },
  {
    title: "Trade",
    href: "/dashboard/trade",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function UserSidebar() {
  const location = useLocation();
  
  return (
    <div className="h-full w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              B
            </div>
          </div>
          <span className="ml-2 text-xl font-bold">Dashboard</span>
        </Link>
      </div>
      
      <div className="px-3 py-2">
        <div className="space-y-1">
          {userNavItems.map((item) => (
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
