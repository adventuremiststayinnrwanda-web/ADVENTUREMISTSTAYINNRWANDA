import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

type HotelRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  status: string;
  price_from: number;
};

type RoomRow = {
  id: string;
  hotel_id: string;
  name: string;
  room_number: string | null;
  price_per_night: number;
  capacity: number;
  status: string;
};

type BookingRow = {
  id: string;
  booking_reference: string;
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  total_amount: number;
  status: string;
  created_at: string;
  room_id: string;
  hotel_id: string;
};

type PaymentRow = {
  id: string;
  booking_id: string;
  gateway_reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
};

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const [hotels, rooms, bookings, payments, reviews, partnerships, offers] = await Promise.all([
      supabaseRest<HotelRow[]>("hotels?select=*&order=created_at.desc"),
      supabaseRest<RoomRow[]>("rooms?select=*&order=created_at.desc"),
      supabaseRest<BookingRow[]>("bookings?select=*&order=created_at.desc&limit=50"),
      supabaseRest<PaymentRow[]>("payments?select=*&order=created_at.desc&limit=50"),
      supabaseRest<any[]>("reviews?select=*,bookings(guest_full_name),hotels(name)&order=created_at.desc"),
      supabaseRest<any[]>("partnerships?select=*&order=created_at.desc"),
      supabaseRest<any[]>("offers?select=*&order=created_at.desc").catch(() => [])
    ]);

    const revenue = payments
      .filter((payment) => payment.status === "successful")
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    const formattedReviews = (reviews || []).map((r) => ({
      id: r.id,
      booking_id: r.booking_id,
      guest_name: r.bookings?.guest_full_name || "Anonymous",
      hotel_name: r.hotels?.name || "Unknown Hotel",
      rating: r.rating,
      comment: r.comment,
      status: r.status,
      created_at: r.created_at
    }));

    return NextResponse.json({
      stats: {
        bookings: bookings.length,
        revenue,
        availableRooms: rooms.filter((room) => room.status === "available").length,
        pendingPayments: payments.filter((payment) => payment.status === "pending").length
      },
      hotels,
      rooms,
      bookings,
      payments,
      reviews: formattedReviews,
      partnerships,
      offers
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load admin dashboard." },
      { status: 401 }
    );
  }
}
