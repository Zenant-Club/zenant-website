import { useState, useEffect } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSectionNavigation = (id: string) => {
    setMenuOpen(false);
    if (location.pathname === "/") {
      scrollToSection(id);
      return;
    }
    navigate(`/#${id}`);
  };

  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FEF2E2]/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <img src="/logo.png" alt="Zenant Logo" className="h-10 w-auto object-contain" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleSectionNavigation("home")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
            style={{ fontSize: "1.125rem" }}
          >
            Home
          </button>
          <span className="text-[#3B2F2F]/30">•</span>
          <button
            onClick={() => handleNavigate("/about")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
            style={{ fontSize: "1.125rem" }}
          >
            About
          </button>
          <span className="text-[#3B2F2F]/30">•</span>
          <button
            onClick={() => handleNavigate("/contact")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
            style={{ fontSize: "1.125rem" }}
          >
            Contact
          </button>
          <span className="text-[#3B2F2F]/30">•</span>
          <button
            onClick={() => handleNavigate("/careers")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
            style={{ fontSize: "1.125rem" }}
          >
            Careers
          </button>
        </nav>

        {/* Desktop CTA Button */}
        <a
          href="https://wa.me/918050410310"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-[#A04E3C] text-white px-6 py-2.5 rounded-full font-lora hover:bg-[#8d4434] transition-all hover:shadow-lg"
          style={{ fontSize: "1.125rem" }}
        >
          <MessageCircle className="w-4 h-4" />
          Chat on WhatsApp
        </a>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#3B2F2F]/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-[#3B2F2F]" />
          ) : (
            <Menu className="w-6 h-6 text-[#3B2F2F]" />
          )}
        </button>
      </div>

      {/* Mobile Slide-Down Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "#FEF2E2", borderTop: menuOpen ? "1px solid rgba(59,47,47,0.1)" : "none" }}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          <button
            onClick={() => handleSectionNavigation("home")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors text-left py-3 border-b border-[#3B2F2F]/10"
            style={{ fontSize: "1.125rem" }}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigate("/about")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors text-left py-3 border-b border-[#3B2F2F]/10"
            style={{ fontSize: "1.125rem" }}
          >
            About
          </button>
          <button
            onClick={() => handleNavigate("/contact")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors text-left py-3 border-b border-[#3B2F2F]/10"
            style={{ fontSize: "1.125rem" }}
          >
            Contact
          </button>
          <button
            onClick={() => handleNavigate("/careers")}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors text-left py-3 border-b border-[#3B2F2F]/10"
            style={{ fontSize: "1.125rem" }}
          >
            Careers
          </button>
          <a
            href="https://wa.me/918050410310"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 bg-[#A04E3C] text-white px-6 py-3 rounded-full font-lora hover:bg-[#8d4434] transition-all"
            style={{ fontSize: "1rem" }}
            onClick={() => setMenuOpen(false)}
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
