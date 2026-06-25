"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "@/components/ui/Icons";
import { getQuickWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={getQuickWhatsAppUrl("consulta")}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
    </motion.a>
  );
}
