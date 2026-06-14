import { Briefcase, Mail, FileText } from "lucide-react";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

export function CareersPage() {
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
              Careers at Zenant
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
              Build the Future of Renting
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
              We are building a tenant-first rental experience. If you love
              solving real problems and creating impact, we would love to hear
              from you.
            </p>
          </div>
        </section>

        {/* ── Open Role ────────────────────────────────────────── */}
        <section
          className="bg-white py-14 md:py-20"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <p
              className="font-lora text-[#A04E3C]"
              style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "2rem" }}
            >
              Open Role
            </p>

            <article
              className="bg-[#FEF2E2]"
              style={{
                borderRadius: "1rem",
                padding: "2.5rem",
                border: "1px solid rgba(59,47,47,0.1)",
                maxWidth: "42rem",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "rgba(160,78,60,0.12)",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <Briefcase style={{ width: "1.5rem", height: "1.5rem", color: "#A04E3C" }} />
              </div>

              <h2
                className="font-heading text-[#3B2F2F]"
                style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}
              >
                Business Development Executive
              </h2>

              <p
                className="font-lora text-[#3B2F2F]"
                style={{ fontSize: "1rem", opacity: 0.6, marginBottom: "1.25rem" }}
              >
                Full-time &nbsp;•&nbsp; Bengaluru
              </p>

              <p
                className="font-lora text-[#3B2F2F]"
                style={{ fontSize: "1.125rem", lineHeight: 1.75, opacity: 0.8, marginBottom: "1.5rem" }}
              >
                Drive growth by managing property visits, engaging prospective tenants, and converting leads into bookings. Deliver a transparent, hassle-free rental experience while building trust and representing Zenant on the ground.
              </p>

              <a
                href="/Zenant_Business_Development_Executive_JD_Cleaned.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-lora"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#A04E3C",
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                <FileText style={{ width: "1.2rem", height: "1.2rem" }} />
                View JD
              </a>
            </article>
          </div>
        </section>

        {/* ── Apply CTA ─────────────────────────────────────────── */}
        <section
          className="bg-[#FEF2E2] py-14 md:py-20"
        >
          <div
            className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12"
          >
            <div
              className="bg-[#3B2F2F] flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-8"
              style={{
                borderRadius: "1.5rem",
                padding: "2.5rem 1.5rem",
              }}
            >
              <div style={{ flex: 1, minWidth: "260px" }}>
                <h2
                  className="font-heading-78 text-white"
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    lineHeight: 1.3,
                    marginBottom: "1rem",
                  }}
                >
                  Interested? We'd love to hear from you.
                </h2>
                <p
                  className="font-lora text-white"
                  style={{ fontSize: "1.125rem", lineHeight: 1.7, opacity: 0.75 }}
                >
                  Send your resume and a short note about yourself to our careers inbox.
                </p>
              </div>
              <a
                href="mailto:shreya@zenant.club"
                className="font-lora"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background: "#A04E3C",
                  color: "#fff",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "9999px",
                  fontWeight: 500,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                <Mail style={{ width: "1.2rem", height: "1.2rem" }} />
                Apply at shreya@zenant.club
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  );
}