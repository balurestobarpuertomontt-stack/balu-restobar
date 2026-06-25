import { MENU_ITEMS, MENU_CATEGORIES } from "@/lib/menu-data";
import { createServerSupabase, isServerSupabaseConfigured } from "@/lib/supabase/server";
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
 * Loads menu from Supabase when configured, otherwise returns static menu-data.
 * Safe to call without any external credentials.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { items } = await getMenuWithSource();
  return items;
}

export async function getMenuWithSource(): Promise<{
  items: MenuItem[];
  source: "supabase" | "static";
}> {
  if (!isServerSupabaseConfigured()) {
    return { items: MENU_ITEMS, source: "static" };
  }

  const supabase = createServerSupabase();
  if (!supabase) {
    return { items: MENU_ITEMS, source: "static" };
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, price, category, image_url, popular, active")
    .eq("active", true)
    .order("category")
    .order("name");

  if (error || !data?.length) {
    return { items: MENU_ITEMS, source: "static" };
  }

  return {
    items: data.map((row) => mapProductToMenuItem(row as ProductRow)),
    source: "supabase",
  };
}

export async function getMenuSource(): Promise<"supabase" | "static"> {
  const { source } = await getMenuWithSource();
  return source;
}
