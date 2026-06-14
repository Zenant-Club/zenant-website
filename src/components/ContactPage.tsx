import { Phone, MessageCircle } from "lucide-react";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

const contacts = [
  {
    label: "For Tenants",
    description: "Looking for a home without the deposit burden? Chat with us.",
    phone: "+91 80504 10310",
    whatsapp: "918050410310",
  },
  {
    label: "For Home Owners",
    description: "Want to list your property and reach more qualified tenants?",
    phone: "+91 63613 69764",
    whatsapp: "916361369764",
  },
];

export function ContactPage() {
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
              style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.25rem" }}
            >
              Contact Us
            </p>
            <h1
              className="font-heading-78 text-[#3B2F2F]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.1,
                marginBottom: "2rem",
                maxWidth: "40rem",
              }}
            >
              We're Here to Help
            </h1>
            <p
              className="font-lora text-[#3B2F2F]"
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.75,
                opacity: 0.9,
                maxWidth: "36rem",
              }}
            >
              Whether you're a tenant searching for your next home or a home
              owner looking to list — reach out and we'll get back to you
              promptly.
            </p>
          </div>
        </section>

        {/* ── Contact Cards ─────────────────────────────────────── */}
        <section
          className="bg-white py-14 md:py-20"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
                maxWidth: "56rem",
              }}
            >
              {contacts.map((contact) => (
                <div
                  key={contact.label}
                  className="bg-[#FEF2E2]"
                  style={{
                    borderRadius: "1.25rem",
                    padding: "2.5rem",
                    border: "1px solid rgba(59,47,47,0.1)",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      background: "rgba(160,78,60,0.12)",
                      borderRadius: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <Phone style={{ width: "1.5rem", height: "1.5rem", color: "#A04E3C" }} />
                  </div>

                  {/* Label */}
                  <p
                    className="font-lora text-[#A04E3C]"
                    style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}
                  >
                    {contact.label}
                  </p>

                  {/* Description */}
                  <p
                    className="font-lora text-[#3B2F2F]"
                    style={{ fontSize: "1rem", lineHeight: 1.7, opacity: 0.72, marginBottom: "1.75rem" }}
                  >
                    {contact.description}
                  </p>

                  {/* Phone number */}
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="font-heading-78 text-[#3B2F2F]"
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "1.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {contact.phone}
                  </a>

                  {/* WhatsApp CTA */}
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-lora"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      background: "#A04E3C",
                      color: "#fff",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "9999px",
                      fontWeight: 500,
                      fontSize: "1rem",
                      textDecoration: "none",
                    }}
                  >
                    <MessageCircle style={{ width: "1.1rem", height: "1.1rem" }} />
                    Chat on WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
