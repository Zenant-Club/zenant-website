import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  backgroundImage: string;
}

export function Hero({ backgroundImage }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Super precise linear gradient overlays guaranteed to apply */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)" 
          }}
        ></div>
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%)" 
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-32 w-full pt-28 md:pt-40">
        <div className="max-w-4xl">
          <h1 
            className="font-heading-78 text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight font-bold"
            style={{ 
              color: "#ffffff", 
              textShadow: "0px 4px 20px rgba(0,0,0,0.8), 0px 2px 6px rgba(0,0,0,0.8)" 
            }}
          >
            Find Your Perfect Rental — Hassle-Free
          </h1>
          <p 
            className="font-lora text-lg md:text-xl mb-10 leading-relaxed max-w-2xl font-medium"
            style={{ 
              color: "#ffffff", 
              textShadow: "0px 2px 10px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.9)",
              lineHeight: "1.7"
            }}
          >
            Chat with us on WhatsApp and get personalized property
            recommendations, verified listings and transparent process.
          </p>
          <Link
            to="/explore"
            className="inline-flex whatsapp-cta-btn whatsapp-cta-btn-large group mt-2"
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
        </div>
      </div>
    </section>
  );
}
