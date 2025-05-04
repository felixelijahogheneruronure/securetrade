
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  {
    id: "u-001",
    name: "John Smith",
    email: "john.smith@example.com",
    status: "active",
    kyc: "verified",
    joinDate: "2025-04-21T10:31:00Z",
  },
  {
    id: "u-002",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    status: "active",
    kyc: "pending",
    joinDate: "2025-04-23T14:45:00Z",
  },
  {
    id: "u-003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    status: "inactive",
    kyc: "verified",
    joinDate: "2025-04-18T09:15:00Z",
  },
  {
    id: "u-004",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    status: "active",
    kyc: "rejected",
    joinDate: "2025-04-25T16:20:00Z",
  },
  {
    id: "u-005",
    name: "David Lee",
    email: "david.lee@example.com",
    status: "pending",
    kyc: "pending",
    joinDate: "2025-05-01T11:05:00Z",
  },
];

export function RecentUsers() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>KYC</TableHead>
            <TableHead>Join Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const date = new Date(user.joinDate);
            const formattedDate = date.toLocaleDateString();

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>
                    <p>{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : user.status === "inactive"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                    {user.kyc.charAt(0).toUpperCase() + user.kyc.slice(1)}
                  </div>
                </TableCell>
                <TableCell>{formattedDate}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
