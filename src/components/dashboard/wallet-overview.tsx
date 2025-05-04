
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";

const walletData = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.245,
    value: 16618.94,
    change24h: 2.5,
    color: "#F7931A",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    amount: 4.82,
    value: 16468.27,
    change24h: 1.8,
    color: "#627EEA",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    amount: 56.21,
    value: 8371.52,
    change24h: 5.2,
    color: "#00FFA3",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    amount: 8500,
    value: 8500,
    change24h: 0.1,
    color: "#26A17B",
  },
];

export function WalletOverview() {
  const totalValue = walletData.reduce((sum, coin) => sum + coin.value, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Wallet Overview</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Total Balance</p>
          <h3 className="text-2xl font-bold">${totalValue.toLocaleString()}</h3>
        </div>

        <div className="space-y-4">
          {walletData.map((coin) => (
            <div key={coin.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: coin.color }}
                />
                <div>
                  <p className="font-medium">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {coin.amount} {coin.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${coin.value.toLocaleString()}</p>
                <p
                  className={`text-xs flex items-center ${
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {coin.change24h >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(coin.change24h)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
