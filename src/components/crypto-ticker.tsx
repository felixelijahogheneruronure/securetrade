
import { useEffect, useState } from "react";

interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

// Mock data for the crypto ticker
const mockCryptoPrices: CryptoPrice[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 67832.41, change24h: 2.5 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3418.73, change24h: 1.8 },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB", price: 574.26, change24h: -0.7 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 148.92, change24h: 5.2 },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.5023, change24h: -1.3 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.4521, change24h: 0.9 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 7.29, change24h: 3.1 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.1263, change24h: -2.4 },
];

export function CryptoTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>(mockCryptoPrices);

  useEffect(() => {
    // Simulate price changes every 5 seconds
    const interval = setInterval(() => {
      setPrices((currentPrices) =>
        currentPrices.map((crypto) => ({
          ...crypto,
          price: +(crypto.price * (1 + (Math.random() * 0.006 - 0.003))).toFixed(
            crypto.price < 1 ? 4 : 2
          ),
          change24h: +(crypto.change24h + (Math.random() * 0.4 - 0.2)).toFixed(1),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-secondary/50 dark:bg-secondary/30 w-full overflow-hidden border-t border-b border-border">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {[...prices, ...prices].map((crypto, index) => (
          <div
            key={`${crypto.id}-${index}`}
            className="mx-4 flex items-center space-x-2"
          >
            <span className="font-medium">{crypto.symbol}</span>
            <span>${crypto.price.toLocaleString()}</span>
            <span
              className={`${
                crypto.change24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {crypto.change24h > 0 ? "+" : ""}
              {crypto.change24h}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
