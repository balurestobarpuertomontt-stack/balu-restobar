import { NextResponse } from "next/server";
import { saveReservation } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const reservationData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      date: body.date,
      time: body.time,
      guests: parseInt(body.guests, 10),
      notes: body.notes ?? null,
    };

    const saved = await saveReservation(reservationData);

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("Reservation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

