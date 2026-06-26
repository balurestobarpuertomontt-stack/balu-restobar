import { NextResponse } from "next/server";
import { getEvents } from "@/lib/db";

export async function GET() {
  try {
    const events = await getEvents();
    const activeEvents = events.filter((e: any) => e.active !== false);
    return NextResponse.json({ success: true, data: activeEvents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
