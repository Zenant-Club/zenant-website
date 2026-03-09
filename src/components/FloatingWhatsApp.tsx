import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#A04E3C] text-white px-6 py-4 rounded-full shadow-2xl hover:bg-[#8d4434] transition-all hover:shadow-[#A04E3C]/50 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.div>
      <span className="font-lora font-medium hidden sm:block">Chat with us</span>
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#A04E3C]"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
    </motion.a>
  );
}
