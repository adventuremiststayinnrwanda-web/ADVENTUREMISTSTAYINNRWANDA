export const dynamic = 'force-dynamic';
import { SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { getDbHotels } from "@/lib/server/db";

type SearchParams = Promise<{
  search?: string;
  city?: string;
  name?: string;
  price?: string;
  rating?: string;
  guests?: string;
  checkin?: string;
  checkout?: string;
}>;

export default async function HotelsPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const resolvedParams = await searchParams;
  const rawHotels = await getDbHotels();

  let hotels = rawHotels;

  // Apply filters
  if (resolvedParams.search) {
    const q = resolvedParams.search.toLowerCase().trim();
    hotels = hotels.filter(
      (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
    );
  }
  if (resolvedParams.city) {
    const q = resolvedParams.city.toLowerCase().trim();
    hotels = hotels.filter((h) => h.city.toLowerCase().includes(q));
  }
  if (resolvedParams.name) {
    const q = resolvedParams.name.toLowerCase().trim();
    hotels = hotels.filter((h) => h.name.toLowerCase().includes(q));
  }
  if (resolvedParams.rating && resolvedParams.rating !== "any") {
    if (resolvedParams.rating === "4plus") {
      hotels = hotels.filter((h) => h.rating >= 4.0);
    } else if (resolvedParams.rating === "5") {
      hotels = hotels.filter((h) => h.rating >= 5.0);
    }
  }
  if (resolvedParams.price && resolvedParams.price !== "any") {
    if (resolvedParams.price === "under100") {
      hotels = hotels.filter((h) => h.priceFrom < 100);
    } else if (resolvedParams.price === "100-150") {
      hotels = hotels.filter((h) => h.priceFrom >= 100 && h.priceFrom <= 150);
    } else if (resolvedParams.price === "150plus") {
      hotels = hotels.filter((h) => h.priceFrom > 150);
    }
  }
  if (resolvedParams.guests) {
    const guestCount = Number(resolvedParams.guests);
    if (!isNaN(guestCount) && guestCount > 0) {
      hotels = hotels.filter((h) => h.rooms.some((r) => r.capacity >= guestCount));
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-emerald-800">Hotels</p>
            <h1 className="mt-2 text-4xl font-bold text-stone-950">Available hotels</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 font-semibold text-stone-800">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        <form method="GET" action="/hotels" className="mt-8 grid gap-3 rounded-lg border border-stone-200 bg-white p-3 sm:p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {resolvedParams.checkin && <input type="hidden" name="checkin" value={resolvedParams.checkin} />}
          {resolvedParams.checkout && <input type="hidden" name="checkout" value={resolvedParams.checkout} />}
          {resolvedParams.guests && <input type="hidden" name="guests" value={resolvedParams.guests} />}
          
          <input
            name="city"
            defaultValue={resolvedParams.city || resolvedParams.search || ""}
            className="rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-emerald-700 focus:ring-2 focus:ring-emerald-300"
            placeholder="City"
          />
          <input
            name="name"
            defaultValue={resolvedParams.name || ""}
            className="rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-emerald-700 focus:ring-2 focus:ring-emerald-300"
            placeholder="Hotel name"
          />
          <select
            name="price"
            defaultValue={resolvedParams.price || "any"}
            className="rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-emerald-700 focus:ring-2 focus:ring-emerald-300"
          >
            <option value="any">Any price</option>
            <option value="under100">Under $100</option>
            <option value="100-150">$100 - $150</option>
            <option value="150plus">$150+</option>
          </select>
          <select
            name="rating"
            defaultValue={resolvedParams.rating || "any"}
            className="rounded-md border border-stone-200 px-3 py-2 text-sm focus:outline-emerald-700 focus:ring-2 focus:ring-emerald-300"
          >
            <option value="any">Any rating</option>
            <option value="4plus">4 stars+</option>
            <option value="5">5 stars</option>
          </select>
          <button type="submit" className="rounded-md bg-emerald-700 px-4 py-2 text-sm sm:py-3 font-semibold text-white hover:bg-emerald-800 transition cursor-pointer w-full">
            Search
          </button>
        </form>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {hotels.length === 0 && (
            <p className="col-span-3 text-center py-16 text-stone-500">No hotels match your search criteria.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
