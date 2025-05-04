
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const transactions = [
  {
    id: "tx-001",
    user: "John Smith",
    type: "buy",
    crypto: "BTC",
    amount: 0.32,
    fiat: 21657.28,
    currency: "USD",
    status: "completed",
    timestamp: "2025-05-03T12:40:00Z",
  },
  {
    id: "tx-002",
    user: "Emily Johnson",
    type: "sell",
    crypto: "ETH",
    amount: 2.5,
    fiat: 8546.75,
    currency: "USD",
    status: "completed",
    timestamp: "2025-05-03T10:15:00Z",
  },
  {
    id: "tx-003",
    user: "Michael Brown",
    type: "withdraw",
    crypto: "BTC",
    amount: 0.15,
    fiat: 10153.86,
    currency: "USD",
    status: "pending",
    timestamp: "2025-05-03T09:50:00Z",
  },
  {
    id: "tx-004",
    user: "Sarah Williams",
    type: "deposit",
    crypto: "USDT",
    amount: 5000,
    fiat: 5000,
    currency: "USD",
    status: "completed",
    timestamp: "2025-05-02T16:35:00Z",
  },
  {
    id: "tx-005",
    user: "David Lee",
    type: "buy",
    crypto: "SOL",
    amount: 25,
    fiat: 3723.25,
    currency: "USD",
    status: "failed",
    timestamp: "2025-05-02T14:20:00Z",
  },
];

export function TransactionOverview() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const date = new Date(tx.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            return (
              <TableRow key={tx.id}>
                <TableCell className="font-medium">{tx.user}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      tx.type === "buy"
                        ? "bg-green-500"
                        : tx.type === "sell"
                        ? "bg-red-500"
                        : tx.type === "deposit"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {tx.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {tx.amount} {tx.crypto}
                </TableCell>
                <TableCell>
                  {tx.fiat.toLocaleString()} {tx.currency}
                </TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      tx.status === "completed"
                        ? "bg-green-500/10 text-green-500"
                        : tx.status === "failed"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
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
