import crypto from "node:crypto";
import { getDpoTransactionStatus } from "@/lib/server/dpo";
import { supabaseRest } from "@/lib/server/supabaseRest";
import { sendBookingConfirmation } from "./emails";

function qrTokenHash() {
  return crypto.createHash("sha256").update(crypto.randomUUID()).digest("hex");
}

export async function reconcileDpoPayment(transactionToken: string, reference: string) {
  const status = await getDpoTransactionStatus(transactionToken);
  
  // DPO Result '000' is "Transaction Paid"
  const completed = status.result === "000";
  // '901' is declined, '903' is timeout, '904' is cancelled
  const failed = ["901", "903", "904"].includes(status.result);

  const bookings = await supabaseRest<Array<any>>(
    `bookings?booking_reference=eq.${encodeURIComponent(reference)}&select=*`
  );
  const booking = bookings[0];

  if (!booking) {
    throw new Error(`Booking not found for reference: ${reference}`);
  }

  // Update the payments record status
  await supabaseRest(`payments?gateway_reference=eq.${encodeURIComponent(transactionToken)}`, {
    method: "PATCH",
    body: JSON.stringify({
      status: completed ? "successful" : failed ? "failed" : "pending",
      paid_at: completed ? new Date().toISOString() : null,
      raw_payload: status
    })
  });

  // If completed, update the booking and room status, and send confirmation email
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
