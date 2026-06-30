import { NextRequest, NextResponse } from "next/server";
import { getEvents, saveEvent, deleteEvent } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const isAuthorized = isAdminAuthorized(request);
    const events = await getEvents();
    
    if (isAuthorized) {
      return NextResponse.json({ success: true, data: events });
    }
    
    const activeEvents = events.filter((e: any) => e.active !== false);
    return NextResponse.json({ success: true, data: activeEvents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.event_date || !body.event_type) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const saved = await saveEvent(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Falta ID del evento" }, { status: 400 });
    }

    const saved = await saveEvent(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Falta ID del evento" }, { status: 400 });
    }

    const deleted = await deleteEvent(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
