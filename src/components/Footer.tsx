import { Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#3B2F2F] text-white py-12 lg:py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#A04E3C] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21L12 3L21 21H3Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M12 3V12" stroke="#A04E3C" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-heading-78 text-2xl tracking-tight">ZENANT</span>
            </div>
            <p className="font-lora text-white/70 leading-relaxed">
              Connecting tenants to their dream homes — hassle-free, broker-free, stress-free.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 font-lora text-white/70">
              <li>
                <a href="/#home" className="hover:text-[#A04E3C] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#A04E3C] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-[#A04E3C] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-[#A04E3C] transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-heading text-lg mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#A04E3C] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#A04E3C] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <p className="font-lora text-white/70 text-sm">
              Chat with us on WhatsApp for instant assistance
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-lora text-white/60 text-sm">
            © 2025 Zenant. All rights reserved.
          </p>
          <div className="flex gap-6 font-lora text-white/60 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
