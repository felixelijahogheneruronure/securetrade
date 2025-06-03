
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { JSONBIN_CONFIG, createJsonBinData } from '@/utils/jsonbin-api';
import { UserWallet } from '@/contexts/auth-context';

const withdrawMethods = [
  { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
  { id: 'crypto', name: 'Crypto Wallet', icon: '💰' },
  { id: 'paypal', name: 'PayPal', icon: '💳' }
];

const WithdrawFunds = () => {
  const { user, updateUserWallets } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const wallets = user?.wallets || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWallet || !withdrawMethod || !amount || !destination) {
      toast.error('Please fill all the required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to withdraw funds');
      return;
    }

    const selectedAmount = parseFloat(amount);
    
    if (isNaN(selectedAmount) || selectedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Find the selected wallet
    const wallet = wallets.find(w => w.id === selectedWallet);
    
    if (!wallet) {
      toast.error('Selected wallet not found');
      return;
    }

    if (wallet.value < selectedAmount) {
      toast.error('Insufficient funds in the selected wallet');
      return;
    }

    setIsLoading(true);

    try {
      const withdrawalRequest = {
        userId: user.user_id,
        walletId: selectedWallet,
        method: withdrawMethod,
        amount: selectedAmount,
        destination,
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };

      await createJsonBinData(JSONBIN_CONFIG.BINS.WITHDRAWALS, withdrawalRequest);
      
      toast.success('Withdrawal request submitted successfully!');
      
      // Clear form
      setSelectedWallet('');
      setWithdrawMethod('');
      setAmount('');
      setDestination('');
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      toast.error('Failed to submit withdrawal request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Withdraw Funds</h2>
        <p className="text-muted-foreground">
          Withdraw funds from your trading account to your preferred destination
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Form</CardTitle>
              <CardDescription>
                Fill out the form below to request a withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="wallet">Select Wallet</Label>
                  <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                    <SelectTrigger id="wallet">
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      {wallets.map((wallet: UserWallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name} - {wallet.balance} {wallet.symbol} (${wallet.value})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="method">Withdrawal Method</Label>
                  <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {withdrawMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="destination">
                    {withdrawMethod === 'bank' 
                      ? 'Bank Account Details' 
                      : withdrawMethod === 'crypto' 
                      ? 'Wallet Address' 
                      : 'PayPal Email'}
                  </Label>
                  <Input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={
                      withdrawMethod === 'bank' 
                        ? 'Bank name, Account number...' 
                        : withdrawMethod === 'crypto' 
                        ? 'Wallet address...' 
                        : 'PayPal email address...'
                    }
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Withdrawal Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Processing Time</h4>
                <p className="text-sm text-muted-foreground">
                  Withdrawals are typically processed within 24 hours during business days.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Minimum Withdrawal</h4>
                <p className="text-sm text-muted-foreground">
                  The minimum withdrawal amount is $10 or equivalent.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Fees</h4>
                <p className="text-sm text-muted-foreground">
                  Bank transfers: 1% (min $5)<br />
                  Crypto withdrawals: Network fee<br />
                  PayPal: 2.5% (min $2)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFunds;
