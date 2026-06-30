"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import type { GalleryItem } from "@/types";

const STATIC_GALLERY: GalleryItem[] = [
  { id: "1", src: "/images/real/interior.jpg", alt: "Interior del Restobar", category: "local" },
  { id: "2", src: "/images/real/dishes.jpg", alt: "Platos destacados", category: "comidas" },
  { id: "3", src: "/images/real/exterior.jpg", alt: "Fachada Exterior", category: "local" },
  { id: "4", src: "/images/real/meals.jpg", alt: "Comida deliciosa", category: "comidas" },
  { id: "5", src: "/images/real/design.jpg", alt: "Diseño del bar", category: "local" },
  { id: "6", src: "/images/real/food.jpg", alt: "Plato de la casa", category: "comidas" },
  { id: "7", src: "/images/real/interior2.jpg", alt: "Ambiente", category: "local" },
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

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(STATIC_GALLERY);
  const [filter, setFilter] = useState<string>("todos");

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const mapped = json.data.map((item: any) => ({
              id: item.id,
              src: item.image_url,
              alt: item.alt_text || "Momento Balu",
              category: item.category || "local",
            }));
            setItems(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load gallery from DB, using fallback static content:", err);
      }
    }
    loadGallery();
  }, []);

  const filtered = filter === "todos" ? items : items.filter((g) => g.category === filter);

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
          {filtered.map((item, i) => (
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
