import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/server/adminAuth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAdminCookie(response);

  return response;
}
