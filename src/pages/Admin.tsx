
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { StatsCards } from "@/components/admin/stats-cards";
import { CurrentClients } from "@/components/admin/current-clients";
import { TransactionOverview } from "@/components/admin/transaction-overview";
import { UserManagement } from "@/components/admin/user-management";
import { NotificationManagement } from "@/components/admin/notification-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { NotificationPanel } from "@/components/user/notification-panel";
import { Toaster } from "@/components/ui/toaster";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

// Admin dashboard home component
const AdminHome = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Platform overview and management tools
        </p>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Current Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentClients />
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
  );
};

// User management page component
const UsersPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage platform users and their wallets
        </p>
      </div>
      
      <UserManagement />
    </div>
  );
};

// Notification management page component
const NotificationsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Notification Center</h2>
        <p className="text-muted-foreground">
          Manage announcements and personal notifications
        </p>
      </div>
      
      <NotificationManagement />
    </div>
  );
};

const Admin = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex h-screen">
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'} h-full overflow-hidden border-r border-border bg-card`}>
        <AdminSidebar isCollapsed={!sidebarOpen} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-14 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:flex mr-2"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <div className="ml-auto flex items-center space-x-4">
              <NotificationPanel />
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">
                  {user?.username || user?.email}
                </span>
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-crypto-violet to-crypto-blue">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                    {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          {/* Add more routes as needed */}
        </Routes>
        <Toaster />
      </div>
    </div>
  );
};

export default Admin;
