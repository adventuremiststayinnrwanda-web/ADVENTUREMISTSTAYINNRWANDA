const http = require("node:http");
const crypto = require("node:crypto");

const PORT = Number(process.env.PORT || 8787);
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH;

function json(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,verif-hash,authorization"
  });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

async function supabase(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: "return=representation",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

function bookingReference() {
  return `SE-${new Date().getFullYear()}-${crypto.randomInt(10000, 99999)}`;
}

function qrTokenHash() {
  return crypto.createHash("sha256").update(crypto.randomUUID()).digest("hex");
}

async function createBooking(request, response) {
  const body = await readBody(request);
  const reference = bookingReference();
  const nights = Number(body.nights);
  const subtotal = Number(body.subtotal);
  const taxes = Number(body.taxes);
  const total = Number(body.total_amount);

  if (!body.guest_email || !body.room_id || !total || nights <= 0) {
    json(response, 400, { error: "Missing booking data" });
    return;
  }

  const booking = await supabase("bookings", {
    method: "POST",
    body: JSON.stringify({
      booking_reference: reference,
      guest_full_name: body.guest_full_name,
      guest_email: body.guest_email,
      guest_phone: body.guest_phone,
      hotel_id: body.hotel_id,
      room_id: body.room_id,
      check_in_date: body.check_in_date,
      check_out_date: body.check_out_date,
      guest_count: body.guest_count,
      nights,
      subtotal,
      taxes,
      total_amount: total,
      status: "pending_payment"
    })
  });

  json(response, 201, { booking: booking[0], booking_reference: reference });
}

async function lookupBooking(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const email = url.searchParams.get("email");
  const reference = url.searchParams.get("reference");

  if (!email || !reference) {
    json(response, 400, { error: "Email and reference are required" });
    return;
  }

  const rows = await supabase(
    `bookings?guest_email=eq.${encodeURIComponent(email)}&booking_reference=eq.${encodeURIComponent(reference)}&select=*`
  );
  json(response, 200, { booking: rows[0] || null });
}

async function flutterwaveWebhook(request, response) {
  const signature = request.headers["verif-hash"];
  if (!FLUTTERWAVE_SECRET_HASH || signature !== FLUTTERWAVE_SECRET_HASH) {
    json(response, 401, { error: "Invalid webhook signature" });
    return;
  }

  const event = await readBody(request);
  const data = event.data || event;
  if (data.status !== "successful") {
    json(response, 200, { received: true, ignored: true });
    return;
  }

  const reference = data.meta?.booking_reference;
  const amount = Number(data.amount);
  const transactionId = String(data.id || data.tx_ref);
  const rows = await supabase(
    `bookings?booking_reference=eq.${encodeURIComponent(reference)}&select=id,room_id,total_amount`
  );
  const booking = rows[0];

  if (!booking) {
    json(response, 404, { error: "Booking not found" });
    return;
  }

  if (Number(booking.total_amount) !== amount) {
    json(response, 400, { error: "Amount mismatch" });
    return;
  }

  await supabase("payments", {
    method: "POST",
    body: JSON.stringify({
      booking_id: booking.id,
      gateway_reference: transactionId,
      amount,
      currency: data.currency || "ZAR",
      status: "successful",
      paid_at: new Date().toISOString(),
      raw_payload: event
    })
  });

  await supabase(`bookings?id=eq.${booking.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "confirmed", qr_token_hash: qrTokenHash() })
  });

  await supabase(`rooms?id=eq.${booking.room_id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "fully_booked" })
  });

  json(response, 200, { received: true, booking_reference: reference });
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      json(response, 200, { ok: true });
      return;
    }

    const url = new URL(request.url, `http://${request.headers.host}`);
    if (request.method === "POST" && url.pathname === "/api/bookings") {
      await createBooking(request, response);
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/bookings/lookup") {
      await lookupBooking(request, response);
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/webhooks/flutterwave") {
      await flutterwaveWebhook(request, response);
      return;
    }

    json(response, 404, { error: "Not found" });
  } catch (error) {
    json(response, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`StayEase backend listening on http://localhost:${PORT}`);
});
