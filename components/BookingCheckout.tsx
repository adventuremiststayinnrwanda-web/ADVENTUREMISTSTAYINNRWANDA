"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, ChevronDown, Search } from "lucide-react";
import { formatCurrency } from "@/lib/data";

type BookingCheckoutProps = {
  hotelSlug: string;
  roomId: string;
  roomPrice: number;
  roomCapacity: number;
  roomName?: string;
};

// Country codes — Africa-first, then global
const COUNTRY_CODES = [
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+225", country: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
];

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
  roomCapacity,
  roomName
}: BookingCheckoutProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDialCode, setPhoneDialCode] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialOpen, setDialOpen] = useState(false);
  const [dialSearch, setDialSearch] = useState("");
  const dialRef = useRef<HTMLDivElement>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        setDialOpen(false);
        setDialSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCodes = useMemo(() =>
    COUNTRY_CODES.filter(c =>
      c.country.toLowerCase().includes(dialSearch.toLowerCase()) ||
      c.code.includes(dialSearch)
    ), [dialSearch]);

  const isSingleRoom = useMemo(() => {
    return (
      roomCapacity === 1 ||
      (roomName && roomName.toLowerCase().includes("single"))
    );
  }, [roomCapacity, roomName]);

  const parsedCapacity = useMemo(() => {
    return isSingleRoom ? 1 : roomCapacity;
  }, [isSingleRoom, roomCapacity]);

  // Sync guestCount when parsedCapacity/isSingleRoom changes
  useEffect(() => {
    if (isSingleRoom) {
      setGuestCount("1");
    }
  }, [isSingleRoom]);

  const guestOptions = useMemo(
    () => Array.from({ length: parsedCapacity }, (_, index) => index + 1),
    [parsedCapacity]
  );

  const nights = nightsBetween(checkIn, checkOut) || 1;
  const subtotal = roomPrice * nights;
  const taxes = Math.round(subtotal * 0.15);
  const total = subtotal + taxes;



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
          guest_phone: `${phoneDialCode.code}${phoneNumber.replace(/^0+/, "")}`
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
      <div className="grid grid-cols-2 gap-3.5">
        <div className="grid gap-1.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Check-in</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-3.5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Check-out</label>
          <input
            type="date"
            required
            min={checkIn || new Date().toISOString().split("T")[0]}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-3.5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {isSingleRoom ? (
        <div className="grid gap-1.5 bg-stone-100/60 rounded-xl border border-stone-200/50 p-3.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Guests</label>
          <div className="flex items-center gap-2 text-stone-700 font-bold text-sm">
            <span>👤 1 Guest</span>
            <span className="text-xs font-normal text-stone-500">(Single occupancy room)</span>
          </div>
        </div>
      ) : (
        <div className="grid gap-1.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Guests</label>
          <select
            value={guestCount}
            onChange={(event) => setGuestCount(event.target.value)}
            className="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-3.5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200 cursor-pointer"
          >
            {guestOptions.map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-1.5">
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Full name</label>
        <input
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-3.5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200"
          placeholder="Your full name"
        />
      </div>

      <div className="grid gap-1.5">
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-stone-250 bg-stone-50/50 px-3.5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid gap-1.5">
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Phone</label>
        <div ref={dialRef} className="relative flex gap-2">
          {/* Country code button */}
          <button
            type="button"
            id="country-code-selector"
            onClick={() => { setDialOpen(v => !v); setDialSearch(""); }}
            className="flex items-center gap-1.5 rounded-xl border border-stone-250 bg-white px-3.5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition shrink-0 focus:ring-2 focus:ring-emerald-500/20 outline-none"
          >
            <span className="text-base leading-none">{phoneDialCode.flag}</span>
            <span>{phoneDialCode.code}</span>
            <ChevronDown size={14} className={`transition-transform text-stone-400 ${dialOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {dialOpen && (
            <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
              {/* Search */}
              <div className="flex items-center gap-2 border-b border-stone-100 px-3.5 py-2.5">
                <Search size={14} className="text-stone-400 shrink-0" />
                <input
                  autoFocus
                  value={dialSearch}
                  onChange={e => setDialSearch(e.target.value)}
                  placeholder="Search country or code…"
                  className="w-full text-sm outline-none text-stone-750 placeholder:text-stone-400 bg-transparent"
                />
              </div>
              {/* List */}
              <ul className="max-h-52 overflow-y-auto">
                {filteredCodes.length === 0 && (
                  <li className="px-4 py-3.5 text-sm text-stone-400">No results</li>
                )}
                {filteredCodes.map(c => (
                  <li key={c.code + c.country}>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneDialCode(c);
                        setDialOpen(false);
                        setDialSearch("");
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-emerald-50 transition text-left ${
                        c.code === phoneDialCode.code && c.country === phoneDialCode.country
                          ? "bg-emerald-50 font-bold text-emerald-700"
                          : "text-stone-700"
                      }`}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1">{c.country}</span>
                      <span className="text-stone-400 font-mono text-xs">{c.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Number input */}
          <input
            required
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="780 000 000"
            className="flex-1 rounded-xl border border-stone-250 bg-stone-50/50 px-3.5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all duration-200 tracking-wide"
          />
        </div>
        <p className="text-[11px] text-stone-400 leading-normal pl-0.5">
          {phoneDialCode.flag} {phoneDialCode.country} · Full number: {phoneDialCode.code}{phoneNumber.replace(/^0+/, "") || "…"}
        </p>
      </div>

      <div className="rounded-xl bg-stone-100/80 border border-stone-200/40 p-4 text-sm text-stone-700">
        <div className="flex justify-between">
          <span className="text-stone-500">
            {formatCurrency(roomPrice)} x {nights} {nights === 1 ? "night" : "nights"}
          </span>
          <span className="font-semibold text-stone-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-2.5 flex justify-between">
          <span className="text-stone-500">Taxes (15%)</span>
          <span className="font-semibold text-stone-900">{formatCurrency(taxes)}</span>
        </div>
        <div className="mt-3.5 flex justify-between border-t border-stone-250 pt-3 text-base font-bold text-stone-950">
          <span>Total</span>
          <span className="text-emerald-850 font-bold">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex items-start gap-2.5 py-1.5">
        <input
          type="checkbox"
          id="agreeToTerms"
          required
          checked={agreeToTerms}
          onChange={(event) => setAgreeToTerms(event.target.checked)}
          className="mt-0.5 h-4.5 w-4.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500/25 cursor-pointer accent-emerald-650"
        />
        <label htmlFor="agreeToTerms" className="text-xs text-stone-500 leading-relaxed cursor-pointer select-none">
          I have read and agree to the{" "}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-emerald-700 font-bold underline hover:text-emerald-800 focus:outline-none"
          >
            Refund & Cancellation Policy
          </button>
          .
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50/80 border border-red-100 px-3.5 py-2.5 text-xs font-semibold text-red-700 leading-relaxed">
          ⚠️ {error}
        </p>
      )}

      <button
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3.5 font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 transition-all shadow-md shadow-emerald-700/10 cursor-pointer"
      >
        <CreditCard size={18} />
        {loading ? "Starting payment..." : "Pay with DPO"}
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
