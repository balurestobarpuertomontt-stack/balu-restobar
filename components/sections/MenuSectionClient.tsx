"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Star } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { CATEGORY_LABELS } from "@/lib/constants";
import { formatCLP } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { MenuCategory, MenuItem } from "@/types";

interface MenuSectionClientProps {
  items: MenuItem[];
  categories: readonly MenuCategory[];
}

export default function MenuSectionClient({ items, categories }: MenuSectionClientProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(categories[0] ?? "tablas");
  const addItem = useCartStore((s) => s.addItem);

  const filtered = items.filter((item) => item.category === activeCategory);

  return (
    <section id="carta" className="py-28 px-6 relative">
      <div className="absolute inset-0 bg-balu-dark -z-10" />
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Carta digital"
          title="Nuestro Menú"
          subtitle="Precios actualizados — sincronizados desde nuestras plataformas de delivery"
        />

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === cat
                  ? "bg-balu-gold text-balu-dark font-semibold"
                  : "border border-white/10 text-neutral-400 hover:border-balu-gold/50 hover:text-neutral-200"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((item, i) => (
              <GlassCard key={item.id} className="overflow-hidden group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-balu-dark/80 to-transparent" />
                      {item.popular && (
                        <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-balu-gold/90 text-balu-dark text-xs font-semibold rounded-full">
                          <Star className="h-3 w-3 fill-current" /> Popular
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <span className="text-balu-gold font-semibold shrink-0">
                        {formatCLP(item.price)}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <button
                      onClick={() => addItem(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-balu-gold/30 rounded-lg text-sm text-balu-gold hover:bg-balu-gold hover:text-balu-dark transition-all"
                    >
                      <Plus className="h-4 w-4" /> Agregar
                    </button>
                  </div>
                </motion.div>
              </GlassCard>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
