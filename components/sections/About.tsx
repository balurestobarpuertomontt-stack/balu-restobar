"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Users } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { SITE } from "@/lib/constants";

const stats = [
  { icon: Users, label: "Capacidad", value: "120+ personas" },
  { icon: Clock, label: "Horario", value: SITE.hours },
  { icon: MapPin, label: "Ubicación", value: "Centro Puerto Montt" },
];

export default function About() {
  return (
    <section id="nosotros" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-balu-dark via-balu-charcoal to-balu-dark -z-10" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Nuestra historia"
          title="Sobre Nosotros"
          subtitle="Donde la buena comida se encuentra con la mejor compañía"
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div
                className="h-64 rounded-2xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('/images/real/interior2.jpg')",
                }}
              />
              <div
                className="h-64 rounded-2xl bg-cover bg-center mt-8"
                style={{
                  backgroundImage:
                    "url('/images/real/exterior.jpg')",
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-balu-gold/30 rounded-2xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-neutral-400 leading-relaxed mb-6">
              Balu Restobar nació con una idea simple: crear un espacio donde cada plato cuente
              una historia y cada visita se sienta como reunirse con amigos. Ubicados en{" "}
              <strong className="text-balu-gold">{SITE.address}</strong>, combinamos la tradición
              gastronómica del sur de Chile con técnicas modernas y un ambiente cálido y elegante.
            </p>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Nuestra cocina destaca por tablas generosas para compartir, burgers de autor,
              cócteles de la casa y un bar con selección premium. Ya sea una cena romántica,
              un cumpleaños o un evento corporativo, en Balu siempre hay un lugar para ti.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <GlassCard key={stat.label} className="p-4 text-center" hover={false}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <stat.icon className="h-5 w-5 text-balu-gold mx-auto mb-2" />
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-sm font-medium mt-1">{stat.value}</p>
                  </motion.div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
