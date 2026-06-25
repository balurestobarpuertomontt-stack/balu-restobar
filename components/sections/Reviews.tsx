"use client";

import { motion } from "framer-motion";
import { Star } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import type { Review } from "@/types";

const REVIEWS: Review[] = [
  {
    id: "1",
    author: "María González",
    rating: 5,
    text: "Las tablas son enormes y deliciosas. El ambiente es perfecto para compartir con amigos. Volveremos seguro.",
    source: "google",
    date: "2026-05-12",
  },
  {
    id: "2",
    author: "Carlos Muñoz",
    rating: 5,
    text: "La Burger Balu es la mejor de Puerto Montt. Cócteles impecables y atención de primera.",
    source: "google",
    date: "2026-04-28",
  },
  {
    id: "3",
    author: "Valentina Soto",
    rating: 4,
    text: "Celebramos un cumpleaños y todo salió perfecto. Música en vivo los viernes es un plus.",
    source: "facebook",
    date: "2026-06-01",
  },
  {
    id: "4",
    author: "Diego Herrera",
    rating: 5,
    text: "El ceviche Balú es espectacular. Buena relación precio-calidad y el local es muy bonito.",
    source: "google",
    date: "2026-05-20",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "text-balu-gold fill-balu-gold" : "text-neutral-700"}`}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return (
    <section id="opiniones" className="py-28 px-6 bg-balu-charcoal/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Opiniones"
          title="Lo que dicen nuestros clientes"
          subtitle="Reseñas de Google y Facebook"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="font-display text-6xl text-balu-gold font-semibold">{avgRating.toFixed(1)}</p>
          <Stars count={Math.round(avgRating)} />
          <p className="text-neutral-500 text-sm mt-2">Basado en {REVIEWS.length}+ reseñas</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {REVIEWS.map((review, i) => (
            <GlassCard key={review.id} className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <p className="text-neutral-600 text-xs capitalize">{review.source} · {review.date}</p>
                  </div>
                  <Stars count={review.rating} />
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">&ldquo;{review.text}&rdquo;</p>
              </motion.div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
