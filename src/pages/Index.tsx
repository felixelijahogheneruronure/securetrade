
import React from "react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { TradingViewWidgets } from "@/components/trading-view-widgets";
import { TradeNotifications } from "@/components/trade-notifications";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* TradingView Widgets Section */}
      <div className="py-12 px-4 md:px-8 bg-black">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="gold-gradient-text mb-4">Real-Time Market Analysis</h2>
            <p className="mx-auto max-w-2xl text-foreground/80">
              Stay informed with live charts, technical analysis, and market data from trusted sources.
            </p>
          </div>
          <TradingViewWidgets />
        </div>
      </div>
      
      {/* Features Section */}
      <Features />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Initialize trade notifications */}
      <TradeNotifications />
    </div>
  );
};

export default Index;
