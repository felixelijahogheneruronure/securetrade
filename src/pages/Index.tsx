
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Testimonials } from "@/components/testimonials";
import { TradingViewWidgets } from "@/components/tradingview-widgets";

const Index = () => {
  return (
    <div>
      <Hero />
      <Features />
      <TradingViewWidgets />
      <Testimonials />
    </div>
  );
};

export default Index;
