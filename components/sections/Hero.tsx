"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "@/components/ui/Icons";
import { SITE } from "@/lib/constants";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage:
              "url('/images/real/interior.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-balu-dark/70 via-balu-dark/80 to-balu-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-balu-red/10 to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {mounted && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-balu-gold/50 bg-balu-gold/10 backdrop-blur-sm mb-6">
                <span className="font-display text-3xl text-balu-gold font-bold">B</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-balu-gold tracking-[0.4em] uppercase text-xs md:text-sm mb-4 font-medium"
            >
              Puerto Montt, Chile
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 leading-tight"
            >
              Balu <span className="text-balu-gold">Restobar</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-xl md:text-2xl text-neutral-300 font-display italic mb-4"
            >
              &ldquo;{SITE.slogan}&rdquo;
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-neutral-500 max-w-lg mx-auto mb-10 text-sm md:text-base"
            >
              Tablas, burgers de autor, cócteles premium y noches inolvidables en {SITE.address}.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <button
                onClick={() => scrollTo("#carta")}
                className="px-8 py-3.5 bg-balu-gold text-balu-dark font-semibold rounded-sm hover:bg-balu-gold-light transition-all hover:scale-105 active:scale-95"
              >
                Ver Carta
              </button>
              <button
                onClick={() => scrollTo("#carta")}
                className="px-8 py-3.5 bg-balu-red text-white font-semibold rounded-sm hover:bg-balu-red-light transition-all hover:scale-105 active:scale-95"
              >
                Pedir Ahora
              </button>
              <button
                onClick={() => scrollTo("#reservas")}
                className="px-8 py-3.5 border border-white/20 rounded-sm hover:border-balu-gold hover:text-balu-gold transition-all backdrop-blur-sm"
              >
                Reservar Mesa
              </button>
            </motion.div>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-6 w-6 text-neutral-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
