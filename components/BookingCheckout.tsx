"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/data";

type BookingCheckoutProps = {
  hotelSlug: string;
  roomId: string;
  roomPrice: number;
  roomCapacity: number;
};

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

export function BookingCheckout({
  hotelSlug,
  roomId,
  roomPrice,
  roomCapacity
}: BookingCheckoutProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nights = nightsBetween(checkIn, checkOut) || 1;
  const subtotal = roomPrice * nights;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;
  const guestOptions = useMemo(
    () => Array.from({ length: roomCapacity }, (_, index) => index + 1),
    [roomCapacity]
  );

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          hotel_slug: hotelSlug,
          room_id: roomId,
          check_in_date: checkIn,
          check_out_date: checkOut,
          guest_count: guestCount,
          guest_full_name: fullName,
          guest_email: email,
          guest_phone: phone
        })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        // Failed to parse JSON (e.g. proxy served HTML error)
      }

      if (!response.ok || !data.redirect_url) {
        setLoading(false);
        setError(data.error || `Unable to start payment (Server status: ${response.status})`);
        return;
      }

      window.location.href = data.redirect_url;
    } catch (err) {
      setLoading(false);
      setError("Network error: Could not reach the booking server.");
      console.error("Booking error:", err);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={submitBooking}>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800">Check-in</label>
        <input
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-3"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800">Check-out</label>
        <input
          type="date"
          required
          min={checkIn || new Date().toISOString().split("T")[0]}
          value={checkOut}
          onChange={(event) => setCheckOut(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-3"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800">Guests</label>
        <select
          value={guestCount}
          onChange={(event) => setGuestCount(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-3"
        >
          {guestOptions.map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "Guest" : "Guests"}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800">Full name</label>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-3"
          placeholder="Your full name"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-3"
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-stone-800">Phone</label>
        <input
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="rounded-md border border-stone-300 px-3 py-3"
          placeholder="+27..."
        />
      </div>
      <div className="rounded-lg bg-stone-100 p-4 text-sm text-stone-700">
        <div className="flex justify-between">
          <span>
            {formatCurrency(roomPrice)} x {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span>Taxes</span>
          <span>{formatCurrency(taxes)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-stone-300 pt-3 text-base font-bold text-stone-950">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        <CreditCard size={18} />
        {loading ? "Starting payment..." : "Pay with Pesapal"}
      </button>
    </form>
  );
}
