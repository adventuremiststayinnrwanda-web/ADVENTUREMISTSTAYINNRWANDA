import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDbHotel, getDbRoom } from "@/lib/server/db";
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

function extractPesapalErrorMessage(pesapalOrder: any): string | null {
  if (!pesapalOrder) return null;
  if (typeof pesapalOrder.error === "string") return pesapalOrder.error;
  if (pesapalOrder.error && typeof pesapalOrder.error.message === "string") {
    return pesapalOrder.error.message;
  }
  if (pesapalOrder.error && typeof pesapalOrder.error.code === "string") {
    return `Pesapal error: ${pesapalOrder.error.code}`;
  }
  if (typeof pesapalOrder.message === "string") return pesapalOrder.message;
  if (typeof pesapalOrder.status === "string" && pesapalOrder.status !== "200") {
    return `Pesapal status ${pesapalOrder.status}`;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Load hotel and room dynamically from Supabase
    const hotel = await getDbHotel(body.hotel_slug);
    const room = hotel ? hotel.rooms.find((r) => r.id === body.room_id) || null : null;
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

      const pesapalErrorMessage = extractPesapalErrorMessage(pesapalOrder);
      const exposeDetails = (process.env.PESAPAL_MODE || "sandbox") !== "live";

      return NextResponse.json(
        {
          error: pesapalErrorMessage || "Payment gateway error",
          details: exposeDetails ? pesapalOrder || null : undefined
        },
        { status: 400 }
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
