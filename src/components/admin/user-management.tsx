
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
import { UserWallet } from "@/contexts/auth-context";

export function UserManagement() {
  const { getUsers, updateUserWallets } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<UserWallet | null>(null);
  const [editedBalance, setEditedBalance] = useState("");

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
            balance: newBalance,
            // Update the value based on the new balance
            value: wallet.symbol === 'USDC' ? newBalance : newBalance * (wallet.value / editingWallet.balance)
          } 
        : wallet
    );
    
    const success = await updateUserWallets(selectedUser.user_id, updatedWallets);
    
    if (success) {
      // Update the local state
      const updatedUsers = users.map(user => 
        user.user_id === selectedUser.user_id 
          ? { ...user, wallets: updatedWallets } 
          : user
      );
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, wallets: updatedWallets });
    }
    
    setEditingWallet(null);
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
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.user_id}>
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
          
          <div className="py-4">
            <h3 className="font-medium mb-2">User Wallets</h3>
            
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
