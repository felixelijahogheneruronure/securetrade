
import { Routes, Route } from "react-router-dom";
import { WalletOverview } from "@/components/dashboard/wallet-overview";
import { ActivityOverview } from "@/components/dashboard/activity-overview";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { UserSidebar } from "@/components/dashboard/user-sidebar";
import { useAuth } from "@/contexts/auth-context";
import WalletsPage from "./WalletsPage";
import TradingRoom from "./TradingRoom";
import FundAccount from "./FundAccount";
import WithdrawFunds from "./WithdrawFunds";
import TransferFunds from "./TransferFunds";
import UserMessages from "./UserMessages";
import Settings from "./Settings";
import { NotificationPanel } from "@/components/user/notification-panel";

const DashboardHome = () => (
  <div className="p-6">
    <div className="mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Welcome back! Here's an overview of your portfolio.
      </p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12">
        <PortfolioChart />
      </div>
      <div className="lg:col-span-4">
        <WalletOverview />
      </div>
      <div className="lg:col-span-8">
        <ActivityOverview />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-14 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <NotificationPanel />
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">
                  {user?.username || user?.email}
                  {user?.tier !== undefined && <span className="ml-2 text-xs text-muted-foreground">(Tier {user.tier})</span>}
                </span>
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-red-600 to-black">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'S'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/wallets" element={<WalletsPage />} />
          <Route path="/trading" element={<TradingRoom />} />
          <Route path="/fund" element={<FundAccount />} />
          <Route path="/withdraw" element={<WithdrawFunds />} />
          <Route path="/transfer" element={<TransferFunds />} />
          <Route path="/messages" element={<UserMessages />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
