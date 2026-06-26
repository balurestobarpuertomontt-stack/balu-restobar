import { NextResponse } from "next/server";
import { getGallery } from "@/lib/db";

export async function GET() {
  try {
    const items = await getGallery();
    const activeItems = items.filter((item: any) => item.active !== false);
    return NextResponse.json({ success: true, data: activeItems });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
