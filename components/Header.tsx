import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 glass-panel">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-stone-950">
          <div className="relative h-10 w-10 overflow-hidden rounded-md border border-stone-200 bg-white">
            <Image src="/logo.jpg" alt="Adventure Mist Stay Inn Rwanda" fill sizes="40px" className="object-cover" />
          </div>
          <span>Adventure Mist Stay Inn Rwanda</span>
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
          className="shining-button inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold text-white transition"
        >
          <CalendarCheck size={17} />
          Book Now
        </Link>
      </nav>
    </header>
  );
}
