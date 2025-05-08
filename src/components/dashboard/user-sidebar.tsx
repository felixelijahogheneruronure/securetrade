
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  BarChart, 
  Clock, 
  Home, 
  Settings, 
  Users, 
  Wallet,
  LogOut,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
    <Collapsible 
      open={!collapsed} 
      onOpenChange={(open) => setCollapsed(!open)}
      className={cn(
        "relative h-full transition-all duration-300 border-r border-border", 
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("p-4 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-black">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
            </div>
            <span className="ml-2 text-xl font-bold">SECURE TRADE</span>
          </Link>
        )}
        {collapsed && (
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-black">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
          </div>
        )}
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent forceMount className="px-3 py-2">
        <div className="space-y-1">
          {userNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === item.href
                  ? "bg-red-600 text-white"
                  : "text-foreground/70 hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </CollapsibleContent>
      
      <div className={cn(
        "absolute bottom-4 px-3 w-full", 
        collapsed ? "px-1" : "px-3"
      )}>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full text-red-500 hover:bg-red-500/10 hover:text-red-600",
            collapsed ? "justify-center px-1" : "justify-start"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </Collapsible>
  );
}
