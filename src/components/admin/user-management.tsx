
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Check, X, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { UserWallet } from "@/utils/baserow-api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function UserManagement() {
  const { getUsers, updateUserWallets, updateUserTier } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<UserWallet | null>(null);
  const [editedBalance, setEditedBalance] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>('1');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const fetchedUsers = await getUsers();
      // Filter out admin users
      const regularUsers = fetchedUsers.filter(user => !user.email.includes('admin'));
      setUsers(regularUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setSelectedTier((user.tier || 1).toString());
    setIsDialogOpen(true);
  };

  const handleEditWallet = (wallet: UserWallet) => {
    setEditingWallet(wallet);
    setEditedBalance(wallet.balance.toString());
  };

  const handleSaveWallet = async () => {
    if (!selectedUser || !editingWallet) return;
    
    const newBalance = parseFloat(editedBalance);
    if (isNaN(newBalance) || newBalance < 0) return;
    
    // Update the wallet in the user's wallet array
    const updatedWallets = selectedUser.wallets.map((wallet: UserWallet) => 
      wallet.id === editingWallet.id 
        ? { 
            ...wallet, 
            balance: newBalance.toString(),
            // Update the value based on the new balance
            value: wallet.symbol === 'USD' ? newBalance : newBalance * (editingWallet.value / parseFloat(editingWallet.balance))
          } 
        : wallet
    );
    
    const success = await updateUserWallets(selectedUser.id, updatedWallets);
    
    if (success) {
      // Update the local state
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, wallets: updatedWallets } 
          : user
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, wallets: updatedWallets });
      toast.success("Wallet balance updated successfully");
    }
    
    setEditingWallet(null);
  };

  const handleUpdateTier = async () => {
    if (!selectedUser) return;
    
    const tierNumber = parseInt(selectedTier);
    if (isNaN(tierNumber) || tierNumber < 1 || tierNumber > 12) {
      toast.error("Invalid tier level");
      return;
    }
    
    try {
      const success = await updateUserTier(selectedUser.id, tierNumber);
      
      if (success) {
        // Update the local state
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, tier: tierNumber } 
            : user
        );
        setUsers(updatedUsers);
        setSelectedUser({ ...selectedUser, tier: tierNumber });
        toast.success(`User tier updated to Tier ${tierNumber}`);
      } else {
        toast.error("Failed to update user tier");
      }
    } catch (error) {
      console.error("Error updating tier:", error);
      toast.error("An error occurred while updating user tier");
    }
  };

  const handleCancelEdit = () => {
    setEditingWallet(null);
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
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={fetchUsers} variant="outline" size="sm">Refresh</Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {user.username || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.account_status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}>
                      {user.account_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Tier {user.tier || 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.wallets ? 
                      `$${user.wallets.reduce((sum: number, wallet: UserWallet) => sum + wallet.value, 0).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}` : 
                      "No wallets"
                    }
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Wallet Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User: {selectedUser?.username || selectedUser?.email}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* User Tier Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Account Tier</h3>
              
              <div className="p-4 border rounded-md">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="tier-select">Current Tier:</Label>
                    <div className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Tier {selectedUser?.tier || 1}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={selectedTier}
                      onValueChange={setSelectedTier}
                    >
                      <SelectTrigger id="tier-select" className="w-full">
                        <SelectValue placeholder="Select Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Tier {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button onClick={handleUpdateTier}>
                      Update Tier
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Wallets Section */}
            <h3 className="font-medium">User Wallets</h3>
            
            {selectedUser?.wallets?.length > 0 ? (
              <div className="space-y-4">
                {selectedUser.wallets.map((wallet: UserWallet) => (
                  <div key={wallet.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{wallet.name} ({wallet.symbol})</div>
                      {editingWallet?.id === wallet.id ? (
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={handleSaveWallet}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleEditWallet(wallet)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {editingWallet?.id === wallet.id ? (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="balance">Balance:</Label>
                        <Input 
                          id="balance"
                          type="number" 
                          value={editedBalance} 
                          onChange={(e) => setEditedBalance(e.target.value)}
                          step="0.0001"
                          min="0"
                          className="max-w-[150px]"
                        />
                        <span>{wallet.symbol}</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground">
                          Balance: {wallet.balance} {wallet.symbol}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Value: ${wallet.value.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No wallets found for this user.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
