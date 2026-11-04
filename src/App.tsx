import { useEffect } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { House } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { ProblemsVsSolutions } from "./components/ProblemsVsSolutions";
import { HowItWorks } from "./components/HowItWorks";
import { BrowseByArea } from "./components/BrowseByArea";
import { PropertiesGallery } from "./components/PropertiesGallery";
import { ExplorePage } from "./components/ExplorePage";
import { Testimonials } from "./components/Testimonials";
import { CareersPage } from "./components/CareersPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { NOT_FOUND_META, SITE_URL, pageMetaFor } from "./components/pageMeta";
import { findRentPage } from "./components/rentPages";

function HomePage() {
  const heroImage = "/hero-bg.png";

  return (
    <>
      <Hero backgroundImage={heroImage} />
      <ProblemsVsSolutions />
      <HowItWorks />
      <BrowseByArea />
      <PropertiesGallery />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}

// An area or budget page is the Explore page narrowed to its homes
function RentPageRoute() {
  const { slug } = useParams();
  const page = findRentPage(slug || "");
  return page ? <ExplorePage key={page.slug} page={page} /> : <NotFoundPage />;
}

function NotFoundPage() {
  return (
    <>
      <main className="bg-[#FEF2E2] pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <h1
            className="font-heading-78 text-[#3B2F2F]"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.2, marginBottom: "1.5rem" }}
          >
            Page not found
          </h1>
          <p
            className="font-lora text-[#3B2F2F]"
            style={{ fontSize: "1.25rem", lineHeight: 1.75, opacity: 0.9, maxWidth: "40rem", marginBottom: "2rem" }}
          >
            This page doesn't exist or has moved. Take a look at our rental homes in Bengaluru instead.
          </p>
          <Link to="/explore" className="inline-flex whatsapp-cta-btn">
            <span className="whatsapp-cta-icon">
              <House aria-hidden="true" />
            </span>
            <span className="whatsapp-cta-label">Explore Homes</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const sectionId = location.hash.slice(1);
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return null;
}

// Sets or creates a <meta> / <link> tag in <head>
function setHeadTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let tag = document.head.querySelector<HTMLElement>(selector);
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
}

const metaTag = (key: "name" | "property", name: string) => () => {
  const tag = document.createElement("meta");
  tag.setAttribute(key, name);
  return tag;
};

// Title, description and canonical URL for the current route; unknown paths are kept out of search
function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const meta = pageMetaFor(path);
    const { title, description } = meta || NOT_FOUND_META;
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;
    setHeadTag('meta[name="description"]', metaTag("name", "description"), "content", description);
    setHeadTag('meta[property="og:title"]', metaTag("property", "og:title"), "content", title);
    setHeadTag('meta[property="og:description"]', metaTag("property", "og:description"), "content", description);
    setHeadTag('meta[property="og:url"]', metaTag("property", "og:url"), "content", url);
    setHeadTag('meta[name="robots"]', metaTag("name", "robots"), "content", meta ? "index, follow" : "noindex");
    setHeadTag(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement("link");
        link.rel = "canonical";
        return link;
      },
      "href",
      url
    );
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="min-h-screen bg-[#FEF2E2]">
      <ScrollToHash />
      <PageMeta />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/rent/:slug" element={<RentPageRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <FloatingWhatsApp />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
