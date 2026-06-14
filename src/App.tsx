import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { ProblemsVsSolutions } from "./components/ProblemsVsSolutions";
import { HowItWorks } from "./components/HowItWorks";
import { PropertiesGallery } from "./components/PropertiesGallery";
import { Testimonials } from "./components/Testimonials";
import { CareersPage } from "./components/CareersPage";
import { AboutPage } from "./components/AboutPage";
import { ContactPage } from "./components/ContactPage";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

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
      <FloatingWhatsApp />
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

function App() {
  return (
    <div className="min-h-screen bg-[#FEF2E2]">
      <ScrollToHash />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
      </Routes>
    </div>
  );
}

export default App;