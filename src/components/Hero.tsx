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
            className="inline-flex whatsapp-cta-btn whatsapp-cta-btn-large group mt-2"
          >
            <span className="whatsapp-cta-icon">
              <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.676 4.797 1.854 6.785L2 30l7.43-1.826A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.84-1.6l-.418-.25-4.41 1.084 1.116-4.298-.274-.44A11.44 11.44 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.56c-.344-.172-2.036-1.004-2.352-1.118-.316-.115-.547-.172-.777.172-.23.344-.892 1.118-1.094 1.348-.2.23-.403.258-.747.086-.344-.172-1.453-.536-2.768-1.708-1.022-.912-1.713-2.038-1.913-2.382-.2-.344-.021-.53.15-.702.154-.154.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.777-1.875-1.065-2.567-.28-.672-.565-.581-.777-.592l-.662-.011c-.23 0-.603.086-.919.43-.316.344-1.207 1.18-1.207 2.877 0 1.697 1.236 3.337 1.408 3.567.172.23 2.433 3.715 5.895 5.208.824.355 1.467.567 1.968.726.827.263 1.58.226 2.175.137.663-.1 2.036-.832 2.323-1.636.287-.804.287-1.493.2-1.636-.086-.143-.316-.23-.66-.402z"/>
              </svg>
            </span>
            <span className="whatsapp-cta-label">Get Started</span>
            <span className="whatsapp-cta-arrow" aria-hidden="true">
              <svg className="arrow-svg" viewBox="0 0 28 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line className="arrow-stem" x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline className="arrow-head" points="15,1 22,7 15,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
