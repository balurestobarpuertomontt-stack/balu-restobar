"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, X } from "@/components/ui/Icons";
import { NAV_LINKS, SITE } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";
import CartButton from "@/components/cart/CartButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-balu-dark/90 backdrop-blur-xl border-b border-white/5 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("#inicio")}
            className="font-display text-xl md:text-2xl font-semibold tracking-wide"
          >
            <span className="text-balu-gold">Balu</span>
            <span className="text-neutral-300 ml-1">Restobar</span>
          </button>

          <ul className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="text-sm text-neutral-400 hover:text-balu-gold transition-colors"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <CartButton />
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2"
              aria-label="Abrir menú"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-balu-dark/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex justify-between items-center p-6 h-16">
              <span className="font-display text-xl">
                <span className="text-balu-gold">Balu</span> Restobar
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="flex flex-col items-center gap-8 pt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-2xl font-display text-neutral-200 hover:text-balu-gold transition-colors"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="text-center text-neutral-600 text-sm mt-16">{SITE.address}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
