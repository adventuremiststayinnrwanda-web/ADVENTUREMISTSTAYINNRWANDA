import { SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { hotels } from "@/lib/data";

export default function HotelsPage() {
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
        <div className="mt-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-4 md:grid-cols-5">
          <input className="rounded-md border border-stone-200 px-3 py-3" placeholder="City" />
          <input className="rounded-md border border-stone-200 px-3 py-3" placeholder="Hotel name" />
          <select className="rounded-md border border-stone-200 px-3 py-3">
            <option>Any price</option>
            <option>Under R1,000</option>
            <option>R1,000 - R1,500</option>
            <option>R1,500+</option>
          </select>
          <select className="rounded-md border border-stone-200 px-3 py-3">
            <option>Any rating</option>
            <option>4 stars+</option>
            <option>5 stars</option>
          </select>
          <button className="rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white">
            Search
          </button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
