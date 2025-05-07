
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { JSONBIN_CONFIG, fetchFromJsonBin, createJsonBinData } from '@/utils/jsonbin-api';

type FundingAccount = {
  id: string;
  name: string;
  type: string;
  details: string;
};

const FundAccount = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [fundingAccounts, setFundingAccounts] = useState<FundingAccount[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFundingAccounts();
  }, []);

  const fetchFundingAccounts = async () => {
    try {
      const response = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.FUNDING_ACCOUNTS);
      if (response && response.record) {
        setFundingAccounts(Array.isArray(response.record) ? response.record : []);
      }
    } catch (error) {
      console.error('Error fetching funding accounts:', error);
      toast.error('Failed to load funding accounts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod || !amount || parseFloat(amount) <= 0) {
      toast.error('Please select a method and enter a valid amount');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to fund your account');
      return;
    }

    setIsLoading(true);

    try {
      const fundingRequest = {
        userId: user.user_id,
        method: selectedMethod,
        amount: parseFloat(amount),
        proofUrl: proofFile ? proofFile.name : 'No proof provided',
        timestamp: new Date().toISOString(),
        status: 'Pending'
      };

      await createJsonBinData(JSONBIN_CONFIG.BINS.PENDING_FUNDINGS, fundingRequest);
      
      toast.success('Funding request submitted successfully!');
      setIsDialogOpen(false);
      setAmount('');
      setSelectedMethod('');
      setProofFile(null);
    } catch (error) {
      console.error('Error submitting funding request:', error);
      toast.error('Failed to submit funding request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Fund Your Account</h2>
        <p className="text-muted-foreground">
          Add funds to your trading account using one of our supported methods
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundingAccounts.map((account) => (
          <Card key={account.id} className="hover:border-primary/50 cursor-pointer transition-all" onClick={() => {
            setSelectedMethod(account.name);
            setIsDialogOpen(true);
          }}>
            <CardHeader className="pb-2">
              <CardTitle>{account.name}</CardTitle>
              <CardDescription>{account.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{account.details}</p>
              <Button className="w-full">Select</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {fundingAccounts.length === 0 && (
        <Card className="mt-4">
          <CardContent className="p-6 text-center">
            <p>No funding accounts available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later or contact support.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fund Account</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your account and upload proof of payment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
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
                  className="col-span-3"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="proof">Proof of Payment</Label>
                <Input
                  id="proof"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProofFile(e.target.files[0]);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Upload a screenshot or PDF of your payment receipt</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundAccount;
