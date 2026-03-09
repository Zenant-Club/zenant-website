import { DollarSign, AlertTriangle, FileText, PhoneOff, CheckCircle2, Shield, Users, Zap } from "lucide-react";

const comparisons = [
  {
    problem: {
      icon: DollarSign,
      title: "High Brokerage Fees",
      description: "Paying one month's rent or more just to find a place drains your budget.",
    },
    solution: {
      icon: CheckCircle2,
      title: "Zero Brokerage",
      description: "Connect directly with property owners and keep your hard-earned money with you.",
    },
  },
  {
    problem: {
      icon: AlertTriangle,
      title: "Fake Listings",
      description: "Misleading photos and false availability waste your time and leave you frustrated.",
    },
    solution: {
      icon: Shield,
      title: "Verified Properties",
      description: "Every listing is verified by our team. What you see is what you get — no surprises.",
    },
  },
  {
    problem: {
      icon: FileText,
      title: "Endless Paperwork",
      description: "Complex agreements and countless documents make renting unnecessarily complicated.",
    },
    solution: {
      icon: Users,
      title: "Direct Owner Contact",
      description: "Chat directly with owners, ask questions, and negotiate — all without middlemen.",
    },
  },
  {
    problem: {
      icon: PhoneOff,
      title: "Unresponsive Owners",
      description: "Trying to reach property owners through middlemen leads to delays and miscommunication.",
    },
    solution: {
      icon: Zap,
      title: "Fast Matching via WhatsApp",
      description: "Get personalized matches instantly on WhatsApp. Simple, fast, and responsive.",
    },
  },
];

export function ProblemsVsSolutions() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] mb-4">
            The Zenant Difference
          </h2>
          <p className="font-lora text-lg text-[#3B2F2F]/70 max-w-2xl mx-auto">
            See how we transform your rental experience
          </p>
        </div>

        {/* Desktop: Side by Side Headers */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 mb-8">
          <div className="text-center">
            <h3 className="font-heading text-2xl text-red-600 mb-2">
              Challenges Tenants Face
            </h3>
            <div className="w-20 h-1 bg-red-600 mx-auto rounded"></div>
          </div>
          <div className="text-center">
            <h3 className="font-heading text-2xl text-green-600 mb-2">
              How Zenant Makes It Better
            </h3>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded"></div>
          </div>
        </div>

        {/* Comparison Items */}
        <div className="space-y-8 lg:space-y-6">
          {comparisons.map((comparison, index) => {
            const ProblemIcon = comparison.problem.icon;
            const SolutionIcon = comparison.solution.icon;
            
            return (
              <div key={index} className="relative">
                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
                  {/* Problem Card */}
                  <div className="bg-red-50/50 rounded-2xl p-6 border-2 border-red-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ProblemIcon className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading text-xl text-[#3B2F2F] mb-2">
                          {comparison.problem.title}
                        </h4>
                        <p className="font-lora text-[#3B2F2F]/70 leading-relaxed">
                          {comparison.problem.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow/VS Indicator */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className="w-12 h-12 bg-[#A04E3C] rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  {/* Solution Card */}
                  <div className="bg-green-50/50 rounded-2xl p-6 border-2 border-green-200 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <SolutionIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading text-xl text-[#3B2F2F] mb-2">
                          {comparison.solution.title}
                        </h4>
                        <p className="font-lora text-[#3B2F2F]/70 leading-relaxed">
                          {comparison.solution.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                  {/* Problem Card */}
                  <div className="bg-red-50/50 rounded-2xl p-5 border-2 border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <ProblemIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <h4 className="font-heading text-lg text-[#3B2F2F]">
                        {comparison.problem.title}
                      </h4>
                    </div>
                    <p className="font-lora text-sm text-[#3B2F2F]/70 leading-relaxed ml-12">
                      {comparison.problem.description}
                    </p>
                  </div>

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-[#A04E3C] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* Solution Card */}
                  <div className="bg-green-50/50 rounded-2xl p-5 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <SolutionIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-heading text-lg text-[#3B2F2F]">
                        {comparison.solution.title}
                      </h4>
                    </div>
                    <p className="font-lora text-sm text-[#3B2F2F]/70 leading-relaxed ml-12">
                      {comparison.solution.description}
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
