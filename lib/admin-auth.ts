import type { NextRequest } from "next/server";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "balu2026";
}

export function isAdminAuthorized(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  return key === getAdminPassword();
}

export function isValidAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}
