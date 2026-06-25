export const SITE = {
  name: "Balu Restobar",
  slogan: "El sabor que reúne amigos",
  description:
    "Restobar premium en Puerto Montt. Tablas, burgers, cócteles y la mejor experiencia gastronómica.",
  url: "https://balurestobar.cl",
  phone: "+56957409978",
  phoneDisplay: "+56 9 5740 9978",
  email: "contacto@balurestobar.cl",
  address: "Quillota 180, Puerto Montt, Chile",
  coordinates: { lat: -41.4717, lng: -72.9369 },
  whatsapp: "56957409978",
  social: {
    instagram: "https://instagram.com/balurestobar",
    facebook: "https://facebook.com/balurestobar",
    tiktok: "https://tiktok.com/@balurestobar",
  },
  hours: "Lun–Dom 12:00 – 01:00",
} as const;

export const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#carta", label: "Carta" },
  { href: "#galeria", label: "Galería" },
  { href: "#eventos", label: "Eventos" },
  { href: "#reservas", label: "Reservas" },
  { href: "#opiniones", label: "Opiniones" },
  { href: "#redes", label: "Redes" },
  { href: "#ubicacion", label: "Ubicación" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  tablas: "Tablas",
  burgers: "Burgers",
  sandwiches: "Sándwiches",
  platos: "Platos Principales",
  infantil: "Menú Infantil",
  bebidas: "Bebidas",
  cocteles: "Cócteles",
};

export const DELIVERY_FEE = 2500;
export const LOYALTY_POINTS_PER_1000 = 10;
