import { NextResponse } from "next/server";
import { getMenuWithSource } from "@/lib/menu";

export async function GET() {
  const { items, source } = await getMenuWithSource();

  return NextResponse.json({ items, source });
}
