"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Clock, CheckCircle } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { SITE } from "@/lib/constants";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function ReservationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const message = `Hola Balu 👋\n\nQuiero reservar una mesa:\n\n📅 Fecha: ${form.date}\n🕐 Hora: ${form.time}\n👥 Personas: ${form.guests}\n\nNombre: ${form.name}\nTeléfono: ${form.phone}\nEmail: ${form.email}${form.notes ? `\nNotas: ${form.notes}` : ""}\n\nGracias.`;

    try {
      await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Supabase optional — WhatsApp fallback always works
    }

    window.open(getWhatsAppUrl(message), "_blank");
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <section id="reservas" className="py-28 px-6 bg-balu-charcoal/50">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle className="h-16 w-16 text-balu-gold mx-auto mb-6" />
            <h2 className="font-display text-3xl mb-4">¡Reserva enviada!</h2>
            <p className="text-neutral-400 mb-8">
              Te contactaremos por WhatsApp para confirmar tu mesa.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-balu-gold hover:underline"
            >
              Hacer otra reserva
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="reservas" className="py-28 px-6 bg-balu-charcoal/50">
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          eyebrow="Reservas"
          title="Reserva tu Mesa"
          subtitle="Elige fecha, hora y número de personas"
        />

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Nombre</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider">Teléfono</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition"
                  placeholder="+56 9 ..."
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-wider">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition"
                placeholder="correo@ejemplo.cl"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" /> Fecha
                </label>
                <input
                  required
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Hora
                </label>
                <select
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition"
                >
                  <option value="">Seleccionar</option>
                  {["12:00", "13:00", "14:00", "19:00", "20:00", "21:00", "22:00"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                  <Users className="h-3 w-3" /> Personas
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-500 uppercase tracking-wider">Notas (opcional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full mt-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none transition resize-none"
                placeholder="Celebración, alergias, preferencias..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Confirmar Reserva vía WhatsApp"}
            </button>

            <p className="text-neutral-600 text-xs text-center">
              También puedes llamarnos al {SITE.phoneDisplay}
            </p>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}
