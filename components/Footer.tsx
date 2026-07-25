import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-lg font-bold">Adventure Mist Stay Inn Rwanda</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Your trusted travel and hotel booking partner in Rwanda. Compare accommodations, secure the best rates, and enjoy a smooth booking experience from start to finish.
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
            <span>+250 782 656 071</span>
            <span>adventuremiststayinnrwanda@gmail.com</span>
            <span>Musanze, Ruhengeri, Rwanda</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Legal</h3>
          <div className="mt-3 grid gap-2 text-sm text-stone-300">
            <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>
            <span>Privacy Policy</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800 bg-stone-950 py-5 text-center text-xs text-stone-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Adventure Mist Stay Inn Rwanda. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium text-stone-300">
            Powered by <span className="font-bold tracking-wide text-emerald-400">P &amp; D Digital Solution</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
