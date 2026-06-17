import { UserX, MonitorOff, FileX, MessageSquareOff, ShieldCheck, Home, FileCheck, Headphones, ArrowDown } from "lucide-react";

const comparisons = [
  {
    problem: {
      icon: UserX,
      title: "Unreliable brokerage",
      description: "Paying brokerage doesn't guarantee genuine listings, timely responses, or real assistance.",
    },
    solution: {
      icon: ShieldCheck,
      title: "Trusted rental partner",
      description: "Verified properties, transparent communication, and dedicated support throughout.",
    },
  },
  {
    problem: {
      icon: MonitorOff,
      title: "Fake listings",
      description: "Misleading photos, wrong info, and unavailable properties waste your time and cause frustration.",
    },
    solution: {
      icon: Home,
      title: "Verified properties",
      description: "Every property is checked by our team for accurate info and genuine availability.",
    },
  },
  {
    problem: {
      icon: FileX,
      title: "Complex paperwork",
      description: "Rental agreements and documentation can be confusing and time-consuming to manage.",
    },
    solution: {
      icon: FileCheck,
      title: "Easy documentation",
      description: "We handle the paperwork so you can focus on finding your perfect home, not forms.",
    },
  },
  {
    problem: {
      icon: MessageSquareOff,
      title: "Poor communication",
      description: "Delays in responses from owners and brokers make renting stressful and unreliable.",
    },
    solution: {
      icon: Headphones,
      title: "Dedicated assistance",
      description: "Our team coordinates with owners and provides quick updates at every step of your rental journey.",
    },
  },
];

export function ProblemsVsSolutions() {
  return (
    <section className="py-20 lg:py-28 bg-transparent">
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
                        <div className="text-red-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Challenge
                        </div>
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
                        <div className="text-green-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                          Zenant Solution
                        </div>
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
                <div className="lg:hidden">
                  <div className="rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Challenge Section */}
                    <div className="bg-red-50/50 p-5 border-b border-gray-100">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ProblemIcon className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="pt-0.5">
                          <div className="text-red-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                            Challenge
                          </div>
                          <h4 className="font-heading text-[17px] text-[#3B2F2F] leading-tight">
                            {comparison.problem.title}
                          </h4>
                        </div>
                      </div>
                      <p className="font-lora text-[#3B2F2F]/70 text-sm leading-relaxed ml-[52px]">
                        {comparison.problem.description}
                      </p>
                    </div>

                    {/* Divider Badge Wrapper */}
                    <div className="relative flex justify-center z-10 h-0">
                      <div className="absolute w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center border-[3px] border-white shadow-sm" style={{ top: '-16px' }}>
                        <ArrowDown className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Solution Section */}
                    <div className="bg-green-50/50 p-5">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <SolutionIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="pt-0.5">
                          <div className="text-green-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                            Zenant Solution
                          </div>
                          <h4 className="font-heading text-[17px] text-[#3B2F2F] leading-tight">
                            {comparison.solution.title}
                          </h4>
                        </div>
                      </div>
                      <p className="font-lora text-[#3B2F2F]/70 text-sm leading-relaxed ml-[52px]">
                        {comparison.solution.description}
                      </p>
                    </div>
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
