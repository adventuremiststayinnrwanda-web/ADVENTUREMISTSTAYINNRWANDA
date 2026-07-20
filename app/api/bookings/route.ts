import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDbHotel } from "@/lib/server/db";
import { submitDpoOrder } from "@/lib/server/dpo";
import { supabaseRest } from "@/lib/server/supabaseRest";

function bookingReference() {
  return `SE-${new Date().getFullYear()}-${crypto.randomInt(10000, 99999)}`;
}

function daysBetween(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function publicBaseUrl(request: NextRequest) {
  return (
    process.env.DPO_PUBLIC_BASE_URL ||
    process.env.PESAPAL_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin
  ).replace(/\/$/, "");
}



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Load hotel and room dynamically from Supabase
    const hotel = await getDbHotel(body.hotel_slug);
    if (!hotel) {
      console.error("Booking failed: hotel not found for slug:", body.hotel_slug);
      return NextResponse.json({ error: `Invalid booking details: Hotel not found (${body.hotel_slug}).` }, { status: 400 });
    }

    const room = hotel.rooms.find((r) => r.id === body.room_id) || null;
    if (!room) {
      console.error("Booking failed: room not found for ID:", body.room_id, "in hotel:", hotel.name);
      return NextResponse.json({ error: `Invalid booking details: Room not found.` }, { status: 400 });
    }

    const nights = daysBetween(body.check_in_date, body.check_out_date);
    if (nights <= 0) {
      console.error("Booking failed: invalid dates. checkIn:", body.check_in_date, "checkOut:", body.check_out_date);
      return NextResponse.json({ error: `Invalid booking details: Stay duration must be at least 1 night.` }, { status: 400 });
    }

    const guestCount = Number(body.guest_count);
    if (guestCount < 1 || guestCount > room.capacity) {
      console.error("Booking failed: invalid guest count:", guestCount, "room capacity:", room.capacity);
      return NextResponse.json({ error: `Invalid booking details: Guest count must be between 1 and ${room.capacity}.` }, { status: 400 });
    }

    if (!body.guest_full_name || !body.guest_email || !body.guest_phone) {
      return NextResponse.json({ error: "Guest details are required." }, { status: 400 });
    }

    const subtotal = room.price * nights;
    const taxes = Math.round(subtotal * 0.15);
    const total = subtotal + taxes;
    const reference = bookingReference();

    // hotel.id and room.id are Supabase UUIDs from the DB layer
    const bookingRows = await supabaseRest<Array<{ id: string; booking_reference: string }>>(
      "bookings",
      {
        method: "POST",
        body: JSON.stringify({
          booking_reference: reference,
          guest_full_name: body.guest_full_name,
          guest_email: body.guest_email,
          guest_phone: body.guest_phone,
          hotel_id: hotel.id,
          room_id: room.id,
          check_in_date: body.check_in_date,
          check_out_date: body.check_out_date,
          guest_count: guestCount,
          nights,
          subtotal,
          taxes,
          total_amount: total,
          status: "pending_payment"
        })
      }
    );

    const origin = publicBaseUrl(request);
    const currency = process.env.DPO_CURRENCY || "USD";
    const dpoOrder = await submitDpoOrder({
      reference,
      amount: total,
      currency,
      description: `${hotel.name} - ${room.name}`,
      callbackUrl: `${origin}/api/dpo/callback`,
      customer: {
        email: body.guest_email,
        phone: body.guest_phone,
        name: body.guest_full_name
      }
    });

    const isValidDpoOrder =
      dpoOrder &&
      typeof dpoOrder.transToken === "string" &&
      dpoOrder.transToken.trim().length > 0 &&
      !dpoOrder.error;

    if (!isValidDpoOrder) {
      console.error("DPO submit order failed:", dpoOrder);

      const exposeDetails = (process.env.DPO_MODE || "sandbox") !== "live";

      return NextResponse.json(
        {
          error: dpoOrder.error || "DPO payment gateway error",
          details: exposeDetails ? dpoOrder || null : undefined
        },
        { status: 400 }
      );
    }

    await supabaseRest("payments", {
      method: "POST",
      body: JSON.stringify({
        booking_id: bookingRows[0].id,
        gateway: "dpo",
        gateway_reference: dpoOrder.transToken,
        amount: total,
        currency,
        status: "pending",
        raw_payload: dpoOrder
      })
    });

    return NextResponse.json({
      booking_reference: reference,
      redirect_url: dpoOrder.redirectUrl
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking." },
      { status: 500 }
    );
  }
}
