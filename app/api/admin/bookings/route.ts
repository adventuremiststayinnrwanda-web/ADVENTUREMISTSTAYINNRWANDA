import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const booking = await supabaseRest(`bookings?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: body.status
      })
    });

    return NextResponse.json({ booking });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update booking." },
      { status: 400 }
    );
  }
}
