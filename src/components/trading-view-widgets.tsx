
import React, { useEffect, useRef } from 'react';
import { useScript } from '@/hooks/use-script';

export function TradingViewWidgets() {
  const tradingViewScriptStatus = useScript('https://s3.tradingview.com/tv.js');
  const tickerScriptStatus = useScript('https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js');
  const marketOverviewScriptStatus = useScript('https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js');
  const technicalScriptStatus = useScript('https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js');
  const calendarScriptStatus = useScript('https://s3.tradingview.com/external-embedding/embed-widget-events.js');
  
  const advanced_chart = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const marketOverviewRef = useRef<HTMLDivElement>(null);
  const technicalRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tradingViewScriptStatus === 'ready' && advanced_chart.current) {
      // @ts-ignore
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
        container_id: advanced_chart.current.id
      });
    }
  }, [tradingViewScriptStatus, advanced_chart]);

  return (
    <div className="space-y-8">
      {/* Advanced Chart Widget */}
      <div className="widget-container rounded-lg overflow-hidden border border-gold/30">
        <div className="tradingview-widget-container">
          <div id="tradingview_advanced_chart" ref={advanced_chart}></div>
        </div>
      </div>
      
      {/* Ticker Tape Widget */}
      <div className="widget-container rounded-lg overflow-hidden border border-gold/30">
        <div className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget" ref={tickerRef}></div>
          <script type="text/javascript">
            {`{
              "symbols": [
                { "proName": "BINANCE:BTCUSDT", "title": "BTC/USDT" },
                { "proName": "BINANCE:ETHUSDT", "title": "ETH/USDT" },
                { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                { "proName": "NASDAQ:AAPL", "title": "AAPL" },
                { "proName": "NASDAQ:TSLA", "title": "TSLA" }
              ],
              "colorTheme": "dark",
              "isTransparent": false,
              "displayMode": "adaptive",
              "locale": "en"
            }`}
          </script>
        </div>
      </div>
      
      {/* Market Overview and Technical Analysis in a grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Overview Widget */}
        <div className="widget-container h-[450px] rounded-lg overflow-hidden border border-gold/30">
          <div className="tradingview-widget-container h-full">
            <div className="tradingview-widget-container__widget h-full" ref={marketOverviewRef}></div>
            <script type="text/javascript">
              {`{
                "colorTheme": "dark",
                "dateRange": "12M",
                "showChart": true,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": false,
                "width": "100%",
                "height": "100%",
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
              }`}
            </script>
          </div>
        </div>
        
        {/* Technical Analysis Widget */}
        <div className="widget-container h-[450px] rounded-lg overflow-hidden border border-gold/30">
          <div className="tradingview-widget-container h-full">
            <div className="tradingview-widget-container__widget h-full" ref={technicalRef}></div>
            <script type="text/javascript">
              {`{
                "interval": "1m",
                "width": "100%",
                "isTransparent": false,
                "height": "100%",
                "symbol": "BINANCE:BTCUSDT",
                "showIntervalTabs": true,
                "locale": "en",
                "colorTheme": "dark"
              }`}
            </script>
          </div>
        </div>
      </div>
      
      {/* Economic Calendar Widget */}
      <div className="widget-container h-[450px] rounded-lg overflow-hidden border border-gold/30">
        <div className="tradingview-widget-container h-full">
          <div className="tradingview-widget-container__widget h-full" ref={calendarRef}></div>
          <script type="text/javascript">
            {`{
              "colorTheme": "dark",
              "isTransparent": false,
              "width": "100%",
              "height": "100%",
              "locale": "en",
              "importanceFilter": "-1,0,1"
            }`}
          </script>
        </div>
      </div>
      
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Powered by TradingView
        </p>
      </div>
    </div>
  );
}

// Extend the window object with TradingView
declare global {
  interface Window {
    TradingView: any;
  }
}
