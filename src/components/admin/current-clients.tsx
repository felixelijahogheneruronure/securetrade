
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
import { useAuth } from "@/contexts/auth-context";

export function CurrentClients() {
  const { getUsers } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setIsLoading(true);
      const users = await getUsers();
      // Filter out admin users to only show clients
      const filteredClients = users.filter(user => !user.isAdmin && user.email !== 'admin@admin.com');
      setClients(filteredClients);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
        <Button onClick={fetchClients} variant="outline" size="sm">Refresh</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead>Join Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((user) => {
                // Use a placeholder date if not available
                const joinDate = user.joinDate ? new Date(user.joinDate) : new Date();
                const formattedDate = joinDate.toLocaleDateString();

                return (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{user.username || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.account_status === "active"
                            ? "bg-green-500/10 text-green-500"
                            : user.account_status === "inactive"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {user.account_status ? (user.account_status.charAt(0).toUpperCase() + user.account_status.slice(1)) : 'Pending'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.kyc === "verified"
                            ? "bg-green-500/10 text-green-500"
                            : user.kyc === "rejected"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {user.kyc ? (user.kyc.charAt(0).toUpperCase() + user.kyc.slice(1)) : 'Pending'}
                      </div>
                    </TableCell>
                    <TableCell>{formattedDate}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
