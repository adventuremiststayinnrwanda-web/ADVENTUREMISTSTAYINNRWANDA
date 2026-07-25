export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";
import { sendPaymentReminderEmail } from "@/lib/server/emails";

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const bookings = await supabaseRest<Array<any>>(
      `bookings?id=eq.${encodeURIComponent(bookingId)}&select=*,rooms(name),hotels(name)`
    );

    const booking = bookings?.[0];
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const roomName = booking.rooms?.name || "Reserved Room";
    const hotelName = booking.hotels?.name || "Adventure Mist Stay Inn Rwanda";

    const sent = await sendPaymentReminderEmail(booking, roomName, hotelName);

    return NextResponse.json({
      success: true,
      message: sent
        ? `Payment reminder email sent successfully to ${booking.guest_email}!`
        : `Reminder process executed for ${booking.guest_email}.`
    });
  } catch (error: any) {
    console.error("Error in send-reminder route:", error);
    return NextResponse.json({ error: error.message || "Failed to send reminder email." }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Endpoint active" });
}
