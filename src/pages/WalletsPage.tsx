
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

const WalletsPage = () => {
  const { user } = useAuth();
  const wallets = user?.wallets || [];

  const handleAddWallet = () => {
    toast.info("This feature is coming soon!");
  };

  const handleDeposit = () => {
    toast.info("Deposit functionality will be available soon!");
  };

  const handleWithdraw = () => {
    toast.info("Withdrawal functionality will be available soon!");
  };

  const handleConnectWallet = () => {
    toast.info("External wallet connections will be available soon!");
  };

  // Calculate total balance from Baserow wallet data
  const totalBalance = wallets.reduce((acc, wallet) => {
    const value = parseFloat(wallet.value.replace(/[$,]/g, '')) || 0;
    return acc + value;
  }, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
        <p className="text-muted-foreground">
          Manage your crypto assets and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Balance (USD)</CardDescription>
            <CardTitle className="text-3xl font-bold">
              ${totalBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardDescription>Quick Actions</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2 flex-1 justify-center items-center">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleDeposit}>
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Deposit
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={handleWithdraw}>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Wallets</CardDescription>
            <CardTitle className="text-3xl font-bold">{wallets.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full" onClick={handleAddWallet}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Wallet
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Your Wallets</h3>
          <Button variant="outline" size="sm" onClick={handleConnectWallet}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Connect External Wallet
          </Button>
        </div>
        
        {wallets.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No wallets found. Add a wallet to get started.</p>
            </CardContent>
          </Card>
        ) : (
          wallets.map((wallet, index) => (
            <Card key={index} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-4">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{wallet.name}</h4>
                      <p className="text-sm text-muted-foreground">{wallet.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{wallet.balance} {wallet.symbol}</div>
                    <div className="flex items-center justify-end">
                      <span className="font-medium">{wallet.value}</span>
                      <span className={`ml-2 text-xs ${
                        wallet.change.includes('+') ? 'text-green-500' : 
                        wallet.change.includes('-') ? 'text-red-500' : 'text-muted-foreground'
                      }`}>
                        {wallet.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletsPage;
