"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, CalendarDays, ShoppingCart, TrendingUp, Lock, Plus, Trash2, Edit, X, Image, Users } from "@/components/ui/Icons";
import { formatCLP } from "@/lib/utils";
import type { MenuItem, MenuCategory } from "@/types";

interface OrderRow {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string | null;
  items: any[];
  subtotal: number;
  discount: number;
  tip: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

interface ReservationRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
}

const CATEGORIES: MenuCategory[] = ["tablas", "burgers", "sandwiches", "platos", "infantil", "bebidas", "cocteles"];

const EVENT_TYPES = [
  { id: "musica", label: "Música en Vivo" },
  { id: "karaoke", label: "Karaoke" },
  { id: "promo", label: "Promoción" },
  { id: "deportivo", label: "Transmisión Deportiva" },
  { id: "otro", label: "Otro" }
];

const GALLERY_CATEGORIES = [
  { id: "platos", label: "Platos" },
  { id: "bebidas", label: "Bebidas" },
  { id: "local", label: "Local / Ambiente" },
  { id: "clientes", label: "Clientes" },
  { id: "eventos", label: "Eventos" },
  { id: "comidas", label: "Comidas" },
  { id: "cocteles", label: "Cócteles" }
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "reservations" | "stats" | "events" | "gallery">("products");
  
  // Data States
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuSource, setMenuSource] = useState<"static" | "supabase" | "local">("static");
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncLog, setSyncLog] = useState("");

  // Events & Gallery States
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // Product Form State
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategory, setFormCategory] = useState<MenuCategory>("tablas");
  const [formImage, setFormImage] = useState("");
  const [formPopular, setFormPopular] = useState(false);
  const [formActive, setFormActive] = useState(true);

  // Event Form State
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("musica");
  const [eventImage, setEventImage] = useState("");
  const [eventActive, setEventActive] = useState(true);

  // Gallery Form State
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);
  const [galleryImage, setGalleryImage] = useState("");
  const [galleryAlt, setGalleryAlt] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("platos");
  const [galleryOrder, setGalleryOrder] = useState("0");
  const [galleryActive, setGalleryActive] = useState(true);

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu");
    if (res.ok) {
      const json = await res.json();
      setMenuItems(json.items ?? []);
      setMenuSource(json.source ?? "static");
    }
  }, []);

  const fetchEvents = useCallback(async (adminKey: string) => {
    const res = await fetch("/api/events", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      const json = await res.json();
      setEvents(json.data ?? []);
    }
  }, []);

  const fetchGallery = useCallback(async (adminKey: string) => {
    const res = await fetch("/api/gallery", {
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) {
      const json = await res.json();
      setGallery(json.data ?? []);
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
      await Promise.all([
        fetchMenu(),
        fetchAdminData(password),
        fetchEvents(password),
        fetchGallery(password)
      ]);
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const handleSyncPrices = async () => {
    setSyncLoading(true);
    setSyncLog("Sincronizando precios...");
    try {
      const res = await fetch("/api/menu/sync", {
        method: "POST",
        headers: { "x-admin-key": password },
      });
      if (res.ok) {
        const json = await res.json();
        setSyncLog(json.message);
        await fetchMenu();
      } else {
        setSyncLog("Error al sincronizar con Rappi/ToTeat.");
      }
    } catch {
      setSyncLog("Error de conexión.");
    }
    setSyncLoading(false);
    setTimeout(() => setSyncLog(""), 6000);
  };

  // Product CRUD
  const openAddProduct = () => {
    setEditingProduct(null);
    setFormName("");
    setFormDesc("");
    setFormPrice("");
    setFormCategory("tablas");
    setFormImage("");
    setFormPopular(false);
    setFormActive(true);
    setProductFormOpen(true);
  };

  const openEditProduct = (item: MenuItem) => {
    setEditingProduct(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price.toString());
    setFormCategory(item.category);
    setFormImage(item.image || "");
    setFormPopular(item.popular || false);
    setFormActive(true); 
    setProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      id: editingProduct?.id || undefined,
      name: formName,
      description: formDesc,
      price: parseInt(formPrice, 10),
      category: formCategory,
      image_url: formImage || null,
      popular: formPopular,
      active: formActive,
    };

    const method = editingProduct ? "PUT" : "POST";
    const res = await fetch("/api/products", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": password,
      },
      body: JSON.stringify(productData),
    });

    if (res.ok) {
      setProductFormOpen(false);
      await fetchMenu();
    } else {
      alert("Error al guardar el producto.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    const res = await fetch(`/api/products?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": password },
    });

    if (res.ok) {
      await fetchMenu();
    } else {
      alert("Error al eliminar el producto.");
    }
  };

  // Event CRUD
  const openAddEvent = () => {
    setEditingEvent(null);
    setEventTitle("");
    setEventDesc("");
    setEventDate("");
    setEventType("musica");
    setEventImage("");
    setEventActive(true);
    setEventFormOpen(true);
  };

  const openEditEvent = (item: any) => {
    setEditingEvent(item);
    setEventTitle(item.title);
    setEventDesc(item.description || "");
    setEventDate(item.event_date ? item.event_date.split("T")[0] : "");
    setEventType(item.event_type);
    setEventImage(item.image_url || "");
    setEventActive(item.active !== false);
    setEventFormOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      id: editingEvent?.id || undefined,
      title: eventTitle,
      description: eventDesc,
      event_date: eventDate,
      event_type: eventType,
      image_url: eventImage || null,
      active: eventActive,
    };

    const method = editingEvent ? "PUT" : "POST";
    const res = await fetch("/api/events", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": password,
      },
      body: JSON.stringify(eventData),
    });

    if (res.ok) {
      setEventFormOpen(false);
      await fetchEvents(password);
    } else {
      alert("Error al guardar el evento.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;

    const res = await fetch(`/api/events?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": password },
    });

    if (res.ok) {
      await fetchEvents(password);
    } else {
      alert("Error al eliminar el evento.");
    }
  };

  // Gallery CRUD
  const openAddGallery = () => {
    setEditingGallery(null);
    setGalleryImage("");
    setGalleryAlt("");
    setGalleryCategory("platos");
    setGalleryOrder("0");
    setGalleryActive(true);
    setGalleryFormOpen(true);
  };

  const openEditGallery = (item: any) => {
    setEditingGallery(item);
    setGalleryImage(item.image_url);
    setGalleryAlt(item.alt_text || "");
    setGalleryCategory(item.category);
    setGalleryOrder((item.sort_order ?? 0).toString());
    setGalleryActive(item.active !== false);
    setGalleryFormOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const galleryData = {
      id: editingGallery?.id || undefined,
      image_url: galleryImage,
      alt_text: galleryAlt,
      category: galleryCategory,
      sort_order: parseInt(galleryOrder, 10),
      active: galleryActive,
    };

    const method = editingGallery ? "PUT" : "POST";
    const res = await fetch("/api/gallery", {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": password,
      },
      body: JSON.stringify(galleryData),
    });

    if (res.ok) {
      setGalleryFormOpen(false);
      await fetchGallery(password);
    } else {
      alert("Error al guardar la imagen.");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta imagen de la galería?")) return;

    const res = await fetch(`/api/gallery?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": password },
    });

    if (res.ok) {
      await fetchGallery(password);
    } else {
      alert("Error al eliminar la imagen de la galería.");
    }
  };

  // Order & Reservation Status Changes
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const res = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": password,
      },
      body: JSON.stringify({ ...order, status }),
    });

    if (res.ok) {
      await fetchAdminData(password);
    } else {
      alert("Error al actualizar estado del pedido.");
    }
  };

  const handleUpdateReservationStatus = async (resId: string, status: string) => {
    const reservation = reservations.find((r) => r.id === resId);
    if (!reservation) return;

    const res = await fetch("/api/admin/reservations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": password,
      },
      body: JSON.stringify({ ...reservation, status }),
    });

    if (res.ok) {
      await fetchAdminData(password);
    } else {
      alert("Error al actualizar estado de la reserva.");
    }
  };

  useEffect(() => {
    if (authenticated) {
      if (activeTab === "products") {
        fetchMenu();
      } else if (activeTab === "events") {
        fetchEvents(password);
      } else if (activeTab === "gallery") {
        fetchGallery(password);
      }
    }
  }, [activeTab, authenticated, password, fetchMenu, fetchEvents, fetchGallery]);

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
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-white text-center"
          />
          {error && <p className="text-balu-red text-center text-sm">{error}</p>}
          {forgotMessage && <p className="text-balu-gold text-center text-sm mt-2">{forgotMessage}</p>}
          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full py-2 mb-2 bg-balu-gold/70 text-balu-dark font-semibold rounded-lg hover:bg-balu-gold-light transition"
          >
            Restablecer contraseña
          </button>
          <button type="submit" className="w-full py-3 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:bg-balu-gold-light transition">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: "products" as const, label: "Productos", icon: Package },
    { id: "orders" as const, label: "Pedidos", icon: ShoppingCart },
    { id: "reservations" as const, label: "Reservas", icon: Users },
    { id: "events" as const, label: "Eventos", icon: CalendarDays },
    { id: "gallery" as const, label: "Galería", icon: Image },
    { id: "stats" as const, label: "Estadísticas", icon: TrendingUp },
  ];

  // Stats calculation
  const totalSales = orders
    .filter((o) => o.status === "completed" || o.status === "confirmed")
    .reduce((s, o) => s + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeReservations = reservations.filter((r) => r.status === "pending" || r.status === "confirmed").length;

  const salesByPaymentMethod = orders
    .filter((o) => o.status === "completed" || o.status === "confirmed")
    .reduce((acc, o) => {
      const method = o.payment_method || "whatsapp";
      acc[method] = (acc[method] || 0) + o.total;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-balu-dark text-neutral-200">
      <header className="border-b border-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl">
            <span className="text-balu-gold">Balu</span> Admin
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            Base de datos: <span className="text-neutral-400 capitalize">{menuSource}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSyncPrices}
            disabled={syncLoading}
            className="px-4 py-2 border border-balu-gold/30 rounded-lg text-balu-gold text-xs hover:bg-balu-gold/10 transition disabled:opacity-50"
          >
            {syncLoading ? "Sincronizando..." : "Sincronizar Rappi/ToTeat"}
          </button>
          <a href="/" className="px-4 py-2 bg-white/5 rounded-lg text-xs hover:bg-white/10 transition">
            ← Volver al sitio
          </a>
        </div>
      </header>

      {syncLog && (
        <div className="bg-balu-gold/20 border-b border-balu-gold/30 text-balu-gold px-6 py-2.5 text-center text-xs">
          {syncLog}
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        <nav className="md:w-56 border-b md:border-b-0 md:border-r border-white/5 p-4 flex md:flex-col gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-balu-gold/10 text-balu-gold font-semibold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6 md:p-8">
          {loading && <p className="text-neutral-500 text-sm mb-4">Cargando datos...</p>}

          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl">Productos ({menuItems.length})</h2>
                <button
                  onClick={openAddProduct}
                  className="flex items-center gap-1 px-4 py-2 bg-balu-gold text-balu-dark font-semibold rounded-lg text-sm hover:bg-balu-gold-light transition"
                >
                  <Plus className="h-4 w-4" /> Agregar Producto
                </button>
              </div>

              <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500 text-xs uppercase tracking-wider">
                      <th className="p-4">Imagen</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Rappi/ToTeat</th>
                      <th className="p-4 text-center">Popular</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-neutral-600 text-xs">Sin foto</div>
                          )}
                        </td>
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4 capitalize text-neutral-400">{item.category}</td>
                        <td className="p-4 text-balu-gold font-semibold">{formatCLP(item.price)}</td>
                        <td className="p-4 text-xs text-neutral-500">
                          {item.rappi_price ? `R: ${formatCLP(item.rappi_price)}` : ""}
                          {item.toteat_price ? ` | T: ${formatCLP(item.toteat_price)}` : "No sync"}
                        </td>
                        <td className="p-4 text-center">{item.popular ? "⭐" : "—"}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => openEditProduct(item)}
                            className="p-2 border border-white/10 rounded hover:border-balu-gold hover:text-balu-gold transition"
                            title="Editar"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-2 border border-white/10 rounded hover:border-balu-red hover:text-balu-red transition"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
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
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-lg">{order.customer_name}</span>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                              order.status === "completed" ? "bg-green-500/20 text-green-400" :
                              order.status === "confirmed" ? "bg-blue-500/20 text-blue-400" :
                              order.status === "cancelled" ? "bg-balu-red/20 text-balu-red-light" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-neutral-500 text-xs mt-1">
                            {new Date(order.created_at).toLocaleString("es-CL")} · {order.payment_method.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-balu-gold font-semibold text-lg">{formatCLP(order.total)}</p>
                          <p className="text-xs text-neutral-500">Subtotal: {formatCLP(order.subtotal)}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <p className="text-xs text-neutral-500 mb-2">Detalles del Cliente:</p>
                        <p className="text-sm">📍 Dirección: {order.customer_address}</p>
                        {order.customer_phone && <p className="text-sm">📞 Teléfono: {order.customer_phone}</p>}
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <p className="text-xs text-neutral-500 mb-2">Productos:</p>
                        <div className="space-y-1">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-neutral-400">{item.quantity}x {item.name}</span>
                              <span>{formatCLP(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5 justify-end">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "confirmed")}
                            className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                          >
                            Confirmar Pago
                          </button>
                        )}
                        {(order.status === "pending" || order.status === "confirmed") && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                            className="px-3.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                          >
                            Completar Pedido
                          </button>
                        )}
                        {order.status !== "cancelled" && order.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                            className="px-3.5 py-1.5 border border-balu-red/40 text-balu-red-light text-xs font-semibold rounded-lg hover:bg-balu-red/10 transition"
                          >
                            Cancelar
                          </button>
                        )}
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
                <div className="space-y-4">
                  {reservations.map((r) => (
                    <div key={r.id} className="p-6 rounded-xl border border-white/10 bg-white/5 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-lg">{r.name}</span>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                              r.status === "completed" ? "bg-green-500/20 text-green-400" :
                              r.status === "confirmed" ? "bg-blue-500/20 text-blue-400" :
                              r.status === "cancelled" ? "bg-balu-red/20 text-balu-red-light" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {r.status}
                            </span>
                          </div>
                          <p className="text-neutral-400 text-sm mt-1">
                            📅 {r.date} · 🕐 {r.time} · 👥 {r.guests} {r.guests === 1 ? "persona" : "personas"}
                          </p>
                        </div>
                        <div className="text-right text-xs text-neutral-500">
                          Reserva: {new Date(r.created_at).toLocaleString("es-CL")}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3">
                        <p className="text-sm">📞 Teléfono: {r.phone} · ✉️ Email: {r.email}</p>
                        {r.notes && <p className="text-sm text-neutral-400 mt-2">📝 Notas: &ldquo;{r.notes}&rdquo;</p>}
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-white/5 justify-end">
                        {r.status === "pending" && (
                          <button
                            onClick={() => handleUpdateReservationStatus(r.id, "confirmed")}
                            className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                          >
                            Confirmar Reserva
                          </button>
                        )}
                        {(r.status === "pending" || r.status === "confirmed") && (
                          <button
                            onClick={() => handleUpdateReservationStatus(r.id, "completed")}
                            className="px-3.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition"
                          >
                            Marcar Completada
                          </button>
                        )}
                        {r.status !== "cancelled" && r.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateReservationStatus(r.id, "cancelled")}
                            className="px-3.5 py-1.5 border border-balu-red/40 text-balu-red-light text-xs font-semibold rounded-lg hover:bg-balu-red/10 transition"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl">Eventos ({events.length})</h2>
                <button
                  onClick={openAddEvent}
                  className="flex items-center gap-1 px-4 py-2 bg-balu-gold text-balu-dark font-semibold rounded-lg text-sm hover:bg-balu-gold-light transition"
                >
                  <Plus className="h-4 w-4" /> Agregar Evento
                </button>
              </div>

              {events.length === 0 ? (
                <p className="text-neutral-500">No hay eventos registrados aún.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((e) => (
                    <div key={e.id} className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden relative flex flex-col justify-between ${!e.active ? "opacity-50" : ""}`}>
                      <div>
                        {e.image_url ? (
                          <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover" />
                        ) : (
                          <div className="w-full h-40 bg-white/5 flex items-center justify-center text-neutral-600 text-xs">Sin imagen</div>
                        )}
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs uppercase px-2 py-0.5 rounded bg-balu-gold/25 text-balu-gold font-medium">
                              {EVENT_TYPES.find((t) => t.id === e.event_type)?.label || e.event_type}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">
                              {e.event_date ? e.event_date.split("T")[0] : ""}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-semibold">{e.title}</h3>
                          <p className="text-sm text-neutral-400 line-clamp-3">{e.description}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0">
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <span className="text-xs text-neutral-500">{e.active ? "🟢 Activo" : "🔴 Inactivo"}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditEvent(e)}
                              className="p-1.5 border border-white/10 rounded hover:border-balu-gold hover:text-balu-gold transition"
                              title="Editar"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(e.id)}
                              className="p-1.5 border border-white/10 rounded hover:border-balu-red hover:text-balu-red transition"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-2xl">Galería ({gallery.length})</h2>
                <button
                  onClick={openAddGallery}
                  className="flex items-center gap-1 px-4 py-2 bg-balu-gold text-balu-dark font-semibold rounded-lg text-sm hover:bg-balu-gold-light transition"
                >
                  <Plus className="h-4 w-4" /> Agregar Imagen
                </button>
              </div>

              {gallery.length === 0 ? (
                <p className="text-neutral-500">No hay imágenes en la galería aún.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((item) => (
                    <div key={item.id} className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between ${!item.active ? "opacity-50" : ""}`}>
                      <div>
                        <img src={item.image_url} alt={item.alt_text || "Foto Galería"} className="w-full h-32 object-cover" />
                        <div className="p-3 space-y-1">
                          <div className="flex justify-between text-[10px] text-neutral-500 uppercase font-mono">
                            <span className="truncate">{item.category}</span>
                            <span>Orden: {item.sort_order ?? 0}</span>
                          </div>
                          {item.alt_text && <p className="text-xs text-neutral-300 truncate">{item.alt_text}</p>}
                        </div>
                      </div>

                      <div className="p-3 pt-0">
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                          <span className="text-[10px] text-neutral-500 font-mono">{item.active ? "🟢 Activa" : "🔴 Inactiva"}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditGallery(item)}
                              className="p-1 border border-white/10 rounded hover:border-balu-gold hover:text-balu-gold transition"
                              title="Editar"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteGallery(item.id)}
                              className="p-1 border border-white/10 rounded hover:border-balu-red hover:text-balu-red transition"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-8">
              <h2 className="font-display text-2xl mb-6">Estadísticas</h2>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Productos activos", value: menuItems.length },
                  { label: "Pedidos pendientes", value: pendingOrders },
                  { label: "Reservas activas", value: activeReservations },
                  { label: "Ventas registradas (excl. canceladas)", value: formatCLP(totalSales) },
                ].map((stat) => (
                  <div key={stat.label} className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-neutral-500 text-sm">{stat.label}</p>
                    <p className="font-display text-2xl text-balu-gold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Distribution Chart */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-display text-lg mb-6">Distribución de Productos por Categoría</h3>
                  <div className="space-y-4">
                    {CATEGORIES.map((cat) => {
                      const count = menuItems.filter((p) => p.category === cat).length;
                      const percent = menuItems.length > 0 ? (count / menuItems.length) * 100 : 0;

                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{cat}</span>
                            <span className="text-neutral-400">{count} productos ({percent.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-balu-gold" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sales by Payment Method Chart */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-display text-lg mb-6">Ventas por Método de Pago</h3>
                  <div className="space-y-4">
                    {Object.entries({
                      webpay: "Webpay Plus",
                      mercadopago: "Mercado Pago",
                      stripe: "Stripe (Tarjeta)",
                      transferencia: "Transferencia",
                      whatsapp: "WhatsApp / Efectivo"
                    }).map(([key, label]) => {
                      const amount = salesByPaymentMethod[key] || 0;
                      const maxAmount = Object.values(salesByPaymentMethod).reduce((a, b) => Math.max(a, b), 0) || 1;
                      const percent = (amount / maxAmount) * 100;

                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{label}</span>
                            <span className="text-balu-gold font-medium">{formatCLP(amount)}</span>
                          </div>
                          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Inline overlay Modal for CRUD Product Form */}
      {productFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-balu-charcoal border border-white/10 rounded-2xl p-6 relative">
            <button onClick={() => setProductFormOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-display text-xl mb-4">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Nombre</label>
                <input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  placeholder="Ej. Burger Balu"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Descripción</label>
                <textarea
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white resize-none"
                  placeholder="Detalle del producto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Precio (CLP)</label>
                  <input
                    required
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                    placeholder="Ej. 11900"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MenuCategory)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-balu-charcoal capitalize">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">URL de Imagen</label>
                <input
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formPopular}
                    onChange={(e) => setFormPopular(e.target.checked)}
                    className="accent-balu-gold"
                  />
                  Producto Popular ⭐
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="accent-balu-gold"
                  />
                  Activo en Carta
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:bg-balu-gold-light transition text-sm">
                  Guardar Producto
                </button>
                <button
                  type="button"
                  onClick={() => setProductFormOpen(false)}
                  className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay Modal for CRUD Event Form */}
      {eventFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-balu-charcoal border border-white/10 rounded-2xl p-6 relative">
            <button onClick={() => setEventFormOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-display text-xl mb-4">
              {editingEvent ? "Editar Evento" : "Nuevo Evento"}
            </h2>
            <form onSubmit={handleSaveEvent} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Título</label>
                <input
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  placeholder="Ej. Noche de Jazz"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Descripción</label>
                <textarea
                  required
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white resize-none"
                  placeholder="Presentación especial..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Fecha</label>
                  <input
                    required
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white font-sans"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Tipo de Evento</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.id} value={t.id} className="bg-balu-charcoal">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">URL de la Imagen</label>
                <input
                  value={eventImage}
                  onChange={(e) => setEventImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eventActive}
                    onChange={(e) => setEventActive(e.target.checked)}
                    className="accent-balu-gold"
                  />
                  Activo en Agenda
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:bg-balu-gold-light transition text-sm">
                  Guardar Evento
                </button>
                <button
                  type="button"
                  onClick={() => setEventFormOpen(false)}
                  className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overlay Modal for CRUD Gallery Form */}
      {galleryFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-balu-charcoal border border-white/10 rounded-2xl p-6 relative">
            <button onClick={() => setGalleryFormOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-display text-xl mb-4">
              {editingGallery ? "Editar Imagen" : "Nueva Imagen"}
            </h2>
            <form onSubmit={handleSaveGallery} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">URL de la Imagen</label>
                <input
                  required
                  value={galleryImage}
                  onChange={(e) => setGalleryImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Texto Alternativo (Alt)</label>
                <input
                  value={galleryAlt}
                  onChange={(e) => setGalleryAlt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  placeholder="Ej. Delicioso postre de chocolate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Categoría</label>
                  <select
                    value={galleryCategory}
                    onChange={(e) => setGalleryCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                  >
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} className="bg-balu-charcoal capitalize">{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 uppercase tracking-wider block mb-1">Orden de Visualización</label>
                  <input
                    required
                    type="number"
                    value={galleryOrder}
                    onChange={(e) => setGalleryOrder(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-balu-gold outline-none text-sm text-white"
                    placeholder="Ej. 1"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={galleryActive}
                    onChange={(e) => setGalleryActive(e.target.checked)}
                    className="accent-balu-gold"
                  />
                  Activa en Galería
                </label>
              </div>

              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-balu-gold text-balu-dark font-semibold rounded-lg hover:bg-balu-gold-light transition text-sm">
                  Guardar Imagen
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryFormOpen(false)}
                  className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
