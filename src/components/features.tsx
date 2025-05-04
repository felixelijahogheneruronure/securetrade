
import { Check, Clock, Lock, Wallet } from "lucide-react";

const features = [
  {
    title: "Secure Trading",
    description: "Multi-layered security with 2FA, cold storage, and continuous monitoring.",
    icon: Lock,
  },
  {
    title: "Multi-Currency Wallets",
    description: "Store and manage multiple cryptocurrencies in one convenient location.",
    icon: Wallet,
  },
  {
    title: "Real-Time Trading",
    description: "Execute trades instantly with real-time market data and price feeds.",
    icon: Clock,
  },
  {
    title: "Verified Compliance",
    description: "KYC/AML compliant operations ensuring regulatory standards.",
    icon: Check,
  },
];

export function Features() {
  return (
    <div className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4">Why Choose BlockBridge?</h2>
          <p className="mx-auto max-w-2xl text-foreground/80">
            Our platform offers enterprise-grade security, user-friendly interfaces, and
            comprehensive tools for both beginners and experienced traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="flex flex-col items-center text-center rounded-xl p-6 bg-card shadow-sm border border-border/50 transition-all hover:shadow-md hover:border-primary/20 hover:translate-y-[-2px]"
            >
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
