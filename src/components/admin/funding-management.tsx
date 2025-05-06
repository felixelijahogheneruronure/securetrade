
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Check, X, FileText, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { JSONBIN_CONFIG, fetchFromJsonBin, updateJsonBin } from "@/utils/jsonbin-api";
import { toast } from "sonner";

type FundingRequest = {
  userId: string;
  method: string;
  amount: number;
  proofUrl: string;
  timestamp: string;
  status: string;
};

export function FundingManagement() {
  const { getUsers, updateUserWallets } = useAuth();
  const [fundingRequests, setFundingRequests] = useState<FundingRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<FundingRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch users
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers || []);
      
      // Fetch funding requests
      const response = await fetchFromJsonBin(JSONBIN_CONFIG.BINS.PENDING_FUNDINGS);
      if (response && response.record) {
        setFundingRequests(Array.isArray(response.record) ? response.record : []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRequest = (request: FundingRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      // Find user
      const user = users.find(u => u.user_id === selectedRequest.userId);
      if (!user) {
        toast.error("User not found");
        return;
      }
      
      // Update user wallet
      const wallets = user.wallets || [];
      
      // For simplicity, assuming we're adding USDT to the user's wallet
      let usdtWallet = wallets.find((w: any) => w.symbol === "USDT");
      if (!usdtWallet) {
        // Create USDT wallet if not exists
        usdtWallet = {
          id: `wallet_${Date.now()}`,
          name: "USD Tether",
          symbol: "USDT",
          balance: 0,
          value: 0,
          change: 0
        };
        wallets.push(usdtWallet);
      }
      
      // Update wallet balance
      usdtWallet.balance += selectedRequest.amount;
      usdtWallet.value += selectedRequest.amount;
      
      // Update user wallets
      await updateUserWallets(user.user_id, wallets);
      
      // Update funding request status
      const updatedRequests = fundingRequests.map(req => 
        req === selectedRequest ? { ...req, status: "Approved" } : req
      );
      
      await updateJsonBin(JSONBIN_CONFIG.BINS.PENDING_FUNDINGS, updatedRequests);
      
      // Update local state
      setFundingRequests(updatedRequests);
      
      toast.success("Funding request approved successfully");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve funding request");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest) return;
    
    setProcessingAction(true);
    try {
      // Update funding request status
      const updatedRequests = fundingRequests.map(req => 
        req === selectedRequest ? { ...req, status: "Declined" } : req
      );
      
      await updateJsonBin(JSONBIN_CONFIG.BINS.PENDING_FUNDINGS, updatedRequests);
      
      // Update local state
      setFundingRequests(updatedRequests);
      
      toast.success("Funding request declined");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error declining request:", error);
      toast.error("Failed to decline funding request");
    } finally {
      setProcessingAction(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Funding Requests</h2>
        <Button onClick={fetchData} variant="outline" size="sm">Refresh</Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fundingRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No funding requests found
                </TableCell>
              </TableRow>
            ) : (
              fundingRequests.map((request, index) => {
                const user = users.find(u => u.user_id === request.userId);
                return (
                  <TableRow key={index}>
                    <TableCell>{user?.username || request.userId}</TableCell>
                    <TableCell>{request.method}</TableCell>
                    <TableCell>${request.amount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(request.timestamp)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        request.status === "Approved"
                          ? "bg-green-500/10 text-green-500"
                          : request.status === "Declined"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                        disabled={request.status !== "Pending"}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Funding Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p>{selectedRequest.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Method</p>
                  <p>{selectedRequest.method}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p>${selectedRequest.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(selectedRequest.timestamp)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proof of Payment</p>
                <div className="mt-1">
                  {selectedRequest.proofUrl.includes("No proof") ? (
                    <p className="text-sm italic">No proof provided</p>
                  ) : (
                    <Button variant="outline" size="sm" className="text-sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Document
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Actions</p>
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    className="flex-1 bg-green-600 hover:bg-green-700" 
                    onClick={handleApproveRequest}
                    disabled={processingAction || selectedRequest.status !== "Pending"}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="default" 
                    className="flex-1 bg-red-600 hover:bg-red-700" 
                    onClick={handleDeclineRequest}
                    disabled={processingAction || selectedRequest.status !== "Pending"}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
