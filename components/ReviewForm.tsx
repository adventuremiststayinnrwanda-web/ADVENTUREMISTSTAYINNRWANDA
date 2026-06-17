"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function ReviewForm({ hotelId }: { hotelId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      // Look up booking_id by reference (since API requires booking_id uuid)
      // This is a bit tricky if we don't expose a way to fetch booking by ref on the client.
      // But let's send booking_ref to a new endpoint or update our API.
      // Wait, our /api/reviews/route.ts expects `booking_id`. Let's assume the user enters their booking reference, 
      // and we handle it here or in the backend. 
      // Actually, I'll update /api/reviews/route.ts to accept `booking_reference` instead of `booking_id`.
      
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotel_id: hotelId, rating, comment, booking_reference: bookingRef })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setStatus("success");
      setComment("");
      setBookingRef("");
      setRating(5);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h3 className="font-bold text-emerald-800">Thank you for your feedback!</h3>
        <p className="mt-2 text-sm text-emerald-600">Your review has been submitted and is awaiting approval.</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-semibold text-emerald-700 underline">
          Submit another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-stone-900">Leave a Review</h3>
      
      {status === "error" && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{errorMsg}</div>
      )}

      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-stone-700">Booking Reference</label>
        <input
          required
          type="text"
          value={bookingRef}
          onChange={(e) => setBookingRef(e.target.value)}
          placeholder="e.g. BKG-123456"
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-stone-500">You must have a valid booking to leave a review.</p>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-stone-700">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={star <= rating ? "fill-amber-500 text-amber-500" : "text-stone-300"}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-semibold text-stone-700">Comment</label>
        <textarea
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your ideas or feedback..."
          className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <button
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
