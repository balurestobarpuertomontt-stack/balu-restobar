export type MenuCategory =
  | "tablas"
  | "burgers"
  | "sandwiches"
  | "platos"
  | "infantil"
  | "bebidas"
  | "cocteles";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  popular?: boolean;
  rappi_price?: number;
  toteat_price?: number;
  synced_at?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type PaymentMethod =
  | "webpay"
  | "mercadopago"
  | "stripe"
  | "transferencia"
  | "whatsapp";

export interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface Order {
  id?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tip: number;
  delivery: number;
  total: number;
  customerName: string;
  customerAddress: string;
  paymentMethod: PaymentMethod;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "musica" | "karaoke" | "cumpleanos" | "privado";
  image: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: "google" | "facebook";
  date: string;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "comidas" | "cocteles" | "clientes" | "eventos" | "local";
  height?: "short" | "medium" | "tall";
}
