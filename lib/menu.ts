import { MENU_ITEMS, MENU_CATEGORIES } from "@/lib/menu-data";
import { getProducts, isDbSupabaseEnabled } from "@/lib/db";
import type { MenuCategory, MenuItem } from "@/types";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  popular: boolean | null;
  active: boolean | null;
  rappi_price?: number | null;
  toteat_price?: number | null;
  synced_at?: string | null;
}

function mapProductToMenuItem(row: ProductRow): MenuItem {
  return {
    id: row.slug || row.id,
    name: row.name,
    description: row.description ?? "",
    price: row.price,
    category: row.category as MenuCategory,
    image: row.image_url ?? undefined,
    popular: row.popular ?? undefined,
    rappi_price: row.rappi_price ?? undefined,
    toteat_price: row.toteat_price ?? undefined,
    synced_at: row.synced_at ?? undefined,
  };
}

/** Static menu — always available without Supabase. */
export function getStaticMenuItems(): MenuItem[] {
  return MENU_ITEMS;
}

export function getMenuCategories(): readonly MenuCategory[] {
  return MENU_CATEGORIES;
}

/**
 * Loads menu from database (Supabase or local JSON).
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { items } = await getMenuWithSource();
  return items;
}

export async function getMenuWithSource(): Promise<{
  items: MenuItem[];
  source: "supabase" | "local" | "static";
}> {
  try {
    const products = await getProducts();
    const activeProducts = products.filter((row: any) => row.active !== false);

    if (activeProducts.length === 0) {
      return { items: MENU_ITEMS, source: "static" };
    }

    return {
      items: activeProducts.map((row) => mapProductToMenuItem(row as ProductRow)),
      source: isDbSupabaseEnabled() ? "supabase" : "local",
    };
  } catch (err) {
    console.error("Error fetching menu items:", err);
    return { items: MENU_ITEMS, source: "static" };
  }
}

export async function getMenuSource(): Promise<"supabase" | "local" | "static"> {
  const { source } = await getMenuWithSource();
  return source;
}

