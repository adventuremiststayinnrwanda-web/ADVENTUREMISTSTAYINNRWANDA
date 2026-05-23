import Link from "next/link";
import { CalendarCheck, Hotel } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-950">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-700 text-white">
            <Hotel size={22} />
          </span>
          <span>StayEase</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          <Link href="/">Home</Link>
          <Link href="/hotels">Hotels</Link>
          <Link href="/rooms">Rooms</Link>
          <Link href="/booking-lookup">My Booking</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <Link
          href="/hotels"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
        >
          <CalendarCheck size={17} />
          Book Now
        </Link>
      </nav>
    </header>
  );
}
