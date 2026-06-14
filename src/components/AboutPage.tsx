import { MessageCircle } from "lucide-react";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

export function AboutPage() {
  return (
    <>
      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section
          className="bg-[#FEF2E2] pt-28 md:pt-36 pb-16 md:pb-20"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <p
              className="font-lora text-[#A04E3C]"
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
              }}
            >
              About Zenant
            </p>
            <h1
              className="font-heading-78 text-[#3B2F2F]"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.2,
                marginBottom: "2rem",
                maxWidth: "48rem",
              }}
            >
              Renting a home in Bengaluru shouldn't feel like a second job.
            </h1>
            <p
              className="font-lora text-[#3B2F2F]"
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.75,
                opacity: 0.9,
                maxWidth: "40rem",
              }}
            >
              Zenant makes it simple, honest, and fully handled — for tenants and landlords alike.
            </p>
          </div>
        </section>

        {/* ── Who We Are ───────────────────────────────────────── */}
        <section
          className="bg-white py-16 md:py-24"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <h2
              className="font-heading-78 text-[#3B2F2F]"
              style={{
                fontSize: "2.5rem",
                marginBottom: "2rem",
              }}
            >
              Who we are
            </h2>
            <div className="max-w-4xl">
              <p className="font-lora text-[#3B2F2F] text-xl leading-relaxed mb-6 opacity-90">
                Zenant is an AI-first residential rental brokerage based in Bengaluru. We help people find homes they actually want to live in, and we help landlords fill them with the right tenants — without the chaos, the chasing, or the guesswork that usually comes with renting in this city.
              </p>
              <p className="font-lora text-[#3B2F2F] text-xl leading-relaxed opacity-90">
                We're a full-service brokerage, which means we don't just hand you a list and disappear. We stay with you across the entire journey: understanding what you're looking for, shortlisting the right properties, coordinating visits, and seeing you through to move-in day. Today we work across South Bengaluru — HSR, Koramangala, BTM, Madiwala, Silk Board, Teachers Colony, and ITI Layout — with plans to grow well beyond it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why We Exist ─────────────────────────────────────── */}
        <section
          className="bg-[#3B2F2F] py-16 md:py-24"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <h2
              className="font-heading-78 text-white"
              style={{
                fontSize: "2.5rem",
                marginBottom: "2rem",
              }}
            >
              Why we exist
            </h2>
            <div className="max-w-4xl">
              <p className="font-lora text-white text-xl leading-relaxed mb-6 opacity-90">
                Most rental experiences in India run on missed calls, half-answered WhatsApp messages, and visits to properties that were never right in the first place. Tenants waste weekends. Landlords lose good leads to slow follow-ups. Everyone ends up frustrated.
              </p>
              <p className="font-lora text-white text-xl leading-relaxed opacity-90">
                We started Zenant in Jan 2026 to fix that — to bring real service quality to a part of life that badly needs it. Not flashier listings or louder marketing, but the boring, dependable things that actually matter: picking up the phone, knowing the inventory, telling you the truth about a property, and following through on what we promised.
              </p>
            </div>
          </div>
        </section>

        {/* ── What Makes Us Different ──────────────────────────── */}
        <section
          className="bg-white py-16 md:py-24"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <h2
              className="font-heading-78 text-[#3B2F2F]"
              style={{
                fontSize: "2.5rem",
                marginBottom: "1.5rem",
              }}
            >
              What makes us different
            </h2>
            <p className="font-lora text-[#3B2F2F] text-xl mb-12 opacity-90">
              It comes down to how we work, not what we charge.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl">
              <div
                className="bg-[#FEF2E2] rounded-2xl border border-[rgba(59,47,47,0.1)]"
                style={{ padding: "1.75rem" }}
              >
                <h3 className="font-heading text-2xl text-[#3B2F2F] font-bold mb-4">
                  We're genuinely full-service.
                </h3>
                <p className="font-lora text-[#3B2F2F] text-lg leading-relaxed opacity-80">
                  From your first enquiry to the day you get the keys, you have a team that knows your case and owns it end to end.
                </p>
              </div>

              <div
                className="bg-[#FEF2E2] rounded-2xl border border-[rgba(59,47,47,0.1)]"
                style={{ padding: "1.75rem" }}
              >
                <h3 className="font-heading text-2xl text-[#3B2F2F] font-bold mb-4">
                  Technology does the chasing, people do the caring.
                </h3>
                <p className="font-lora text-[#3B2F2F] text-lg leading-relaxed opacity-80">
                  Our AI assistant, Zen, handles over 100 enquiries a day on WhatsApp — answering instantly, qualifying needs, and making sure no one falls through the cracks. That frees our agents to do the part that can't be automated: understanding people and closing the right match.
                </p>
              </div>

              <div
                className="bg-[#FEF2E2] rounded-2xl border border-[rgba(59,47,47,0.1)]"
                style={{ padding: "1.75rem" }}
              >
                <h3 className="font-heading text-2xl text-[#3B2F2F] font-bold mb-4">
                  We work for both sides.
                </h3>
                <p className="font-lora text-[#3B2F2F] text-lg leading-relaxed opacity-80">
                  Tenants get an advocate who's actually looking out for them. Landlords get reliable inventory marketing, qualified tenants, and a partner focused on long, low-friction tenancies — not just a quick deal.
                </p>
              </div>

              <div
                className="bg-[#FEF2E2] rounded-2xl border border-[rgba(59,47,47,0.1)]"
                style={{ padding: "1.75rem" }}
              >
                <h3 className="font-heading text-2xl text-[#3B2F2F] font-bold mb-4">
                  We make the hard parts easy.
                </h3>
                <p className="font-lora text-[#3B2F2F] text-lg leading-relaxed opacity-80">
                  Through trusted partners, we can help with zero-deposit options, furnishing, and even moving — so settling in is as smooth as finding the place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Where We're Headed ───────────────────────────────── */}
        <section
          className="bg-[#FEF2E2] py-16 md:py-24"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <div
              className="bg-[#A04E3C] flex flex-wrap items-center gap-10"
              style={{
                borderRadius: "1.5rem",
                padding: "2.5rem 1.5rem",
              }}
            >
              <div className="w-full md:flex-1" style={{ minWidth: "260px" }}>
                <h2
                  className="font-heading-78 text-white"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 1.2,
                    marginBottom: "1.5rem",
                  }}
                >
                  Where we're headed
                </h2>
                <p
                  className="font-lora text-white"
                  style={{ fontSize: "1.25rem", lineHeight: 1.7, opacity: 0.9, maxWidth: "48rem", marginBottom: "2.5rem" }}
                >
                  We're building Zenant into the most trusted name in residential renting in India — starting in Bengaluru, expanding city by city, and one day helping people buy homes the same way we help them rent today. Same principle, every step: do the work properly, and treat people like the decision matters.
                </p>
                <a
                  href="https://wa.me/918050410310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-lora"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "#fff",
                    color: "#A04E3C",
                    padding: "1rem 2rem",
                    borderRadius: "9999px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "background 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#FEF2E2";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 6px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#fff";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <MessageCircle style={{ width: "1.2rem", height: "1.2rem" }} />
                  Chat with Zenant
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
