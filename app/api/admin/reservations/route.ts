import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-auth";
import { getReservations, saveReservation } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const reservations = await getReservations();
    return NextResponse.json({ data: reservations, configured: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Falta ID o estado" }, { status: 400 });
    }

    const updated = await saveReservation(body);

    // Optionally mock sending email/whatsapp confirmation to client:
    console.log(`Reservation ${body.id} status updated to: ${body.status}`);
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

