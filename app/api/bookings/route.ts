import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getHotel, getRoom } from "@/lib/data";
import { submitPesapalOrder } from "@/lib/server/pesapal";
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
    process.env.PESAPAL_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin
  ).replace(/\/$/, "");
}

async function resolveSupabaseIds(hotel: NonNullable<ReturnType<typeof getHotel>>, room: NonNullable<ReturnType<typeof getRoom>>) {
  const hotelRows = await supabaseRest<Array<{ id: string }>>(
    `hotels?name=eq.${encodeURIComponent(hotel.name)}&city=eq.${encodeURIComponent(hotel.city)}&select=id`
  );
  const hotelRow = hotelRows[0];

  if (!hotelRow) {
    throw new Error(`Hotel "${hotel.name}" is missing in Supabase.`);
  }

  const roomRows = await supabaseRest<Array<{ id: string }>>(
    `rooms?hotel_id=eq.${encodeURIComponent(hotelRow.id)}&name=eq.${encodeURIComponent(room.name)}&select=id`
  );
  const roomRow = roomRows[0];

  if (!roomRow) {
    throw new Error(`Room "${room.name}" is missing in Supabase.`);
  }

  return {
    hotelId: hotelRow.id,
    roomId: roomRow.id
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const hotel = getHotel(body.hotel_slug);
    const room = hotel ? getRoom(hotel.slug, body.room_id) : null;
    const nights = daysBetween(body.check_in_date, body.check_out_date);
    const guestCount = Number(body.guest_count);

    if (!hotel || !room || nights <= 0 || guestCount < 1 || guestCount > room.capacity) {
      return NextResponse.json({ error: "Invalid booking details." }, { status: 400 });
    }

    if (!body.guest_full_name || !body.guest_email || !body.guest_phone) {
      return NextResponse.json({ error: "Guest details are required." }, { status: 400 });
    }

    const subtotal = room.price * nights;
    const taxes = Math.round(subtotal * 0.15);
    const total = subtotal + taxes;
    const reference = bookingReference();
    const supabaseIds = await resolveSupabaseIds(hotel, room);

    const bookingRows = await supabaseRest<Array<{ id: string; booking_reference: string }>>(
      "bookings",
      {
        method: "POST",
        body: JSON.stringify({
          booking_reference: reference,
          guest_full_name: body.guest_full_name,
          guest_email: body.guest_email,
          guest_phone: body.guest_phone,
          hotel_id: supabaseIds.hotelId,
          room_id: supabaseIds.roomId,
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
    const currency = process.env.PESAPAL_CURRENCY || "USD";
    const pesapalOrder = await submitPesapalOrder({
      reference,
      amount: total,
      currency,
      description: `${hotel.name} - ${room.name}`,
      callbackUrl: `${origin}/api/pesapal/callback`,
      cancellationUrl: `${origin}/hotels/${hotel.slug}/rooms/${room.id}`,
      customer: {
        email: body.guest_email,
        phone: body.guest_phone,
        name: body.guest_full_name
      }
    });

    const isValidPesapalOrder =
      pesapalOrder &&
      typeof pesapalOrder.order_tracking_id === "string" &&
      pesapalOrder.order_tracking_id.trim().length > 0 &&
      !(pesapalOrder as { error?: unknown }).error;

    if (!isValidPesapalOrder) {
      console.error("Pesapal submit order failed:", pesapalOrder);
      return NextResponse.json(
        { error: "Payment gateway error", details: pesapalOrder || null },
        { status: 502 }
      );
    }

    await supabaseRest("payments", {
      method: "POST",
      body: JSON.stringify({
        booking_id: bookingRows[0].id,
        gateway: "pesapal",
        gateway_reference: pesapalOrder.order_tracking_id,
        amount: total,
        currency,
        status: "pending",
        raw_payload: pesapalOrder
      })
    });

    return NextResponse.json({
      booking_reference: reference,
      redirect_url: pesapalOrder.redirect_url
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create booking." },
      { status: 500 }
    );
  }
}
