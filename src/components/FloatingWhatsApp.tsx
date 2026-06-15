import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918050410310"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex items-center gap-3 bg-[#A04E3C] text-white sm:px-6 px-4 sm:py-4 py-3 rounded-full shadow-2xl hover:bg-[#8d4434] transition-all duration-300 hover:shadow-[#A04E3C]/50 hover:scale-105 active:scale-95 group"
    >
      <div className="group-hover:animate-bounce">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <span className="font-lora font-medium hidden sm:block">Chat with us</span>
      
      {/* Pulse effect */}
      <div
        className="absolute inset-0 rounded-full bg-[#A04E3C] opacity-50 animate-ping -z-10"
        style={{ animationDuration: '2s' }}
      />
    </a>
  );
}
