import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("reservations").insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        date: body.date,
        time: body.time,
        guests: parseInt(body.guests, 10),
        notes: body.notes ?? null,
      });

      if (error) {
        console.error("Supabase reservation error:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
