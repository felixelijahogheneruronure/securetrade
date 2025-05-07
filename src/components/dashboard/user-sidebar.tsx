
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
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

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
  
  return (
    <div className="h-full w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
              U
            </div>
          </div>
          <span className="ml-2 text-xl font-bold">Universal</span>
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
      
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-foreground/70 hover:bg-destructive/10 hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
