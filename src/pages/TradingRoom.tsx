
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const TradingRoom = () => {
  const { toast } = useToast();

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
            <div className="h-[300px] bg-black/50 flex items-center justify-center mb-4">
              <p className="text-center text-muted-foreground">
                Visit the home page to view real-time market data and charts
              </p>
            </div>
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
            <div className="h-[300px] bg-black/50 flex items-center justify-center mb-4">
              <p className="text-center text-muted-foreground">
                Visit the home page to view real-time market data and charts
              </p>
            </div>
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
            <div className="h-[300px] bg-black/50 flex items-center justify-center mb-4">
              <p className="text-center text-muted-foreground">
                Visit the home page to view real-time market data and charts
              </p>
            </div>
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
            <div className="h-[300px] bg-black/50 flex items-center justify-center mb-4">
              <p className="text-center text-muted-foreground">
                Visit the home page to view real-time market data and charts
              </p>
            </div>
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
