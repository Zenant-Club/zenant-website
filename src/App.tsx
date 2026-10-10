import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { ProblemsVsSolutions } from "./components/ProblemsVsSolutions";
import { HowItWorks } from "./components/HowItWorks";
import { PropertiesGallery } from "./components/PropertiesGallery";
import { ExplorePage } from "./components/ExplorePage";
import { Testimonials } from "./components/Testimonials";
import { CareersPage } from "./components/CareersPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { PAGE_META, SITE_URL } from "./components/pageMeta";

function HomePage() {
  const heroImage = "/hero-bg.png";

  return (
    <>
      <Hero backgroundImage={heroImage} />
      <ProblemsVsSolutions />
      <HowItWorks />
      <PropertiesGallery />
      <Testimonials />
      <FinalCTA />
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
    const meta = PAGE_META[path];
    const { title, description } = meta || PAGE_META["/"];
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
      </Routes>
      <FloatingWhatsApp />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
