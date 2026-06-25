"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Phone } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { SITE } from "@/lib/constants";

export default function MapSection() {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${SITE.coordinates.lng}!3d${SITE.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDI4JzE4LjEiUyA3MsKwNTYnMTIuOCJX!5e0!3m2!1ses!2scl!4v1`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${SITE.coordinates.lat},${SITE.coordinates.lng}`;

  return (
    <section id="ubicacion" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Encuéntranos"
          title="Ubicación"
          subtitle={SITE.address}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-white/10 h-[400px]"
            >
              <iframe
                title="Ubicación Balu Restobar"
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Dirección", value: SITE.address },
              { icon: Clock, label: "Horario", value: SITE.hours },
              { icon: Phone, label: "Teléfono", value: SITE.phoneDisplay },
            ].map((item, i) => (
              <GlassCard key={item.label} className="p-5" hover={false}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <item.icon className="h-5 w-5 text-balu-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm mt-1">{item.value}</p>
                  </div>
                </motion.div>
              </GlassCard>
            ))}

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:opacity-90 transition"
            >
              <Navigation className="h-4 w-4" /> Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
