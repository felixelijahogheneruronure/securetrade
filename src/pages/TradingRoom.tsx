
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingRoom = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Load TradingView script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = initializeCharts;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeCharts = () => {
    if (window.TradingView) {
      loadChart("bch_chart", "BINANCE:BCHUSDT");
      loadChart("btc_chart", "BINANCE:BTCUSDT");
      loadChart("eurusd_chart", "OANDA:EURUSD");
      loadChart("eth_chart", "BINANCE:ETHUSDT");
    }
  };

  const loadChart = (containerId: string, symbol: string) => {
    new window.TradingView.widget({
      width: "100%",
      height: 300,
      symbol: symbol,
      interval: "1",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      hide_legend: false,
      container_id: containerId
    });
  };

  const handleTrade = (action: string, coin: string) => {
    toast({
      title: `${action} ${coin}`,
      description: `Your ${action.toLowerCase()} order for ${coin} has been submitted.`,
      variant: action === "Buy" ? "default" : "destructive",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">📈 Trading Room</h2>
        <p className="text-muted-foreground">
          Monitor and trade your favorite crypto pairs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-lime-500">BCH/USDT</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="bch_chart" className="h-[300px]"></div>
            <div className="flex gap-4 mt-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => handleTrade("Buy", "BCH")}
              >
                Buy BCH
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => handleTrade("Sell", "BCH")}
              >
                Sell BCH
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-lime-500">BTC/USDT</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="btc_chart" className="h-[300px]"></div>
            <div className="flex gap-4 mt-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => handleTrade("Buy", "BTC")}
              >
                Buy BTC
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => handleTrade("Sell", "BTC")}
              >
                Sell BTC
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-lime-500">EUR/USD</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="eurusd_chart" className="h-[300px]"></div>
            <div className="flex gap-4 mt-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => handleTrade("Buy", "EUR")}
              >
                Buy EUR
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => handleTrade("Sell", "EUR")}
              >
                Sell EUR
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-lime-500">ETH/USDT</CardTitle>
          </CardHeader>
          <CardContent>
            <div id="eth_chart" className="h-[300px]"></div>
            <div className="flex gap-4 mt-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => handleTrade("Buy", "ETH")}
              >
                Buy ETH
              </Button>
              <Button 
                variant="destructive"
                className="w-full"
                onClick={() => handleTrade("Sell", "ETH")}
              >
                Sell ETH
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingRoom;
