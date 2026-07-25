export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { readAdminSession } from "@/lib/server/adminAuth";

export async function GET(request: NextRequest) {
  const session = readAdminSession(request);

  return NextResponse.json({
    authenticated: Boolean(session),
    email: session?.email || null
  });
}
