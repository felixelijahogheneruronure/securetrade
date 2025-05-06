
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

const TransferFunds = () => {
  const { user, updateUserWallets } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const wallets = user?.wallets || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWallet || !recipientId || !amount) {
      toast.error('Please fill all the required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to transfer funds');
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
      const transferRequest = {
        senderId: user.user_id,
        recipientId: recipientId,
        walletId: selectedWallet,
        amount: selectedAmount,
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };

      await createJsonBinData(JSONBIN_CONFIG.BINS.TRANSACTIONS, transferRequest);
      
      toast.success('Transfer request submitted successfully!');
      
      // Clear form
      setSelectedWallet('');
      setRecipientId('');
      setAmount('');
    } catch (error) {
      console.error('Error submitting transfer request:', error);
      toast.error('Failed to submit transfer request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Transfer Funds</h2>
        <p className="text-muted-foreground">
          Send funds to another user on Universal Trade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Form</CardTitle>
              <CardDescription>
                Fill out the form below to transfer funds to another user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="wallet">Select Source Wallet</Label>
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
                  <Label htmlFor="recipient">Recipient User ID</Label>
                  <Input
                    id="recipient"
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Enter recipient's User ID"
                  />
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Submit Transfer Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Transfer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Recipient Information</h4>
                <p className="text-sm text-muted-foreground">
                  You need the User ID of the recipient to complete a transfer. 
                  User IDs are unique identifiers assigned to each user.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Processing Time</h4>
                <p className="text-sm text-muted-foreground">
                  Transfers between Universal Trade users are typically processed instantly.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Fees</h4>
                <p className="text-sm text-muted-foreground">
                  Internal transfers between Universal Trade users are free of charge.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransferFunds;
