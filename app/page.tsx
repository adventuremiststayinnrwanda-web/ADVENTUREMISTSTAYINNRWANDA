import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Search, Star, Users } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { RoomCard } from "@/components/RoomCard";
import { hotels, reviews } from "@/lib/data";

export default function Home() {
  const popularRooms = hotels.flatMap((hotel) =>
    hotel.rooms.slice(0, 1).map((room) => ({ hotelSlug: hotel.slug, room }))
  );

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[680px] overflow-hidden bg-stone-950 text-white">
          <Image
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=80"
            alt="Luxury hotel pool and rooms"
            fill
            priority
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-stone-950/35" />
          <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Guest-first hotel booking
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">
                Find Your Perfect Hotel Stay
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-stone-100">
                Search, book, pay, and receive your QR check-in pass without creating
                an account first.
              </p>
            </div>
            <form className="mt-10 grid gap-3 rounded-lg bg-white p-3 text-stone-950 shadow-2xl md:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto]">
              <label className="flex items-center gap-3 rounded-md border border-stone-200 px-3 py-3">
                <MapPin className="text-emerald-700" size={20} />
                <input className="w-full outline-none" placeholder="City or hotel" />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 px-3 py-3">
                <CalendarDays className="text-emerald-700" size={20} />
                <input type="date" className="w-full outline-none" />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 px-3 py-3">
                <CalendarDays className="text-emerald-700" size={20} />
                <input type="date" className="w-full outline-none" />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 px-3 py-3">
                <Users className="text-emerald-700" size={20} />
                <select className="w-full outline-none">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                </select>
              </label>
              <Link
                href="/hotels"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
              >
                <Search size={19} />
                Search
              </Link>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-emerald-800">Featured hotels</p>
              <h2 className="mt-2 text-3xl font-bold text-stone-950">Places ready for booking</h2>
            </div>
            <Link href="/hotels" className="font-semibold text-emerald-800">
              View all hotels
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <p className="font-semibold text-emerald-800">Popular rooms</p>
              <h2 className="mt-2 text-3xl font-bold text-stone-950">Fast choices for your next stay</h2>
            </div>
            <div className="mt-8 grid gap-6">
              {popularRooms.map(({ hotelSlug, room }) => (
                <RoomCard key={room.id} hotelSlug={hotelSlug} room={room} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div>
            <p className="font-semibold text-emerald-800">Customer reviews</p>
            <h2 className="mt-2 text-3xl font-bold text-stone-950">Simple booking, smoother arrivals</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.name} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-4 text-stone-700">{review.comment}</p>
                <p className="mt-5 font-bold text-stone-950">{review.name}</p>
                <p className="text-sm text-stone-500">{review.location}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
