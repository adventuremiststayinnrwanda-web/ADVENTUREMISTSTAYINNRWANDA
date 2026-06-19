"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
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
    if (!agreeToTerms) {
      setError("Please read and agree to the Refund & Cancellation Policy first.");
      setShowTermsModal(true);
      return;
    }
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
      <div className="flex items-start gap-2 py-2">
        <input
          type="checkbox"
          id="agreeToTerms"
          required
          checked={agreeToTerms}
          onChange={(event) => setAgreeToTerms(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
        <label htmlFor="agreeToTerms" className="text-xs text-stone-600 leading-normal cursor-pointer select-none">
          I have read and agree to the{" "}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-emerald-750 font-semibold underline hover:text-emerald-800 focus:outline-none"
          >
            Refund & Cancellation Policy
          </button>
          .
        </label>
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <button
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        <CreditCard size={18} />
        {loading ? "Starting payment..." : "Pay with Pesapal"}
      </button>

      {/* Refund & Cancellation Policy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
          <div className="relative flex h-full max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-stone-200 bg-white shadow-xl animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <h3 className="text-lg font-bold text-stone-950">Refund & Cancellation Policy</h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-stone-600 leading-relaxed space-y-4">
              <p className="font-semibold text-stone-850">Adventure Mist Stay Inn Rwanda</p>
              <p>
                At Adventure Mist Stay Inn Rwanda, we strive to provide our guests with a comfortable and enjoyable stay. By making a reservation through our website, you agree to the following refund and cancellation terms.
              </p>
              
              <h4 className="font-bold text-stone-900 mt-4">1. Cancellation Policy</h4>
              <p>
                Guests who wish to cancel their reservation must submit a written cancellation request via email or through our official communication channels.
              </p>
              
              <div className="border-l-2 border-emerald-600 pl-3 space-y-3">
                <div>
                  <h5 className="font-semibold text-stone-900">More than 30 Days Before Arrival</h5>
                  <p className="text-xs">
                    Cancellations made more than thirty (30) days before the scheduled arrival date are eligible for a full refund. Any bank charges, payment gateway fees, or transaction costs incurred during the refund process may be deducted from the refunded amount.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900">15–30 Days Before Arrival</h5>
                  <p className="text-xs">
                    Cancellations made between fifteen (15) and thirty (30) days before the scheduled arrival date will incur a cancellation fee equal to fifty percent (50%) of the total booking amount. The remaining balance will be refunded to the guest.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900">14 Days or Less Before Arrival</h5>
                  <p className="text-xs">
                    Cancellations made within fourteen (14) days of the scheduled arrival date are non-refundable. No refunds will be provided for no-shows, unused nights, or early departures.
                  </p>
                </div>
              </div>
              
              <h4 className="font-bold text-stone-900 mt-4">2. Refund Processing</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Approved refunds will be processed using the original payment method used for the reservation.</li>
                <li>Refund processing times may vary depending on the payment provider, bank, or financial institution.</li>
                <li>Adventure Mist Stay Inn Rwanda is not responsible for delays caused by third-party payment providers or banking institutions.</li>
              </ul>
              
              <h4 className="font-bold text-stone-900 mt-4">3. Reservation Modifications</h4>
              <p>
                Requests to change reservation dates or guest details are subject to availability and approval by management. Additional charges may apply depending on the nature of the modification.
              </p>
              
              <h4 className="font-bold text-stone-900 mt-4">4. Force Majeure</h4>
              <p>
                Adventure Mist Stay Inn Rwanda shall not be held liable for cancellations or disruptions caused by events beyond our reasonable control, including but not limited to natural disasters, government restrictions, pandemics, civil disturbances, or transportation interruptions.
              </p>
              
              <h4 className="font-bold text-stone-900 mt-4">5. Contact Information</h4>
              <p>
                For all cancellation, refund, or booking-related inquiries, please contact Adventure Mist Stay Inn Rwanda through our official website or customer support channels.
              </p>
              
              <p className="font-semibold text-stone-500 pt-2 border-t border-stone-100">
                By confirming a reservation, guests acknowledge that they have read, understood, and agreed to this Refund & Cancellation Policy.
              </p>
            </div>
            
            {/* Footer with actions */}
            <div className="flex justify-end gap-3 border-t border-stone-100 bg-stone-50 px-6 py-4 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgreeToTerms(true);
                  setError("");
                  setShowTermsModal(false);
                }}
                className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
              >
                I Agree & Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
