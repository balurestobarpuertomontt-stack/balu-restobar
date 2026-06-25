"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { SITE } from "@/lib/constants";

const MENU_URL = `${SITE.url}/#carta`;

export default function QRMenu() {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&color=0f0f0f&bgcolor=ffffff&data=${encodeURIComponent(MENU_URL)}`;

  return (
    <section id="qr-menu" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Menú digital"
          title="Escanea y pide"
          subtitle="Accede a nuestra carta completa desde tu celular"
        />

        <GlassCard className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            <div className="bg-white p-4 rounded-2xl shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="QR menú digital Balu Restobar"
                width={220}
                height={220}
                className="rounded-lg"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl mb-3">Carta digital QR</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Escanea el código con la cámara de tu celular para ver la carta completa,
                agregar productos al carrito y confirmar tu pedido por WhatsApp.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a
                  href="#carta"
                  className="px-6 py-2.5 bg-balu-gold text-balu-dark text-sm font-semibold rounded-lg hover:opacity-90 transition"
                >
                  Ver carta
                </a>
                <button
                  onClick={() => navigator.clipboard?.writeText(MENU_URL)}
                  className="px-6 py-2.5 border border-white/10 text-sm rounded-lg hover:border-balu-gold/50 transition"
                >
                  Copiar enlace
                </button>
              </div>
            </div>
          </motion.div>
        </GlassCard>
      </div>
    </section>
  );
}
