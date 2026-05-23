import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, setAdminCookie, verifyAdminCredentials } from "@/lib/server/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email || "");
  const password = String(body.password || "");

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid admin login." }, { status: 401 });
  }

  const response = NextResponse.json({ email: email.trim().toLowerCase() });
  setAdminCookie(response, createAdminSession(email));

  return response;
}
