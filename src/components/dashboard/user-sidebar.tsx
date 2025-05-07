
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Clock, 
  CreditCard, 
  Home, 
  Settings, 
  Users, 
  Wallet,
  LogOut,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
    title: "Fund Account",
    href: "/dashboard/fund",
    icon: ArrowDown,
  },
  {
    title: "Withdraw",
    href: "/dashboard/withdraw",
    icon: ArrowUp,
  },
  {
    title: "Transfer",
    href: "/dashboard/transfer",
    icon: ArrowRight,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Clock,
  },
  {
    title: "Trading Room",
    href: "/dashboard/trading",
    icon: BarChart,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function UserSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className={cn(
      "h-full border-r border-border bg-card transition-all duration-300", 
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-6 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
          </div>
          {!collapsed && <span className="ml-2 text-xl font-bold">Secure Trade</span>}
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-0 h-8 w-8"
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </Button>
      </div>
      
      <div className="px-3 py-2">
        <div className="space-y-1">
          {userNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                collapsed && "justify-center px-0",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
              {!collapsed && item.title}
            </Link>
          ))}
        </div>
      </div>
      
      <div className={cn(
        collapsed ? "px-3" : "px-3 absolute bottom-4 left-0 right-0",
        "mt-auto"
      )}>
        <Button 
          variant="ghost" 
          className={cn(
            "text-foreground/70 hover:bg-destructive/10 hover:text-destructive",
            collapsed ? "w-full p-2 justify-center" : "w-full justify-start"
          )}
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
