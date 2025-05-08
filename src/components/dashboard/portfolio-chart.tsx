
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PortfolioChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Don't execute during SSR
    if (!containerRef.current) return;
    
    // Create TradingView script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    
    // Add configuration
    script.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isTransparent": false,
      "height": "400",
      "symbol": "BINANCE:BTCUSDT",
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": "dark"
    });
    
    // Clean up existing content and add new script
    if (containerRef.current) {
      // Remove any existing scripts
      const existingScripts = containerRef.current.querySelectorAll('script');
      existingScripts.forEach(script => script.remove());
      
      // Append new script
      containerRef.current.appendChild(script);
    }
    
    // Cleanup on unmount
    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script);
      }
    };
  }, []);
  
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl">Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] rounded-lg overflow-hidden" ref={containerRef}>
          <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
