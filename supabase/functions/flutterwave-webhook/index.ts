import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const flutterwaveSecretHash = Deno.env.get("FLUTTERWAVE_SECRET_HASH") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey);

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = request.headers.get("verif-hash");
  if (!signature || signature !== flutterwaveSecretHash) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = await request.json();
  const data = event.data ?? event;

  if (data.status !== "successful") {
    return new Response(JSON.stringify({ received: true, ignored: true }), {
      headers: { "content-type": "application/json" }
    });
  }

  const bookingReference = data.meta?.booking_reference;
  const transactionId = String(data.id ?? data.tx_ref);
  const amount = Number(data.amount);
  const currency = data.currency ?? "ZAR";

  if (!bookingReference || !transactionId || !amount) {
    return new Response("Missing payment data", { status: 400 });
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, room_id, total_amount")
    .eq("booking_reference", bookingReference)
    .single();

  if (bookingError || !booking) {
    return new Response("Booking not found", { status: 404 });
  }

  if (Number(booking.total_amount) !== amount) {
    return new Response("Amount mismatch", { status: 400 });
  }

  await supabase.from("payments").upsert({
    booking_id: booking.id,
    gateway: "flutterwave",
    gateway_reference: transactionId,
    amount,
    currency,
    status: "successful",
    paid_at: new Date().toISOString(),
    raw_payload: event
  });

  await supabase
    .from("bookings")
    .update({
      status: "confirmed",
      qr_token_hash: crypto.randomUUID()
    })
    .eq("id", booking.id);

  await supabase
    .from("rooms")
    .update({ status: "fully_booked" })
    .eq("id", booking.room_id);

  // Production next step: call Resend or SendGrid here with the booking email template.
  return new Response(JSON.stringify({ received: true, booking: bookingReference }), {
    headers: { "content-type": "application/json" }
  });
});
