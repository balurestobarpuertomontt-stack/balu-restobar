# Despliegue en Vercel — Balu Restobar

## 1. Preparar repositorio

```bash
git add .
git commit -m "Balu Restobar — sitio completo"
git push origin main
```

## 2. Crear proyecto en Vercel

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Importar el repositorio `balu-restobar`
3. Framework: **Next.js** (detectado automáticamente)
4. Root Directory: `./`

## 3. Variables de entorno

En Vercel → Settings → Environment Variables, agregar:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (solo server) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.cl` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Contraseña panel admin |

## 4. Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor**
3. Ejecutar el contenido de `supabase/migrations/001_initial_schema.sql`
4. Copiar URL y anon key a Vercel

## 5. Dominio personalizado

1. Vercel → Settings → Domains
2. Agregar `balurestobar.cl` (o tu dominio)
3. Configurar DNS según instrucciones de Vercel

## 6. PWA / Instalable

- El manifest se genera automáticamente en `/manifest.webmanifest`
- Agregar iconos en `public/icons/` (192x192 y 512x512)
- Para service worker avanzado, considerar `@serwist/next`

## 7. Google Analytics 4

Agregar el componente GA4 en `app/layout.tsx` cuando tengas el ID:

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";
// ...
<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
```

## 8. Verificar rendimiento

```bash
npm run build
npm start
# Lighthouse en Chrome DevTools → objetivo 95+
```

## Checklist post-deploy

- [ ] Sitio carga en menos de 2s
- [ ] WhatsApp flotante funciona
- [ ] Carrito + checkout envía mensaje correcto
- [ ] Reservas envían a WhatsApp
- [ ] Mapa muestra ubicación correcta
- [ ] PWA instalable desde Chrome/Safari
- [ ] SEO: verificar con Google Search Console
- [ ] Supabase recibe pedidos y reservas
