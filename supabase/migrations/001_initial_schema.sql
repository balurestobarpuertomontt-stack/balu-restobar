-- Balu Restobar — Schema inicial Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Productos / Carta
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'tablas', 'burgers', 'sandwiches', 'platos', 'infantil', 'bebidas', 'cocteles'
  )),
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  rappi_price INTEGER,
  toteat_price INTEGER,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  tip INTEGER DEFAULT 0,
  delivery_fee INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  coupon_code TEXT,
  loyalty_points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reservas
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT CHECK (event_type IN ('musica', 'karaoke', 'cumpleanos', 'privado')),
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cupones
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC(5,2) NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Programa de fidelización
CREATE TABLE IF NOT EXISTS loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  points INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Galería
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  category TEXT CHECK (category IN ('comidas', 'cocteles', 'clientes', 'eventos', 'local')),
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_events_date ON events(event_date);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (active = true);
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (active = true);
CREATE POLICY "Gallery is viewable by everyone" ON gallery FOR SELECT USING (active = true);

-- Políticas de inserción pública (pedidos y reservas)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create reservations" ON reservations FOR INSERT WITH CHECK (true);

-- Cupones semilla
INSERT INTO coupons (code, discount_percent, max_uses) VALUES
  ('BALU10', 10, 1000),
  ('AMIGOS15', 15, 500),
  ('BIENVENIDO', 5, NULL)
ON CONFLICT (code) DO NOTHING;

-- Productos semilla
INSERT INTO products (slug, name, description, price, category, popular) VALUES
  ('picadita-balu', 'Picadita Balu', 'Selección de quesos, jamones, aceitunas y dips', 12900, 'tablas', true),
  ('tabla-mix-carnes', 'Tabla Mix de Carnes', 'Carnes ahumadas y salsas especiales', 18900, 'tablas', false),
  ('chorillana-4', 'Chorillana para 4 Personas', 'Papas, carne, cebolla y huevo', 15900, 'tablas', true),
  ('burger-balu', 'Burger Balu', 'Angus 200g, queso cheddar, salsa Balu', 11900, 'burgers', true),
  ('burger-gringa', 'Burger La Gringa', 'Doble carne, queso americano', 10900, 'burgers', false),
  ('ceviche-balu', 'Ceviche Balú', 'Pesca del día, leche de tigre', 12900, 'platos', true),
  ('salmon-plancha', 'Salmón a la Plancha', 'Filete con vegetales y arroz', 14500, 'platos', false),
  ('sandwich-balu', 'Sándwich Balú', 'Lomo vetado en pan artesanal', 9900, 'sandwiches', true),
  ('pisco-sour', 'Pisco Sour', 'Clásico peruano', 6500, 'cocteles', true)
ON CONFLICT (slug) DO NOTHING;
