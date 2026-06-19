import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-lg font-bold">Adventure Mist Stay Inn Rwanda</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Guest-first hotel bookings with fast payment, email confirmation, and QR
            check-in.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/hotels">Hotels</Link>
            <Link href="/rooms">Rooms</Link>
            <Link href="/booking-lookup">My Booking</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <span>+250 700 000 000</span>
            <span>adventuremiststayinnrwanda@gmail.com</span>
            <span>Kigali, Rwanda</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Legal</h3>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/refund-policy">Refund & Cancellation Policy</Link>
            <span>Privacy Policy</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
