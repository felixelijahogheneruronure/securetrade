
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-black">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-gold/10 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute top-1/2 -left-48 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 py-24 md:py-32 lg:py-40 relative z-0">
        <div className="text-center">
          <h1 className="mb-6 gold-gradient-text">
            SECURE TRADE
          </h1>
          <p className="text-2xl mb-4 font-semibold text-white">Trade Crypto with Complete Security</p>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/80 md:text-xl">
            SECURE TRADE provides an enterprise-grade platform for buying, 
            selling, and managing your digital assets with uncompromising security and reliability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="px-8 rounded-full bg-gold hover:bg-gold/80 text-black">
              <Link to="/register">Start Trading</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 rounded-full border-gold text-gold hover:bg-gold/10">
              <Link to="/market" className="flex items-center gap-2">
                Explore Markets <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats panel */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Cryptocurrencies", value: "100+" },
            { label: "Countries", value: "150+" },
            { label: "Users", value: "1M+" },
            { label: "Daily Volume", value: "$287M" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-black/80 backdrop-blur-lg border border-gold/30 rounded-xl p-6 text-center transition-all hover:shadow-glow"
            >
              <p className="text-2xl font-bold md:text-3xl gold-gradient-text">{stat.value}</p>
              <p className="text-sm text-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
