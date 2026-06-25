"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
