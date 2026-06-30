"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsApp, X, Clock, CalendarDays, Cake, HelpCircle } from "@/components/ui/Icons";
import { getQuickWhatsAppUrl } from "@/lib/whatsapp";
import GlassCard from "./GlassCard";

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setHasOpenedOnce(true);
  };

  const chatOptions = [
    {
      id: "consulta",
      label: "Consulta Rápida",
      icon: HelpCircle,
      description: "Preguntas sobre el menú o servicios",
      type: "consulta" as const,
    },
    {
      id: "reserva",
      label: "Reservar Mesa",
      icon: CalendarDays,
      description: "Coordina tu mesa por chat",
      type: "reserva" as const,
    },
    {
      id: "evento",
      label: "Solicitud de Evento",
      icon: Cake,
      description: "Cumpleaños, música en vivo y más",
      type: "evento" as const,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-balu-charcoal/95 shadow-2xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-display text-lg font-bold">
                    B
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#25D366] rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Balu Restobar</h4>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Responde de inmediato
                  </p>
                </div>
              </div>
              <button
                onClick={toggleOpen}
                className="p-1 rounded-full hover:bg-white/15 transition"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
              <div className="bg-white/5 border border-white/5 text-xs text-neutral-400 rounded-lg p-3">
                ¡Hola! 👋 ¿En qué podemos ayudarte hoy? Selecciona una opción para chatear con nosotros:
              </div>

              {chatOptions.map((opt) => (
                <a
                  key={opt.id}
                  href={getQuickWhatsAppUrl(opt.type)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-balu-gold/40 hover:bg-white/5 transition group"
                >
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-balu-gold/10 text-neutral-400 group-hover:text-balu-gold transition">
                    {/* Render raw icon, falling back to HelpCircle if not custom */}
                    {opt.icon ? <opt.icon className="w-5 h-5" /> : <WhatsApp className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm text-neutral-200 group-hover:text-balu-gold transition">
                      {opt.label}
                    </h5>
                    <p className="text-xs text-neutral-500 mt-0.5">{opt.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white/5 border-t border-white/5 text-center">
              <a
                href={getQuickWhatsAppUrl("consulta")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#25D366] hover:underline font-semibold"
              >
                O envíanos un mensaje libre aquí
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating button */}
      <motion.button
        onClick={toggleOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir chat de WhatsApp"
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
          isOpen
            ? "bg-balu-charcoal border border-white/10 text-neutral-300"
            : "bg-[#25D366] text-white shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40"
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <WhatsApp className="h-7 w-7" />}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        )}
        {!hasOpenedOnce && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-balu-gold border border-balu-dark rounded-full flex items-center justify-center text-[9px] font-bold text-balu-dark">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
