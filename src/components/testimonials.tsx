
export function Testimonials() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4">What Our Users Say</h2>
          <p className="mx-auto max-w-2xl text-foreground/80">
            Join thousands of satisfied users who trust BlockBridge for their cryptocurrency needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              quote: "BlockBridge has completely transformed how I manage my crypto investments. The interface is intuitive and the security features give me peace of mind.",
              name: "Sarah K.",
              title: "Crypto Investor",
            },
            {
              quote: "As someone new to crypto, I found BlockBridge to be surprisingly easy to use. Their customer support is also top-notch whenever I have questions.",
              name: "Michael R.",
              title: "New Trader",
            },
            {
              quote: "The real-time analytics and trading features are unmatched. I've tried several platforms and BlockBridge offers the best experience by far.",
              name: "Elena T.",
              title: "Day Trader",
            },
          ].map((testimonial, index) => (
            <div 
              key={index} 
              className="flex flex-col h-full rounded-xl glass p-8"
            >
              <blockquote className="flex-grow">
                <p className="text-foreground/90 italic mb-6">"{testimonial.quote}"</p>
              </blockquote>
              <div className="mt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-foreground/70">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
