import { MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSectionNavigation = (id: string) => {
    if (location.pathname === "/") {
      scrollToSection(id);
      return;
    }

    navigate(`/#${id}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FEF2E2]/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#A04E3C] rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21L12 3L21 21H3Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 3V12" stroke="#A04E3C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-heading-78 text-2xl text-[#3B2F2F] tracking-tight">ZENANT</span>
        </button>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleSectionNavigation('home')}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
          >
            Home
          </button>
          <span className="text-[#3B2F2F]/30">•</span>
          <button 
            onClick={() => handleSectionNavigation('about')}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
          >
            About
          </button>
          <span className="text-[#3B2F2F]/30">•</span>
          <button 
            onClick={() => handleSectionNavigation('contact')}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
          >
            Contact
          </button>
          <span className="text-[#3B2F2F]/30">•</span>
          <button 
            onClick={() => navigate('/careers')}
            className="font-lora text-[#3B2F2F] hover:text-[#A04E3C] transition-colors"
          >
            Careers
          </button>
        </nav>

        {/* CTA Button */}
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 bg-[#A04E3C] text-white px-6 py-2.5 rounded-full font-lora hover:bg-[#8d4434] transition-all hover:shadow-lg"
        >
          <MessageCircle className="w-4 h-4" />
          Chat on WhatsApp
        </a>
      </div>
    </header>
  );
}
