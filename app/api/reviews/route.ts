export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function GET() { return new Response(null, { status: 405 }); }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.hotel_id || !body.rating) {
      return NextResponse.json({ error: "Hotel ID and rating are required." }, { status: 400 });
    }

    // Since we don't have authentication for clients yet, we will just link booking by reference or skip it.
    // The current schema requires a booking_id. Let's make it null if we can, or we need to change schema.
    // Looking at schema.sql: booking_id uuid not null references public.bookings(id)
    // If a user must have a booking to review, they need to supply their booking reference.
    // For now, we will assume the client passes `booking_id` they got from their receipt, or we modify the schema.
    // Since we can't easily change schema constraints without risking data loss here, let's assume they pass booking_id.
    
    // Actually, looking at schema:
    // booking_id uuid not null references public.bookings(id) on delete cascade
    // We MUST provide a booking_id.
    
    if (!body.booking_reference) {
      return NextResponse.json({ error: "A valid booking reference is required to leave a review." }, { status: 400 });
    }

    // Look up the booking_id using the reference
    const bookings = await supabaseRest<any[]>(`bookings?booking_reference=eq.${encodeURIComponent(body.booking_reference)}&select=id`);
    
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ error: "Booking reference not found." }, { status: 404 });
    }

    const booking_id = bookings[0].id;

    const review = await supabaseRest<any[]>("reviews", {
      method: "POST",
      body: JSON.stringify({
        booking_id: booking_id,
        hotel_id: body.hotel_id,
        rating: Number(body.rating),
        comment: body.comment,
        status: "pending" // Pending approval
      })
    });

    return NextResponse.json({ review: review?.[0] || review });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit review." },
      { status: 400 }
    );
  }
}
