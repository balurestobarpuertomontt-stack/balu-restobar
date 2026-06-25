# Balu Restobar

Sitio web premium one-page para **Balu Restobar** — Puerto Montt, Chile.

## Stack

- Next.js 15 · React 19 · TypeScript · Tailwind CSS
- Framer Motion · Zustand · Supabase (opcional)
- PWA · SEO avanzado · Modo oscuro/claro

## Secciones

| Sección | Descripción |
|---|---|
| Hero | Logo, slogan, CTAs con parallax |
| Nosotros | Historia, fotos, stats |
| Carta | 7 categorías, carrito integrado |
| Galería | Masonry con filtros |
| Eventos | Calendario y tipos de evento |
| Reservas | Formulario → WhatsApp + Supabase |
| Opiniones | Reseñas Google/Facebook |
| Ubicación | Google Maps interactivo |

## Carrito

- Agregar / modificar cantidades
- Cupones: `BALU10`, `AMIGOS15`, `BIENVENIDO`
- Propinas (0/10/15/20%)
- Despacho opcional
- Checkout → WhatsApp automatizado

## Setup local

```bash
npm install
cp .env.example .env.local   # placeholders — funciona sin credenciales externas
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin) — contraseña por defecto en `ADMIN_PASSWORD` (`.env.local`)

---

## Roadmap por fases

### Fase 1 — Foundation ✅ (actual)

Sitio estático funcional sin cuentas externas:

- Carta desde `lib/menu-data.ts` con capa `lib/menu.ts` (fallback automático)
- Carrito + checkout WhatsApp
- PWA (service worker, manifest, iconos PNG)
- Panel admin con auth server-side (`ADMIN_PASSWORD`)
- Reservas/pedidos listos para Supabase cuando se configure

### Fase 2 — Supabase

**Cuando tengas cuenta Supabase**, sigue estos pasos en orden:

1. Crear proyecto en [supabase.com](https://supabase.com)
2. En SQL Editor, ejecutar `supabase/migrations/001_initial_schema.sql`
3. Copiar URL y keys al `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
4. Reiniciar `npm run dev` — el menú cargará desde la tabla `products` si hay datos; si no, sigue usando el fallback estático
5. (Opcional) Importar productos desde `lib/menu-data.ts` a Supabase
6. Probar reservas y pedidos en `/admin`

### Fase 3 — Pagos

Integrar checkout real (elige uno o varios):

- **Stripe** — `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY`
- **Webpay Plus** — `WEBPAY_COMMERCE_CODE` + `WEBPAY_API_KEY`
- **Mercado Pago** — `MERCADOPAGO_ACCESS_TOKEN`

### Fase 4 — Integraciones externas

- Sincronización precios **Rappi / ToTeat** (`/api/menu/sync`)
- **Google Analytics 4** — `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **WhatsApp Business API** (opcional, reemplaza links wa.me)
- **Google/Facebook Reviews API** en vivo

### Fase 5 — Deploy Vercel

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas.

Variables de entorno en Vercel → copiar desde `.env.local` con valores de producción.

---

## Arquitectura del menú

```
lib/menu-data.ts   → fuente estática (offline)
lib/menu.ts        → getMenuItems() / getMenuWithSource()
                     intenta Supabase → fallback estático
app/api/menu       → endpoint JSON para admin
```

El sitio funciona al 100% sin Supabase configurado.

## Deploy

Ver [DEPLOY.md](./DEPLOY.md).
