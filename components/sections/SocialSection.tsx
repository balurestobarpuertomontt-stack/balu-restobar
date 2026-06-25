"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { SITE } from "@/lib/constants";
import { Instagram, Facebook } from "@/components/ui/Icons";

const SOCIAL = [
  {
    name: "Instagram",
    handle: "@balurestobar",
    url: SITE.social.instagram,
    icon: Instagram,
    color: "from-purple-600/20 to-pink-600/20",
  },
  {
    name: "TikTok",
    handle: "@balurestobar",
    url: SITE.social.tiktok,
    icon: null,
    color: "from-neutral-600/20 to-neutral-800/20",
  },
  {
    name: "Facebook",
    handle: "Balu Restobar",
    url: SITE.social.facebook,
    icon: Facebook,
    color: "from-blue-600/20 to-blue-800/20",
  },
];

export default function SocialSection() {
  return (
    <section id="redes" className="py-28 px-6 bg-balu-charcoal/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Síguenos"
          title="Redes Sociales"
          subtitle="Fotos, eventos y novedades en tiempo real"
        />

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {SOCIAL.map((social, i) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className={`p-6 text-center bg-gradient-to-br ${social.color} h-full`}>
                {social.icon ? (
                  <social.icon className="h-8 w-8 text-balu-gold mx-auto mb-3" />
                ) : (
                  <span className="text-2xl block mb-3">🎵</span>
                )}
                <h3 className="font-medium">{social.name}</h3>
                <p className="text-neutral-500 text-sm mt-1">{social.handle}</p>
              </GlassCard>
            </motion.a>
          ))}
        </div>

        <GlassCard className="overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <p className="text-sm text-neutral-400">
              Últimas publicaciones de Instagram — conecta tu cuenta en el panel admin
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              "photo-1544025162-d76694265947",
              "photo-1568901346375-23c9450c58cd",
              "photo-1514362545857-3bc16c4c7d1b",
            ].map((id) => (
              <div
                key={id}
                className="aspect-square bg-cover bg-center hover:opacity-80 transition"
                style={{ backgroundImage: `url('https://images.unsplash.com/${id}?w=400&q=80')` }}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
