import { NextRequest, NextResponse } from "next/server";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "balu2026";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || password !== getAdminPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
