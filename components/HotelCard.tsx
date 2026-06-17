import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { formatCurrency, Hotel } from "@/lib/data";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={hotel.image} alt={hotel.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover hover-zoom" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-950">{hotel.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
              <MapPin size={15} />
              {hotel.city}, {hotel.country}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-800">
            <Star size={15} fill="currentColor" />
            {hotel.rating}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-stone-600">
            From <span className="font-bold text-stone-950">{formatCurrency(hotel.priceFrom)}</span>
          </p>
          <Link
            href={`/hotels/${hotel.slug}`}
            className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 hover:shadow-sm"
          >
            View Rooms
          </Link>
        </div>
      </div>
    </article>
  );
}
