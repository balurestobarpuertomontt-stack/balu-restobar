"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Mic2, Cake, Users, ChevronDown, Clock } from "@/components/ui/Icons";
import SectionHeading from "@/components/ui/SectionHeading";
import GlassCard from "@/components/ui/GlassCard";
import { getQuickWhatsAppUrl } from "@/lib/whatsapp";
import type { Event } from "@/types";

const EVENT_TYPES = [
  { icon: Music, label: "Música en Vivo", desc: "Artistas locales cada fin de semana" },
  { icon: Mic2, label: "Karaoke", desc: "Noches de karaoke los jueves" },
  { icon: Cake, label: "Cumpleaños", desc: "Paquetes especiales para celebrar" },
  { icon: Users, label: "Eventos Privados", desc: "Salón exclusivo para tu evento" },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default July 2026 for demo matching seed
  const [selectedDayEvent, setSelectedDayEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const json = await res.json();
          const mapped = (json.data ?? []).map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description || "",
            date: e.event_date,
            type: e.event_type || "privado",
            image: e.image_url || "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
          }));
          setEvents(mapped);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }
    loadEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust day index for Mon-Sun week (Chile standard)
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalDays = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayEvent(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayEvent(null);
  };

  // Find event on a specific date (YYYY-MM-DD)
  const getEventForDay = (day: number): Event | undefined => {
    const dayStr = day.toString().padStart(2, "0");
    const monthStr = (month + 1).toString().padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    return events.find((e) => e.date === dateStr);
  };

  const daysGrid = [];
  for (let i = 0; i < adjustedFirstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    const event = getEventForDay(day);
    if (event) {
      setSelectedDayEvent(event);
    } else {
      setSelectedDayEvent(null);
    }
  };

  return (
    <section id="eventos" className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-balu-dark/50 -z-20" />
      
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Agenda"
          title="Nuestros Eventos"
          subtitle="Explora nuestro calendario interactivo y reserva tu mesa"
        />

        {/* Event types */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {EVENT_TYPES.map((type, i) => (
            <GlassCard key={type.label} className="p-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <type.icon className="h-8 w-8 text-balu-gold mx-auto mb-3" />
                <h3 className="font-medium mb-1">{type.label}</h3>
                <p className="text-neutral-500 text-sm">{type.desc}</p>
              </motion.div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Interactive Calendar Component */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl text-neutral-200">
                {monthNames[month]} <span className="text-balu-gold">{year}</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10 hover:border-balu-gold transition"
                >
                  ◄
                </button>
                <button
                  onClick={handleNextMonth}
                  className="px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10 hover:border-balu-gold transition"
                >
                  ►
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              <div>Lun</div><div>Mar</div><div>Mie</div><div>Jue</div><div>Vie</div><div>Sab</div><div>Dom</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysGrid.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-12" />;
                }

                const event = getEventForDay(day);
                const isSelected = selectedDayEvent && parseInt(selectedDayEvent.date.split("-")[2], 10) === day;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => handleDayClick(day)}
                    className={`h-12 relative flex flex-col items-center justify-center rounded-lg border text-sm transition-all ${
                      event
                        ? isSelected
                          ? "bg-balu-gold text-balu-dark border-balu-gold font-bold scale-105 shadow-lg shadow-balu-gold/20"
                          : "bg-balu-gold/15 border-balu-gold/40 text-balu-gold font-semibold hover:bg-balu-gold/30"
                        : "border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{day}</span>
                    {event && !isSelected && (
                      <span className="w-1.5 h-1.5 bg-balu-gold rounded-full absolute bottom-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Details Panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {selectedDayEvent ? (
                <motion.div
                  key={selectedDayEvent.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md"
                >
                  {selectedDayEvent.image && (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url('${selectedDayEvent.image}')` }}
                    />
                  )}
                  <div className="p-6 space-y-4">
                    <span className="inline-block px-3 py-1 bg-balu-gold/10 text-balu-gold text-xs font-semibold rounded-full uppercase tracking-wider">
                      {selectedDayEvent.type}
                    </span>
                    <h4 className="font-display text-2xl font-bold">{selectedDayEvent.title}</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {selectedDayEvent.description}
                    </p>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                      <Clock className="h-4 w-4 text-balu-gold" />
                      <span>
                        {new Date(selectedDayEvent.date).toLocaleDateString("es-CL", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          const inputDate = document.querySelector('input[type="date"]') as HTMLInputElement;
                          if (inputDate) {
                            inputDate.value = selectedDayEvent.date;
                            // Trigger onChange manually
                            const event = new Event('input', { bubbles: true });
                            inputDate.dispatchEvent(event);
                          }
                          document.querySelector("#reservas")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex-1 py-3 bg-balu-gold text-balu-dark font-semibold text-center rounded-lg text-sm hover:bg-balu-gold-light transition"
                      >
                        Reservar Mesa
                      </button>
                      <a
                        href={getQuickWhatsAppUrl("evento")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition flex items-center justify-center"
                      >
                        Consultar
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="border border-white/15 border-dashed rounded-2xl p-8 text-center text-neutral-500 h-full flex flex-col items-center justify-center min-h-[300px]">
                  <p className="mb-2">Selecciona un día dorado en el calendario para ver detalles del evento.</p>
                  <p className="text-xs text-neutral-600">Tenemos música en vivo y promociones especiales esperándote.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href={getQuickWhatsAppUrl("evento")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 bg-balu-red text-white font-medium rounded-sm hover:bg-balu-red-light transition-all hover:scale-105 shadow-lg shadow-balu-red/10"
          >
            Solicitar Evento Privado
          </a>
        </div>
      </div>
    </section>
  );
}
