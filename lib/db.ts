import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { MENU_ITEMS } from "./menu-data";
import type { MenuItem, MenuCategory } from "@/types";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const isSupabaseEnabled = Boolean(supabaseUrl && supabaseServiceKey);

// Supabase client (using service role key to bypass RLS in backend API routes)
const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

// Local JSON File Database Fallback (for local development)
const DB_FILE_PATH = path.join(process.cwd(), "database.json");

interface LocalDB {
  products: any[];
  orders: any[];
  reservations: any[];
  events: any[];
  gallery: any[];
}

const DEFAULT_EVENTS = [
  {
    id: "event-1",
    title: "Noche de Jazz en Vivo",
    description: "Trío de jazz con selección de vinos",
    event_date: "2026-07-05",
    event_type: "musica",
    image_url: "/images/real/design.jpg",
    active: true,
  },
  {
    id: "event-2",
    title: "Karaoke Night",
    description: "Canta tus favoritos con tragos 2x1",
    event_date: "2026-07-10",
    event_type: "karaoke",
    image_url: "/images/real/interior2.jpg",
    active: true,
  },
  {
    id: "event-3",
    title: "Noche de Tablas",
    description: "Promoción especial en tablas para compartir",
    event_date: "2026-07-15",
    event_type: "privado",
    image_url: "/images/real/meals.jpg",
    active: true,
  },
];

const DEFAULT_GALLERY = [
  { id: "g-1", image_url: "/images/real/interior.jpg", alt_text: "Interior del Restobar", category: "local", sort_order: 0, active: true },
  { id: "g-2", image_url: "/images/real/dishes.jpg", alt_text: "Platos destacados", category: "comidas", sort_order: 1, active: true },
  { id: "g-3", image_url: "/images/real/exterior.jpg", alt_text: "Fachada Exterior", category: "local", sort_order: 2, active: true },
  { id: "g-4", image_url: "/images/real/meals.jpg", alt_text: "Comida deliciosa", category: "comidas", sort_order: 3, active: true },
  { id: "g-5", image_url: "/images/real/design.jpg", alt_text: "Diseño del bar", category: "local", sort_order: 4, active: true },
  { id: "g-6", image_url: "/images/real/food.jpg", alt_text: "Plato de la casa", category: "comidas", sort_order: 5, active: true },
  { id: "g-7", image_url: "/images/real/interior2.jpg", alt_text: "Ambiente", category: "local", sort_order: 6, active: true },
];

function readLocalDB(): LocalDB {
  if (!fs.existsSync(DB_FILE_PATH)) {
    // Map initial static menu
    const initialProducts = MENU_ITEMS.map((item) => ({
      id: item.id,
      slug: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image || null,
      popular: item.popular || false,
      active: true,
      rappi_price: null,
      toteat_price: null,
      synced_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const db: LocalDB = {
      products: initialProducts,
      orders: [],
      reservations: [],
      events: DEFAULT_EVENTS,
      gallery: DEFAULT_GALLERY,
    };
    writeLocalDB(db);
    return db;
  }
  try {
    const content = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading local db file, returning empty db:", err);
    return { products: [], orders: [], reservations: [], events: [], gallery: [] };
  }
}

function writeLocalDB(db: LocalDB) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local db file:", err);
  }
}

export async function getProducts(): Promise<any[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("category")
      .order("name");
    if (!error && data) return data.map((d: any) => ({ ...d, image: d.image_url }));
    console.error("Supabase products fetch failed, using local db:", error);
  }
  return readLocalDB().products.map((d: any) => ({ ...d, image: d.image_url }));
}

export async function saveProduct(product: any): Promise<any> {
  const cleanProduct = {
    ...product,
    slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("products")
      .upsert(cleanProduct, { onConflict: "slug" })
      .select();
    if (!error && data && data.length > 0) return data[0];
    console.error("Supabase product save failed, saving locally:", error);
  }

  const db = readLocalDB();
  const index = db.products.findIndex((p) => p.slug === cleanProduct.slug || p.id === cleanProduct.id);
  if (index >= 0) {
    db.products[index] = { ...db.products[index], ...cleanProduct };
  } else {
    cleanProduct.id = cleanProduct.id || Math.random().toString(36).substring(2, 11);
    cleanProduct.created_at = new Date().toISOString();
    db.products.push(cleanProduct);
  }
  writeLocalDB(db);
  return cleanProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) return true;
    // fallback by slug if id wasn't UUID
    const { error: errorSlug } = await supabase.from("products").delete().eq("slug", id);
    if (!errorSlug) return true;
    console.error("Supabase product delete failed, deleting locally:", error || errorSlug);
  }

  const db = readLocalDB();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id && p.slug !== id);
  writeLocalDB(db);
  return db.products.length < initialLen;
}

export async function getOrders(): Promise<any[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data;
    console.error("Supabase orders fetch failed, using local db:", error);
  }
  return readLocalDB().orders;
}

export async function saveOrder(order: any): Promise<any> {
  const cleanOrder = {
    ...order,
    created_at: order.created_at || new Date().toISOString(),
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("orders")
      .upsert(cleanOrder)
      .select();
    if (!error && data && data.length > 0) return data[0];
    console.error("Supabase order save failed, saving locally:", error);
  }

  const db = readLocalDB();
  cleanOrder.id = cleanOrder.id || Math.random().toString(36).substring(2, 11);
  const index = db.orders.findIndex((o) => o.id === cleanOrder.id);
  if (index >= 0) {
    db.orders[index] = { ...db.orders[index], ...cleanOrder };
  } else {
    db.orders.push(cleanOrder);
  }
  writeLocalDB(db);
  return cleanOrder;
}

export async function getReservations(): Promise<any[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });
    if (!error && data) return data;
    console.error("Supabase reservations fetch failed, using local db:", error);
  }
  return readLocalDB().reservations;
}

export async function saveReservation(reservation: any): Promise<any> {
  const cleanReservation = {
    ...reservation,
    created_at: reservation.created_at || new Date().toISOString(),
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("reservations")
      .upsert(cleanReservation)
      .select();
    if (!error && data && data.length > 0) return data[0];
    console.error("Supabase reservation save failed, saving locally:", error);
  }

  const db = readLocalDB();
  cleanReservation.id = cleanReservation.id || Math.random().toString(36).substring(2, 11);
  const index = db.reservations.findIndex((r) => r.id === cleanReservation.id);
  if (index >= 0) {
    db.reservations[index] = { ...db.reservations[index], ...cleanReservation };
  } else {
    db.reservations.push(cleanReservation);
  }
  writeLocalDB(db);
  return cleanReservation;
}

export async function getEvents(): Promise<any[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (!error && data) return data;
    console.error("Supabase events fetch failed, using local db:", error);
  }
  return readLocalDB().events;
}

export async function saveEvent(event: any): Promise<any> {
  const cleanEvent = {
    ...event,
    created_at: event.created_at || new Date().toISOString(),
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("events")
      .upsert(cleanEvent)
      .select();
    if (!error && data && data.length > 0) return data[0];
    console.error("Supabase event save failed, saving locally:", error);
  }

  const db = readLocalDB();
  cleanEvent.id = cleanEvent.id || Math.random().toString(36).substring(2, 11);
  const index = db.events.findIndex((e) => e.id === cleanEvent.id);
  if (index >= 0) {
    db.events[index] = { ...db.events[index], ...cleanEvent };
  } else {
    db.events.push(cleanEvent);
  }
  writeLocalDB(db);
  return cleanEvent;
}

export async function deleteEvent(id: string): Promise<boolean> {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) return true;
    console.error("Supabase event delete failed, deleting locally:", error);
  }

  const db = readLocalDB();
  const initialLen = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  writeLocalDB(db);
  return db.events.length < initialLen;
}

export async function getGallery(): Promise<any[]> {
  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) return data;
    console.error("Supabase gallery fetch failed, using local db:", error);
  }
  return readLocalDB().gallery;
}

export async function saveGalleryItem(item: any): Promise<any> {
  const cleanItem = {
    ...item,
    created_at: item.created_at || new Date().toISOString(),
  };

  if (isSupabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from("gallery")
      .upsert(cleanItem)
      .select();
    if (!error && data && data.length > 0) return data[0];
    console.error("Supabase gallery save failed, saving locally:", error);
  }

  const db = readLocalDB();
  cleanItem.id = cleanItem.id || Math.random().toString(36).substring(2, 11);
  const index = db.gallery.findIndex((g) => g.id === cleanItem.id);
  if (index >= 0) {
    db.gallery[index] = { ...db.gallery[index], ...cleanItem };
  } else {
    db.gallery.push(cleanItem);
  }
  writeLocalDB(db);
  return cleanItem;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (isSupabaseEnabled && supabase) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) return true;
    console.error("Supabase gallery delete failed, deleting locally:", error);
  }

  const db = readLocalDB();
  const initialLen = db.gallery.length;
  db.gallery = db.gallery.filter((g) => g.id !== id);
  writeLocalDB(db);
  return db.gallery.length < initialLen;
}

export function isDbSupabaseEnabled(): boolean {
  return isSupabaseEnabled;
}
