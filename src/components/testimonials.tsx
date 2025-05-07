
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Testimonials() {
  return (
    <div className="py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4 gold-gradient-text">What Our Users Say</h2>
          <p className="mx-auto max-w-2xl text-foreground/80">
            Join thousands of satisfied users who trust SECURE TRADE for their cryptocurrency needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote: "SECURE TRADE has completely transformed how I manage my crypto investments. The interface is intuitive and the security features give me peace of mind.",
              name: "Sarah K.",
              title: "Crypto Investor",
              country: "United States",
              initials: "SK",
            },
            {
              quote: "As someone new to crypto, I found SECURE TRADE to be surprisingly easy to use. Their customer support is also top-notch whenever I have questions.",
              name: "Michael R.",
              title: "New Trader",
              country: "United Kingdom",
              initials: "MR",
            },
            {
              quote: "The real-time analytics and trading features are unmatched. I've tried several platforms and SECURE TRADE offers the best experience by far.",
              name: "Elena T.",
              title: "Day Trader",
              country: "Germany",
              initials: "ET",
            },
            {
              quote: "Muito satisfeito com a velocidade das transações e a segurança da plataforma. Consigo operar 24 horas por dia sem preocupações.",
              name: "João Silva",
              title: "Trader Profissional",
              country: "Brazil",
              initials: "JS",
            },
            {
              quote: "Como analista de mercado, preciso de dados confiáveis. A SECURE TRADE oferece as melhores ferramentas de análise que já utilizei.",
              name: "Ana Beatriz",
              title: "Analista de Mercado",
              country: "Brazil",
              initials: "AB",
            },
            {
              quote: "A interface do SECURE TRADE é extremamente intuitiva. Recomendo para todos que estão começando no mundo das criptomoedas.",
              name: "Rafael Costa",
              title: "Investidor",
              country: "Brazil",
              initials: "RC",
            },
          ].map((testimonial, index) => (
            <div 
              key={index} 
              className="flex flex-col h-full rounded-xl bg-black/80 backdrop-blur-sm border border-gold/20 p-8 transition-all hover:border-gold/40"
            >
              <blockquote className="flex-grow">
                <p className="text-foreground/90 italic mb-6">"{testimonial.quote}"</p>
              </blockquote>
              <div className="mt-4 flex items-center">
                <Avatar className="bg-gold text-black h-10 w-10 mr-3">
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-foreground/70">{testimonial.title}, {testimonial.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
