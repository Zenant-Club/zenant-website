import { MessageCircle, ListChecks, Home } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Message us on WhatsApp",
    description: "Start a conversation with us on WhatsApp — quick, easy, and convenient.",
  },
  {
    number: "02",
    icon: ListChecks,
    title: "Tell us your needs & budget",
    description: "Share your preferences, budget, location, and must-haves. We'll understand exactly what you're looking for.",
  },
  {
    number: "03",
    icon: Home,
    title: "Get shortlisted properties + owner contacts",
    description: "Receive verified properties that match your criteria, complete with direct owner contact details.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          How It Works in 3 Simple Steps
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-16 max-w-2xl mx-auto">
          From first chat to your dream home
        </p>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute top-32 left-0 right-0 h-1 bg-[#A04E3C]/20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#A04E3C] via-[#A04E3C] to-[#A04E3C]/20"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-[#A04E3C] rounded-full flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="font-heading-78 text-5xl text-[#A04E3C]/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-heading text-2xl text-[#3B2F2F] mb-4">
                    {step.title}
                  </h3>
                  <p className="font-lora text-[#3B2F2F]/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-[#FEF2E2] rounded-2xl p-6 border border-[#A04E3C]/20">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#A04E3C] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-heading-78 text-3xl text-[#A04E3C]/30 mb-2">
                      {step.number}
                    </div>
                    <h3 className="font-heading text-xl text-[#3B2F2F] mb-2">
                      {step.title}
                    </h3>
                    <p className="font-lora text-[#3B2F2F]/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
