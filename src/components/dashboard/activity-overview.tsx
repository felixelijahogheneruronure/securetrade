
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const activityData = [
  {
    id: 1,
    type: "buy",
    coin: "Bitcoin",
    symbol: "BTC",
    amount: 0.025,
    value: 1685.81,
    timestamp: "2025-05-03T14:32:00Z",
  },
  {
    id: 2,
    type: "sell",
    coin: "Ethereum",
    symbol: "ETH",
    amount: 0.5,
    value: 1709.37,
    timestamp: "2025-05-02T10:15:00Z",
  },
  {
    id: 3,
    type: "deposit",
    coin: "USDT",
    symbol: "USDT",
    amount: 2000,
    value: 2000,
    timestamp: "2025-05-01T08:45:00Z",
  },
  {
    id: 4,
    type: "withdraw",
    coin: "Solana",
    symbol: "SOL",
    amount: 3.5,
    value: 521.5,
    timestamp: "2025-04-30T16:20:00Z",
  },
];

export function ActivityOverview() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityData.map((activity) => {
            const date = new Date(activity.timestamp);
            const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            return (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                      activity.type === "buy"
                        ? "bg-green-500"
                        : activity.type === "sell"
                        ? "bg-red-500"
                        : activity.type === "deposit"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                  >
                    {activity.type === "buy"
                      ? "B"
                      : activity.type === "sell"
                      ? "S"
                      : activity.type === "deposit"
                      ? "D"
                      : "W"}
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {activity.type} {activity.coin}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {activity.type === "sell" || activity.type === "withdraw"
                      ? "-"
                      : "+"}{" "}
                    {activity.amount} {activity.symbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${activity.value.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
