"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, CalendarDays, ShoppingCart, TrendingUp, Lock } from "@/components/ui/Icons";
import { formatCLP } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface OrderRow {
  id: string;
  customer_name: string;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
}

interface ReservationRow {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  phone: string;
  status: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "reservations" | "stats">("products");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuSource, setMenuSource] = useState<"static" | "supabase">("static");
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) {
      const json = await res.json();
      setMenuItems(json.items ?? []);
      setMenuSource(json.source ?? "static");
    }
  }, []);

  const fetchAdminData = useCallback(async (adminKey: string) => {
    setLoading(true);
    const headers = { "x-admin-key": adminKey };

    const [ordersRes, reservationsRes] = await Promise.all([
      fetch("/api/admin/orders", { headers }),
      fetch("/api/admin/reservations", { headers }),
    ]);

    if (ordersRes.ok) {
      const json = await ordersRes.json();
      setOrders(json.data ?? []);
      setSupabaseOk(json.configured ?? false);
    }

    if (reservationsRes.ok) {
      const json = await reservationsRes.json();
      setReservations(json.data ?? []);
    }

    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthenticated(true);
      await Promise.all([fetchMenu(), fetchAdminData(password)]);
    } else {
      setError("Contraseña incorrecta");
    }
  };

  useEffect(() => {
    if (authenticated && activeTab === "products") {
      fetchMenu();
    }
  }, [activeTab, authenticated, fetchMenu]);

  useEffect(() => {
    if (authenticated && (activeTab === "orders" || activeTab === "reservations" || activeTab === "stats")) {
      fetchAdminData(password);
    }
  }, [activeTab, authenticated, password, fetchAdminData]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-balu-dark flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-balu-gold mx-auto mb-4" />
            <h1 className="font-display text-2xl">Panel Admin</h1>
            <p className="text-neutral-500 text-sm mt-2">Balu Restobar</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none"
          />
          {error && <p className="text-balu-red text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-balu-gold text-balu-dark font-semibold rounded-lg">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: "products" as const, label: "Productos", icon: Package },
    { id: "orders" as const, label: "Pedidos", icon: ShoppingCart },
    { id: "reservations" as const, label: "Reservas", icon: CalendarDays },
    { id: "stats" as const, label: "Estadísticas", icon: TrendingUp },
  ];

  const totalSales = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-balu-dark">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl">
            <span className="text-balu-gold">Balu</span> Admin
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Menú: {menuSource === "supabase" ? "Supabase" : "estático"} · Supabase:{" "}
            {supabaseOk ? "✅ conectado" : "⚠️ no configurado"}
          </p>
        </div>
        <a href="/" className="text-sm text-neutral-500 hover:text-balu-gold">← Volver al sitio</a>
      </header>

      <div className="flex flex-col md:flex-row">
        <nav className="md:w-56 border-b md:border-b-0 md:border-r border-white/5 p-4 flex md:flex-col gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-balu-gold/10 text-balu-gold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6 md:p-8">
          {loading && <p className="text-neutral-500 text-sm mb-4">Cargando...</p>}

          {activeTab === "products" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Productos ({menuItems.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500 text-left">
                      <th className="pb-3 pr-4">Nombre</th>
                      <th className="pb-3 pr-4">Categoría</th>
                      <th className="pb-3 pr-4">Precio</th>
                      <th className="pb-3">Popular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b border-white/5">
                        <td className="py-3 pr-4">{item.name}</td>
                        <td className="py-3 pr-4 capitalize text-neutral-400">{item.category}</td>
                        <td className="py-3 pr-4 text-balu-gold">{formatCLP(item.price)}</td>
                        <td className="py-3">{item.popular ? "⭐" : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Pedidos ({orders.length})</h2>
              {orders.length === 0 ? (
                <p className="text-neutral-500">No hay pedidos registrados aún.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-neutral-500 text-xs mt-1">
                            {new Date(order.created_at).toLocaleString("es-CL")} · {order.payment_method}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-balu-gold font-semibold">{formatCLP(order.total)}</p>
                          <p className="text-xs text-neutral-500 capitalize">{order.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "reservations" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Reservas ({reservations.length})</h2>
              {reservations.length === 0 ? (
                <p className="text-neutral-500">No hay reservas registradas aún.</p>
              ) : (
                <div className="space-y-3">
                  {reservations.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{r.name}</p>
                          <p className="text-neutral-500 text-xs mt-1">
                            {r.date} · {r.time} · {r.guests} personas · {r.phone}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-500 capitalize">{r.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div>
              <h2 className="font-display text-2xl mb-6">Estadísticas</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Productos activos", value: menuItems.length },
                  { label: "Pedidos totales", value: orders.length },
                  { label: "Reservas totales", value: reservations.length },
                  { label: "Ventas registradas", value: formatCLP(totalSales) },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-neutral-500 text-sm">{stat.label}</p>
                    <p className="font-display text-2xl text-balu-gold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
