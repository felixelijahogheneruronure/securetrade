
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PortfolioChart() {
  const marketOverviewRef = useRef<HTMLDivElement>(null);
  const technicalAnalysisRef = useRef<HTMLDivElement>(null);
  const eventsWidgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Don't execute during SSR
    if (!marketOverviewRef.current || !technicalAnalysisRef.current || !eventsWidgetRef.current) return;
    
    // Create Market Overview Widget
    const marketScript = document.createElement('script');
    marketScript.type = 'text/javascript';
    marketScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    marketScript.async = true;
    
    // Add Market Overview configuration
    marketScript.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "12M",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": false,
      "width": "100%",
      "height": "450",
      "plotLineColorGrowing": "rgba(0, 255, 0, 1)",
      "plotLineColorFalling": "rgba(255, 0, 0, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(120, 123, 134, 1)",
      "belowLineFillColorGrowing": "rgba(0, 255, 0, 0.05)",
      "belowLineFillColorFalling": "rgba(255, 0, 0, 0.05)",
      "symbolActiveColor": "rgba(0, 255, 0, 0.15)",
      "tabs": [
        {
          "title": "Crypto",
          "symbols": [
            { "s": "BINANCE:BTCUSDT", "d": "BTC" },
            { "s": "BINANCE:ETHUSDT", "d": "ETH" },
            { "s": "BINANCE:BNBUSDT", "d": "BNB" }
          ],
          "originalTitle": "Crypto"
        },
        {
          "title": "Forex",
          "symbols": [
            { "s": "FX:EURUSD" },
            { "s": "FX:GBPUSD" },
            { "s": "FX:USDJPY" }
          ],
          "originalTitle": "Forex"
        }
      ]
    });
    
    // Clean up existing content and add market overview script
    if (marketOverviewRef.current) {
      // Remove any existing scripts
      const existingMarketScripts = marketOverviewRef.current.querySelectorAll('script');
      existingMarketScripts.forEach(script => script.remove());
      
      // Append new script
      marketOverviewRef.current.appendChild(marketScript);
    }
    
    // Create Technical Analysis Widget
    const technicalScript = document.createElement('script');
    technicalScript.type = 'text/javascript';
    technicalScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    technicalScript.async = true;
    
    // Add Technical Analysis configuration
    technicalScript.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isTransparent": false,
      "height": "400",
      "symbol": "BINANCE:BTCUSDT",
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": "dark"
    });
    
    // Clean up existing content and add technical analysis script
    if (technicalAnalysisRef.current) {
      // Remove any existing scripts
      const existingTechnicalScripts = technicalAnalysisRef.current.querySelectorAll('script');
      existingTechnicalScripts.forEach(script => script.remove());
      
      // Append new script
      technicalAnalysisRef.current.appendChild(technicalScript);
    }
    
    // Create Events Widget
    const eventsScript = document.createElement('script');
    eventsScript.type = 'text/javascript';
    eventsScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    eventsScript.async = true;
    
    // Add Events configuration
    eventsScript.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": false,
      "width": "100%",
      "height": "450",
      "locale": "en",
      "importanceFilter": "-1,0,1"
    });
    
    // Clean up existing content and add events widget script
    if (eventsWidgetRef.current) {
      // Remove any existing scripts
      const existingEventsScripts = eventsWidgetRef.current.querySelectorAll('script');
      existingEventsScripts.forEach(script => script.remove());
      
      // Append new script
      eventsWidgetRef.current.appendChild(eventsScript);
    }
    
    // Cleanup on unmount
    return () => {
      if (marketOverviewRef.current && marketScript.parentNode === marketOverviewRef.current) {
        marketOverviewRef.current.removeChild(marketScript);
      }
      if (technicalAnalysisRef.current && technicalScript.parentNode === technicalAnalysisRef.current) {
        technicalAnalysisRef.current.removeChild(technicalScript);
      }
      if (eventsWidgetRef.current && eventsScript.parentNode === eventsWidgetRef.current) {
        eventsWidgetRef.current.removeChild(eventsScript);
      }
    };
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Market Overview Widget */}
      <Card className="overflow-hidden rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] rounded-lg overflow-hidden" ref={marketOverviewRef}>
            <div className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Technical Analysis Widget */}
      <Card className="overflow-hidden rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg overflow-hidden" ref={technicalAnalysisRef}>
            <div className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Economic Events Widget */}
      <Card className="overflow-hidden rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl">Economic Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] rounded-lg overflow-hidden" ref={eventsWidgetRef}>
            <div className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
