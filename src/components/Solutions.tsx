import { CheckCircle2, Shield, Users, Zap } from "lucide-react";

const solutions = [
  {
    icon: CheckCircle2,
    title: "Zero Brokerage",
    description: "Connect directly with property owners and keep your hard-earned money where it belongs — with you.",
  },
  {
    icon: Shield,
    title: "Verified Properties",
    description: "Every listing is verified by our team. What you see is what you get — no surprises, no scams.",
  },
  {
    icon: Users,
    title: "Direct Owner Contact",
    description: "Chat directly with owners, ask questions, schedule visits, and negotiate — all without middlemen.",
  },
  {
    icon: Zap,
    title: "Fast Matching via WhatsApp",
    description: "Tell us your needs and we'll send personalized matches instantly on WhatsApp. Simple and fast.",
  },
];

export function Solutions() {
  return (
    <section className="py-20 lg:py-28 bg-[#FEF2E2]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          How Zenant Makes It Better
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-16 max-w-2xl mx-auto">
          Your rental journey, simplified
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-[#A04E3C]/20 hover:shadow-xl hover:border-[#A04E3C]/40 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-heading text-xl text-[#3B2F2F] mb-3">
                  {solution.title}
                </h3>
                <p className="font-lora text-[#3B2F2F]/70 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
