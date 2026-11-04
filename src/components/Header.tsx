import { Fragment, useState, useEffect } from "react";
import { CalendarDays, House, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Real links rather than buttons, so search engines can follow the menu to every page.
// "/#home" scrolls to the top of the homepage (see ScrollToHash in App.tsx).
const NAV_LINKS = [
  { label: "Home", to: "/#home" },
  { label: "Explore", to: "/explore" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Careers", to: "/careers" },
];

export function Header() {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FEF2E2]/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Zenant Logo" className="h-8 sm:h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }, index) => (
            <Fragment key={to}>
              {index > 0 && <span className="text-[#3B2F2F]/30">•</span>}
              <Link
                to={to}
                className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
                style={{ fontSize: "1.125rem" }}
              >
                {label}
              </Link>
            </Fragment>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/explore"
          className="hidden md:flex whatsapp-cta-btn group"
        >
          <span className="whatsapp-cta-icon">
            <CalendarDays aria-hidden="true" />
          </span>
          <span className="whatsapp-cta-label">Schedule Your Visit</span>
          <span className="whatsapp-cta-arrow" aria-hidden="true">
            <svg className="arrow-svg" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line className="arrow-stem" x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <polyline className="arrow-head" points="15,1 22,7 15,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </span>
        </Link>

        {/* Mobile: always-visible Explore CTA + Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {location.pathname !== "/explore" && (
            <Link
              to="/explore"
              className="inline-flex whatsapp-cta-btn"
              style={{ minWidth: "unset", height: "38px", padding: "0 14px 0 5px", fontSize: "0.8125rem" }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="whatsapp-cta-icon">
                <House aria-hidden="true" />
              </span>
              <span className="whatsapp-cta-label">Explore Homes</span>
            </Link>
          )}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#3B2F2F]/10 transition-colors"
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
      </div>

      {/* Mobile Slide-Down Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "#FEF2E2", borderTop: menuOpen ? "1px solid rgba(59,47,47,0.1)" : "none" }}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors text-left py-3 border-b border-[#3B2F2F]/10"
              style={{ fontSize: "1.125rem" }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/explore"
            className="mt-3 inline-flex whatsapp-cta-btn group"
            style={{ width: '100%', minWidth: 'unset', justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            <span className="whatsapp-cta-icon">
              <CalendarDays aria-hidden="true" />
            </span>
            <span className="whatsapp-cta-label">Schedule Your Visit</span>
            <span className="whatsapp-cta-arrow" aria-hidden="true">
              <svg className="arrow-svg" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line className="arrow-stem" x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline className="arrow-head" points="15,1 22,7 15,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
