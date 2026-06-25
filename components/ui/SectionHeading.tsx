"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
  light,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn("text-center mb-14", className)}
    >
      {eyebrow && (
        <p
          className={cn(
            "tracking-[0.3em] uppercase text-xs mb-3 font-medium",
            light ? "text-balu-gold" : "text-balu-red"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-4xl md:text-5xl font-semibold mb-4",
          light ? "text-white" : "text-neutral-100"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("max-w-xl mx-auto text-base", light ? "text-neutral-400" : "text-neutral-500")}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
