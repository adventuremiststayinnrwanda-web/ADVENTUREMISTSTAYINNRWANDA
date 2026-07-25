export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Search, Star, Users, Banknote, Compass, Briefcase, Heart, Palmtree, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { RoomCard } from "@/components/RoomCard";
import { Partnerships } from "@/components/Partnerships";
import { getDbHotels, getDbReviews, getDbPartnerships } from "@/lib/server/db";

export default async function Home() {
  const [hotels, reviews, partnerships] = await Promise.all([
    getDbHotels(),
    getDbReviews().then((r) => r || []),
    getDbPartnerships().then((p) => p || [])
  ]);
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
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/20" />
          
          <div className="relative mx-auto flex min-h-[500px] sm:min-h-[680px] max-w-7xl flex-col justify-center px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl drop-shadow-lg">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                YOUR TRUSTED TRAVEL & HOTEL BOOKING PARTNER IN RWANDA
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md">
                Find & Book Your <span className="shining-text">Perfect Hotel Stay</span>
              </h1>
              <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg leading-7 sm:leading-8 text-stone-200 drop-shadow">
                Adventure Mist Stay Inn Rwanda is your trusted travel and hotel booking partner in Rwanda. Whether you&apos;re planning a vacation, business trip, honeymoon, or family getaway, we help you discover and book the perfect hotel with ease.
              </p>
            </div>
            <form action="/hotels" className="mt-10 grid gap-3 rounded-2xl p-4 text-stone-950 glass-panel grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]">
              <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-3">
                <MapPin className="text-emerald-700 flex-shrink-0" size={20} />
                <input name="search" className="w-full outline-none bg-transparent text-sm" placeholder="City or hotel name" />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-3">
                <CalendarDays className="text-emerald-700 flex-shrink-0" size={20} />
                <input name="checkin" type="date" min={new Date().toISOString().split("T")[0]} className="w-full outline-none bg-transparent text-sm" />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-3">
                <CalendarDays className="text-emerald-700 flex-shrink-0" size={20} />
                <input name="checkout" type="date" min={new Date().toISOString().split("T")[0]} className="w-full outline-none bg-transparent text-sm" />
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-3">
                <Banknote className="text-emerald-700 flex-shrink-0" size={20} />
                <select name="price" className="w-full outline-none bg-transparent text-sm">
                  <option value="any">Any Price</option>
                  <option value="under100">Under $100</option>
                  <option value="100-150">$100 - $150</option>
                  <option value="150plus">$150+</option>
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-3">
                <Users className="text-emerald-700 flex-shrink-0" size={20} />
                <select name="guests" className="w-full outline-none bg-transparent text-sm">
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </label>
              <button
                type="submit"
                className="shining-button inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 sm:px-6 font-semibold text-white transition cursor-pointer text-sm sm:text-base"
              >
                <Search size={19} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="bg-emerald-950 text-stone-100 py-12 border-b border-emerald-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">WHAT WE DO</span>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white">Your Ultimate Hotel & Travel Partner</h2>
              <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                Compare accommodations, secure the best rates, and enjoy a smooth booking experience from start to finish—all in one place.
              </p>
            </div>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-xl bg-emerald-900/40 border border-emerald-800/60 p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-emerald-800/80 text-emerald-300 mb-4">
                  <Palmtree size={28} />
                </div>
                <h3 className="font-bold text-lg text-white">Vacations</h3>
                <p className="mt-2 text-sm text-stone-300">Discover incredible Rwanda getaways, volcano lodges, and lakeside resorts.</p>
              </div>

              <div className="rounded-xl bg-emerald-900/40 border border-emerald-800/60 p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-emerald-800/80 text-emerald-300 mb-4">
                  <Briefcase size={28} />
                </div>
                <h3 className="font-bold text-lg text-white">Business Trips</h3>
                <p className="mt-2 text-sm text-stone-300">Seamless bookings with fast check-in for corporate and business travelers.</p>
              </div>

              <div className="rounded-xl bg-emerald-900/40 border border-emerald-800/60 p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-emerald-800/80 text-emerald-300 mb-4">
                  <Heart size={28} />
                </div>
                <h3 className="font-bold text-lg text-white">Honeymoons</h3>
                <p className="mt-2 text-sm text-stone-300">Romantic stays, serene views, and luxury accommodations for couples.</p>
              </div>

              <div className="rounded-xl bg-emerald-900/40 border border-emerald-800/60 p-6 flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-emerald-800/80 text-emerald-300 mb-4">
                  <Users size={28} />
                </div>
                <h3 className="font-bold text-lg text-white">Family Getaways</h3>
                <p className="mt-2 text-sm text-stone-300">Spacious suites and family-friendly hotels tailored to all group sizes.</p>
              </div>
            </div>
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
              <article key={review.id} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
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

        {/* Partnerships Section - Placed right below Customer Reviews */}
        <Partnerships partners={partnerships} />
      </main>
      <Footer />
    </>
  );
}
