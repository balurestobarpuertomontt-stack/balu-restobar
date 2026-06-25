"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@/components/ui/Icons";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("balu-pwa-dismissed");
      if (!dismissed) setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("balu-pwa-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50"
        >
          <div className="p-4 rounded-2xl border border-balu-gold/30 bg-balu-charcoal/95 backdrop-blur-xl shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <p className="font-display text-sm">Instala Balu Restobar</p>
              <button onClick={dismiss} aria-label="Cerrar">
                <X className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <p className="text-neutral-500 text-xs mb-3">
              Accede rápido a la carta y pedidos desde tu pantalla de inicio.
            </p>
            <button
              onClick={install}
              className="w-full py-2 bg-balu-gold text-balu-dark text-sm font-semibold rounded-lg"
            >
              Instalar app
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
