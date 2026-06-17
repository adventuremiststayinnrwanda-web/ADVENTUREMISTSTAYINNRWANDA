import crypto from "node:crypto";
import { getPesapalTransactionStatus } from "@/lib/server/pesapal";
import { supabaseRest } from "@/lib/server/supabaseRest";
import { sendBookingConfirmation } from "./emails";

function qrTokenHash() {
  return crypto.createHash("sha256").update(crypto.randomUUID()).digest("hex");
}

export async function reconcilePesapalPayment(orderTrackingId: string, reference: string) {
  const status = await getPesapalTransactionStatus(orderTrackingId);
  const completed = status.status_code === 1 || status.payment_status_description === "Completed";
  const failed = status.status_code === 2 || status.status_code === 3;

  const bookings = await supabaseRest<Array<any>>(
    `bookings?booking_reference=eq.${encodeURIComponent(reference)}&select=*`
  );
  const booking = bookings[0];

  if (!booking) {
    throw new Error("Booking not found.");
  }

  await supabaseRest(`payments?gateway_reference=eq.${encodeURIComponent(orderTrackingId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: completed ? "successful" : failed ? "failed" : "pending",
      paid_at: completed ? new Date().toISOString() : null,
      raw_payload: status
    })
  });

  if (completed) {
    await supabaseRest(`bookings?id=eq.${booking.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "confirmed", qr_token_hash: qrTokenHash() })
    });

    await supabaseRest(`rooms?id=eq.${booking.room_id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "fully_booked" })
    });

    const rooms = await supabaseRest<Array<{ name: string }>>(
      `rooms?id=eq.${booking.room_id}&select=name`
    );
    const roomName = rooms[0]?.name || "Room booked";

    await sendBookingConfirmation(booking, roomName);
  }

  return completed ? "paid" : failed ? "failed" : "pending";
}
