import { MessageCircle } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-[#A04E3C] to-[#8d4434]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center">
        <h2 className="font-heading-78 text-4xl md:text-5xl lg:text-6xl text-white mb-6">
          Ready to find your next home?
        </h2>
        <p className="font-lora text-xl md:text-2xl text-white/90 mb-10">
          Just one chat away.
        </p>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-[#A04E3C] px-10 py-5 rounded-full font-lora text-lg hover:bg-[#FEF2E2] transition-all hover:shadow-2xl transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
          Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}
