import { DollarSign, AlertTriangle, FileText, PhoneOff } from "lucide-react";

const problems = [
  {
    icon: DollarSign,
    title: "High Brokerage Fees",
    description: "Paying one month's rent or more just to find a place drains your budget before you even move in.",
  },
  {
    icon: AlertTriangle,
    title: "Fake Listings",
    description: "Misleading photos and false availability waste your time and leave you frustrated.",
  },
  {
    icon: FileText,
    title: "Endless Paperwork",
    description: "Complex agreements, multiple visits, and countless documents make renting unnecessarily complicated.",
  },
  {
    icon: PhoneOff,
    title: "Unresponsive Owners",
    description: "Trying to reach property owners through middlemen leads to delays and miscommunication.",
  },
];

export function Problems() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <h2 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] text-center mb-4">
          Challenges Tenants Usually Face
        </h2>
        <p className="font-lora text-lg text-[#3B2F2F]/70 text-center mb-16 max-w-2xl mx-auto">
          Finding the perfect rental shouldn't be this hard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="bg-[#FEF2E2] rounded-2xl p-6 border border-red-200 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-heading text-xl text-[#3B2F2F] mb-3">
                  {problem.title}
                </h3>
                <p className="font-lora text-[#3B2F2F]/70 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
