import { MessageCircle } from "lucide-react";

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
          <a
            href="https://wa.me/918050410310"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#A04E3C] text-white px-8 py-4 rounded-full font-lora text-lg md:text-xl font-medium hover:bg-[#8D4434] transition-all duration-300 transform hover:-translate-y-1"
            style={{
              boxShadow: "0 8px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(160,78,60,0.6)"
            }}
          >
            <MessageCircle className="w-6 h-6" />
            Start Chatting Now
          </a>
        </div>
      </div>
    </section>
  );
}
