"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "@/components/ui/Icons";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="p-2 rounded-full border border-white/10 hover:border-balu-gold/50 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-balu-gold" />
      ) : (
        <Moon className="h-4 w-4 text-balu-red" />
      )}
    </button>
  );
}
