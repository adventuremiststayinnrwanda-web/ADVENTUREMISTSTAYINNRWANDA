"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 sage-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 font-bold text-stone-900 min-w-0">
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-md border border-emerald-800/20 bg-white shadow-sm">
            <Image src="/logo.jpg" alt="Adventure Mist Stay Inn Rwanda" fill sizes="40px" className="object-cover" />
          </div>
          <span className="hidden sm:inline font-bold text-stone-900 tracking-tight text-base sm:text-lg">
            Adventure Mist Stay Inn Rwanda
          </span>
          <span className="inline sm:hidden font-bold text-stone-900 tracking-tight text-xs sm:text-sm truncate max-w-[125px]">
            Adventure Mist
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 text-sm font-semibold text-stone-800 md:flex">
          <Link href="/" className="hover:text-emerald-950 transition">Home</Link>
          <Link href="/hotels" className="hover:text-emerald-950 transition">Hotels</Link>
          <Link href="/rooms" className="hover:text-emerald-950 transition">Rooms</Link>
          <Link href="/booking-lookup" className="hover:text-emerald-950 transition">My Booking</Link>
          <Link href="/admin" className="hover:text-emerald-950 transition">Admin</Link>
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <Link
            href="/hotels"
            className="shining-button inline-flex items-center gap-1.5 rounded-lg px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition shadow-md"
          >
            <CalendarCheck size={15} />
            <span>Book Now</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center p-2 rounded-lg text-stone-800 hover:bg-emerald-800/10 focus:outline-none active:bg-emerald-800/20 z-50 relative"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/40 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1 shadow-xl z-50 relative">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-semibold text-stone-900 hover:bg-emerald-800/10"
          >
            Home
          </Link>
          <Link
            href="/hotels"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-semibold text-stone-900 hover:bg-emerald-800/10"
          >
            Hotels
          </Link>
          <Link
            href="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-semibold text-stone-900 hover:bg-emerald-800/10"
          >
            Rooms
          </Link>
          <Link
            href="/booking-lookup"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-semibold text-stone-900 hover:bg-emerald-800/10"
          >
            My Booking
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-semibold text-stone-900 hover:bg-emerald-800/10"
          >
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
