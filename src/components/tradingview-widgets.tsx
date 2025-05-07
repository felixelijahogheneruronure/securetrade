
import { useEffect, useRef } from "react";

export function TradingViewWidgets() {
  const advancedChartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load TradingView script only once
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = initializeAdvancedChart;
    document.head.appendChild(script);
    
    // Clean up
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  const initializeAdvancedChart = () => {
    if (window.TradingView && advancedChartRef.current) {
      new window.TradingView.widget({
        width: "100%",
        height: 500,
        symbol: "BINANCE:BTCUSDT",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_advanced_chart"
      });
    }
  };
  
  return (
    <div ref={containerRef} className="mx-auto max-w-7xl px-4 py-12 space-y-8">
      <h2 className="text-center text-3xl font-bold mb-8 bg-gradient-to-r from-crypto-violet to-crypto-blue bg-clip-text text-transparent">
        Real-Time Market Analysis
      </h2>
      
      {/* Advanced Chart Widget */}
      <div className="rounded-xl overflow-hidden border border-border shadow-md">
        <div className="tradingview-widget-container">
          <div id="tradingview_advanced_chart" ref={advancedChartRef}></div>
        </div>
      </div>
      
      {/* Ticker Tape Widget */}
      <div className="rounded-xl overflow-hidden border border-border shadow-md">
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" 
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                symbols: [
                  { proName: "BINANCE:BTCUSDT", title: "BTC/USDT" },
                  { proName: "BINANCE:ETHUSDT", title: "ETH/USDT" },
                  { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
                  { proName: "NASDAQ:AAPL", title: "AAPL" },
                  { proName: "NASDAQ:TSLA", title: "TSLA" }
                ],
                colorTheme: "dark",
                isTransparent: false,
                displayMode: "adaptive",
                locale: "en"
              })
            }}
          />
        </div>
      </div>
      
      {/* Market Overview Widget */}
      <div className="rounded-xl overflow-hidden border border-border shadow-md">
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                colorTheme: "dark",
                dateRange: "12M",
                showChart: true,
                locale: "en",
                largeChartUrl: "",
                isTransparent: false,
                width: "100%",
                height: "450",
                plotLineColorGrowing: "rgba(0, 255, 0, 1)",
                plotLineColorFalling: "rgba(255, 0, 0, 1)",
                gridLineColor: "rgba(240, 243, 250, 0)",
                scaleFontColor: "rgba(120, 123, 134, 1)",
                belowLineFillColorGrowing: "rgba(0, 255, 0, 0.05)",
                belowLineFillColorFalling: "rgba(255, 0, 0, 0.05)",
                symbolActiveColor: "rgba(0, 255, 0, 0.15)",
                tabs: [
                  {
                    title: "Crypto",
                    symbols: [
                      { s: "BINANCE:BTCUSDT", d: "BTC" },
                      { s: "BINANCE:ETHUSDT", d: "ETH" },
                      { s: "BINANCE:BNBUSDT", d: "BNB" }
                    ],
                    originalTitle: "Crypto"
                  },
                  {
                    title: "Forex",
                    symbols: [
                      { s: "FX:EURUSD" },
                      { s: "FX:GBPUSD" },
                      { s: "FX:USDJPY" }
                    ],
                    originalTitle: "Forex"
                  }
                ]
              })
            }}
          />
        </div>
      </div>
      
      {/* Technical Analysis Widget */}
      <div className="rounded-xl overflow-hidden border border-border shadow-md">
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                interval: "1m",
                width: "100%",
                isTransparent: false,
                height: "450",
                symbol: "BINANCE:BTCUSDT",
                showIntervalTabs: true,
                locale: "en",
                colorTheme: "dark"
              })
            }}
          />
        </div>
      </div>
      
      {/* Economic Calendar Widget */}
      <div className="rounded-xl overflow-hidden border border-border shadow-md mb-8">
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                colorTheme: "dark",
                isTransparent: false,
                width: "100%",
                height: "450",
                locale: "en",
                importanceFilter: "-1,0,1"
              })
            }}
          />
        </div>
      </div>
    </div>
  );
}
