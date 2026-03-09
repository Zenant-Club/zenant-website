import { Briefcase, Mail } from "lucide-react";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

const openings = [
  {
    title: "Property Success Associate",
    type: "Full-time",
    location: "Remote / Bengaluru",
    description:
      "Help tenants discover the right homes, support owner communication, and deliver a smooth move-in experience.",
  },
  {
    title: "Content & Listings Coordinator",
    type: "Full-time",
    location: "Bengaluru",
    description:
      "Curate and maintain verified property listings with clear details, visuals, and tenant-first quality checks.",
  },
  {
    title: "Growth Marketing Intern",
    type: "Internship",
    location: "Remote",
    description:
      "Support campaigns, community growth, and performance tracking to bring more high-intent renters to Zenant.",
  },
];

export function CareersPage() {
  return (
    <>
      <main className="pt-28 pb-20 lg:pt-32 lg:pb-28">
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mb-12">
            <p className="font-lora text-[#A04E3C] mb-3">Careers at Zenant</p>
            <h1 className="font-heading-78 text-4xl md:text-5xl text-[#3B2F2F] mb-5 leading-tight">
              Build the Future of Renting
            </h1>
            <p className="font-lora text-lg text-[#3B2F2F]/80 leading-relaxed">
              We are building a tenant-first rental experience. If you love solving
              real problems and creating impact, we would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {openings.map((opening) => (
              <article
                key={opening.title}
                className="bg-white rounded-2xl p-6 border border-[#3B2F2F]/10 shadow-sm"
              >
                <div className="w-10 h-10 bg-[#A04E3C]/10 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5 text-[#A04E3C]" />
                </div>
                <h2 className="font-heading text-xl text-[#3B2F2F] mb-2">{opening.title}</h2>
                <p className="font-lora text-sm text-[#3B2F2F]/70 mb-3">
                  {opening.type} • {opening.location}
                </p>
                <p className="font-lora text-[#3B2F2F]/80 leading-relaxed">{opening.description}</p>
              </article>
            ))}
          </div>

          <a
            href="mailto:careers@zenant.in"
            className="inline-flex items-center gap-3 bg-[#A04E3C] text-white px-7 py-3.5 rounded-full font-lora hover:bg-[#8d4434] transition-colors"
          >
            <Mail className="w-5 h-5" />
            Apply at careers@zenant.in
          </a>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}