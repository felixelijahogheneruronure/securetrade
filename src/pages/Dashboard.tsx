
import { WalletOverview } from "@/components/dashboard/wallet-overview";
import { ActivityOverview } from "@/components/dashboard/activity-overview";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { UserSidebar } from "@/components/dashboard/user-sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <UserSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your portfolio.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <PortfolioChart />
          </div>
          <div className="lg:col-span-4">
            <WalletOverview />
          </div>
          <div className="lg:col-span-12">
            <ActivityOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
