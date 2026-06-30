import { NextRequest, NextResponse } from "next/server";
import { getGallery, saveGalleryItem, deleteGalleryItem } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const isAuthorized = isAdminAuthorized(request);
    const items = await getGallery();
    
    if (isAuthorized) {
      return NextResponse.json({ success: true, data: items });
    }
    
    const activeItems = items.filter((item: any) => item.active !== false);
    return NextResponse.json({ success: true, data: activeItems });
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
    if (!body.image_url || !body.category) {
      return NextResponse.json({ error: "Faltan campos obligatorios (image_url y category)" }, { status: 400 });
    }

    const saved = await saveGalleryItem(body);
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
      return NextResponse.json({ error: "Falta ID del elemento de la galería" }, { status: 400 });
    }

    const saved = await saveGalleryItem(body);
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
      return NextResponse.json({ error: "Falta ID del elemento de la galería" }, { status: 400 });
    }

    const deleted = await deleteGalleryItem(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
