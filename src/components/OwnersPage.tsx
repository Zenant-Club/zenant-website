import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarCheck, KeyRound, MapPin, Megaphone, MessageCircle, Phone, UserCheck } from "lucide-react";
import { Footer } from "./Footer";
import { OWNER_PHONE, ownerWhatsAppLink } from "./ownerContact";

// For landlords and property owners. The printed owner card's QR lands here
// (www.zenant.club/card -> /owners?utm_source=owner_card, see api/qr.ts).
//
// Styling note: src/index.css is pre-built Tailwind, so only classes the site already used exist.
// Anything else here is an inline style or lives in src/styles/ownersPage.css.

const benefits = [
  {
    icon: Megaphone,
    title: "Seen by people ready to rent",
    description:
      "We list your home on zenant.club and share it with the renters who message us every day. Zen, our WhatsApp assistant, handles over 100 rental enquiries a day.",
  },
  {
    icon: UserCheck,
    title: "Only tenants worth meeting",
    description:
      "We check every enquiry for budget, move-in date and fit before it reaches you, so you're not fielding calls from people who were never going to rent.",
  },
  {
    icon: CalendarCheck,
    title: "Visits arranged for you",
    description:
      "We schedule viewings around your availability, coordinate them with shortlisted tenants and follow up with each one afterwards.",
  },
  {
    icon: KeyRound,
    title: "Tenants who stay",
    description:
      "We match for fit, not a quick deal, and stay involved until move-in, so your home goes to someone who wants to live there for the long run.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about your property",
    description: "Message us on WhatsApp with the location, the rent you're expecting and a few photos.",
  },
  {
    number: "02",
    title: "We market it and screen enquiries",
    description: "Your home goes in front of renters looking in your area, and we qualify every enquiry.",
  },
  {
    number: "03",
    title: "Meet the right tenant",
    description: "We line up visits with shortlisted tenants and see it through to move-in day.",
  },
];

const areas = [
  "HSR Layout",
  "Koramangala",
  "BTM Layout",
  "Madiwala",
  "Silk Board",
  "Teachers Colony",
  "ITI Layout",
];

const softBorder = "1px solid rgba(59,47,47,0.1)";

export function OwnersPage() {
  const { search } = useLocation();
  const [fromCard, setFromCard] = useState(false);

  // Read after hydration: the prerendered page is built without the query string,
  // so the first render has to match it
  useEffect(() => {
    setFromCard(new URLSearchParams(search).get("utm_source") === "owner_card");
  }, [search]);

  const whatsappLink = ownerWhatsAppLink(fromCard);
  const phoneLink = `tel:${OWNER_PHONE.replace(/\s/g, "")}`;

  return (
    <>
      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-[#FEF2E2] pt-28 md:pt-36 pb-16 md:pb-20">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <p
              className="font-lora text-[#A04E3C]"
              style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.25rem" }}
            >
              For Property Owners
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
              Let the right tenant find your home.
            </h1>
            <p
              className="font-lora text-[#3B2F2F]"
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.75,
                opacity: 0.9,
                maxWidth: "40rem",
                marginBottom: "2.5rem",
              }}
            >
              Zenant markets your property, screens every enquiry and arranges visits, so you only
              spend time on tenants who are serious about renting it.
            </p>
            <div className="flex items-center gap-4" style={{ flexWrap: "wrap" }}>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex whatsapp-cta-btn whatsapp-cta-btn-large"
              >
                <span className="whatsapp-cta-icon">
                  <MessageCircle aria-hidden="true" />
                </span>
                <span className="whatsapp-cta-label">List Your Property</span>
              </a>
              <a href={phoneLink} className="owners-outline-btn font-lora">
                <Phone className="w-5 h-5 text-[#A04E3C]" aria-hidden="true" />
                Call {OWNER_PHONE}
              </a>
            </div>
          </div>
        </section>

        {/* ── What owners get ──────────────────────────────────── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <h2 className="font-heading-78 text-[#3B2F2F]" style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
              What you get with Zenant
            </h2>
            <p className="font-lora text-[#3B2F2F] text-xl mb-12 max-w-3xl" style={{ opacity: 0.9 }}>
              We do the chasing, the screening and the scheduling. You decide who moves in.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ maxWidth: "72rem" }}>
              {benefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-[#FEF2E2] rounded-2xl"
                  style={{ padding: "1.75rem", border: softBorder }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "0.875rem",
                      background: "rgba(160,78,60,0.12)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#A04E3C]" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading text-2xl text-[#3B2F2F] mb-4" style={{ fontWeight: 700 }}>
                    {title}
                  </h3>
                  <p className="font-lora text-[#3B2F2F] text-lg leading-relaxed" style={{ opacity: 0.8 }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section className="bg-[#3B2F2F] py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <h2 className="font-heading-78 text-white" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
              How it works
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2.5rem", maxWidth: "72rem" }}>
              {steps.map((step) => (
                <li key={step.number}>
                  <div className="font-heading-78 text-5xl mb-4" style={{ color: "#D97F4E" }}>
                    {step.number}
                  </div>
                  <h3 className="font-heading text-2xl text-white" style={{ marginBottom: "0.75rem" }}>
                    {step.title}
                  </h3>
                  <p className="font-lora text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Where we work ────────────────────────────────────── */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <h2 className="font-heading-78 text-[#3B2F2F]" style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
              Where we work
            </h2>
            <p className="font-lora text-[#3B2F2F] text-xl mb-8 max-w-3xl" style={{ opacity: 0.9 }}>
              Today we rent out homes across South Bengaluru. Own a property somewhere else in the
              city? Message us anyway, we're growing.
            </p>
            <ul className="flex gap-3" style={{ flexWrap: "wrap", maxWidth: "56rem" }}>
              {areas.map((area) => (
                <li
                  key={area}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FEF2E2] py-2 font-lora text-[#3B2F2F]"
                  style={{ border: softBorder, paddingLeft: "1rem", paddingRight: "1rem" }}
                >
                  <MapPin className="w-4 h-4 text-[#A04E3C]" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Get in touch ─────────────────────────────────────── */}
        <section className="bg-[#FEF2E2] py-16 md:py-24">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="bg-[#A04E3C]" style={{ borderRadius: "1.5rem", padding: "2.5rem 1.5rem" }}>
              <h2
                className="font-heading-78 text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2, marginBottom: "1.5rem" }}
              >
                Have a home to rent out?
              </h2>
              <p
                className="font-lora text-white"
                style={{ fontSize: "1.25rem", lineHeight: 1.7, opacity: 0.9, maxWidth: "40rem", marginBottom: "2.5rem" }}
              >
                Message our owner team on WhatsApp or give us a call. We'll take it from there.
              </p>
              <div className="flex items-center gap-4" style={{ flexWrap: "wrap" }}>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-[#A04E3C] px-8 py-4 rounded-full font-lora font-medium hover:bg-[#FEF2E2] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
                <a href={phoneLink} className="owners-outline-btn owners-outline-btn--light font-lora">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  {OWNER_PHONE}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
