
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { StatsCards } from "@/components/admin/stats-cards";
import { RecentUsers } from "@/components/admin/recent-users";
import { TransactionOverview } from "@/components/admin/transaction-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Platform overview and management tools
          </p>
        </div>
        
        <StatsCards />
        
        <div className="grid grid-cols-1 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentUsers />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionOverview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
