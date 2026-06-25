"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import type { GalleryItem } from "@/types";

const GALLERY: GalleryItem[] = [
  { id: "1", src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", alt: "Tabla de carnes", category: "comidas", height: "tall" },
  { id: "2", src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", alt: "Cócteles", category: "cocteles", height: "medium" },
  { id: "3", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", alt: "Ambiente del local", category: "local", height: "short" },
  { id: "4", src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", alt: "Burger premium", category: "comidas", height: "medium" },
  { id: "5", src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80", alt: "Old fashioned", category: "cocteles", height: "tall" },
  { id: "6", src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80", alt: "Evento en vivo", category: "eventos", height: "medium" },
  { id: "7", src: "https://images.unsplash.com/photo-1528607929212-26305ec22053?w=600&q=80", alt: "Clientes disfrutando", category: "clientes", height: "short" },
  { id: "8", src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80", alt: "Bar", category: "local", height: "tall" },
  { id: "9", src: "https://images.unsplash.com/photo-1535399833047-9de6f81d427?w=600&q=80", alt: "Ceviche", category: "comidas", height: "medium" },
];

const FILTERS = ["todos", "comidas", "cocteles", "clientes", "eventos", "local"] as const;
const FILTER_LABELS: Record<string, string> = {
  todos: "Todos",
  comidas: "Comidas",
  cocteles: "Cócteles",
  clientes: "Clientes",
  eventos: "Eventos",
  local: "Local",
};

const heightClass = { short: "row-span-1", medium: "row-span-2", tall: "row-span-3" };

export default function Gallery() {
  const [filter, setFilter] = useState<string>("todos");
  const items = filter === "todos" ? GALLERY : GALLERY.filter((g) => g.category === filter);

  return (
    <section id="galeria" className="py-28 px-6 bg-balu-charcoal/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Galería"
          title="Momentos Balu"
          subtitle="Comidas, cócteles, eventos y el ambiente que nos define"
        />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-balu-red text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid group relative overflow-hidden rounded-xl"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-balu-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-sm text-neutral-200">{item.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
