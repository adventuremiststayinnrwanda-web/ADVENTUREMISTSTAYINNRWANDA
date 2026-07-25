export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function GET() { return new Response(null, { status: 405 }); }

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const bookings = await supabaseRest<any[]>(`bookings?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: body.status
      })
    });

    if (bookings && bookings.length > 0) {
      const updatedBooking = bookings[0];
      const revertStatuses = ["cancelled", "completed", "refunded"];
      const bookStatuses = ["confirmed", "checked_in"];
      
      if (revertStatuses.includes(body.status) && updatedBooking.room_id) {
        await supabaseRest(`rooms?id=eq.${encodeURIComponent(updatedBooking.room_id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "available" })
        });
      } else if (bookStatuses.includes(body.status) && updatedBooking.room_id) {
        await supabaseRest(`rooms?id=eq.${encodeURIComponent(updatedBooking.room_id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "fully_booked" })
        });
      }
    }

    return NextResponse.json({ booking: bookings?.[0] || bookings });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update booking." },
      { status: 400 }
    );
  }
}
