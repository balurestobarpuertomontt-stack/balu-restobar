"use client";

import { motion } from "framer-motion";
import { Music, Mic2, Cake, Users } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { getQuickWhatsAppUrl } from "@/lib/whatsapp";
import type { Event } from "@/types";

const EVENT_TYPES = [
  { icon: Music, label: "Música en Vivo", desc: "Artistas locales cada fin de semana" },
  { icon: Mic2, label: "Karaoke", desc: "Noches de karaoke los jueves" },
  { icon: Cake, label: "Cumpleaños", desc: "Paquetes especiales para celebrar" },
  { icon: Users, label: "Eventos Privados", desc: "Salón exclusivo para tu evento" },
];

const UPCOMING: Event[] = [
  {
    id: "1",
    title: "Noche de Jazz en Vivo",
    description: "Trío de jazz con selección de vinos",
    date: "2026-07-05",
    type: "musica",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0ff5a6827?w=600&q=80",
  },
  {
    id: "2",
    title: "Karaoke Night",
    description: "Canta tus favoritos con tragos 2x1",
    date: "2026-07-10",
    type: "karaoke",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
  },
  {
    id: "3",
    title: "Noche de Tablas",
    description: "Promoción especial en tablas para compartir",
    date: "2026-07-15",
    type: "privado",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  },
];

export default function Events() {
  return (
    <section id="eventos" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Agenda"
          title="Eventos"
          subtitle="Música, karaoke, cumpleaños y eventos privados"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {EVENT_TYPES.map((type, i) => (
            <GlassCard key={type.label} className="p-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <type.icon className="h-8 w-8 text-balu-gold mx-auto mb-3" />
                <h3 className="font-medium mb-1">{type.label}</h3>
                <p className="text-neutral-500 text-sm">{type.desc}</p>
              </motion.div>
            </GlassCard>
          ))}
        </div>

        <h3 className="font-display text-2xl mb-8 text-center">Próximos Eventos</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {UPCOMING.map((event, i) => (
            <GlassCard key={event.id} className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url('${event.image}')` }}
                />
                <div className="p-5">
                  <time className="text-balu-gold text-xs uppercase tracking-wider">
                    {new Date(event.date).toLocaleDateString("es-CL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </time>
                  <h4 className="font-medium text-lg mt-1 mb-2">{event.title}</h4>
                  <p className="text-neutral-500 text-sm">{event.description}</p>
                </div>
              </motion.div>
            </GlassCard>
          ))}
        </div>

        <div className="text-center">
          <a
            href={getQuickWhatsAppUrl("evento")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-balu-red text-white font-medium rounded-sm hover:bg-balu-red-light transition-all"
          >
            Solicitar Evento Privado
          </a>
        </div>
      </div>
    </section>
  );
}
