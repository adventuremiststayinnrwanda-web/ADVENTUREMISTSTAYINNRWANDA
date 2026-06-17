import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { formatCurrency, Room } from "@/lib/data";

export function RoomCard({ hotelSlug, room }: { hotelSlug: string; room: Room }) {
  const available = room.status === "Available";

  return (
    <article className="group grid overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-lg md:grid-cols-[260px_1fr]">
      <div className="relative min-h-64 md:min-h-full overflow-hidden">
        <Image src={room.image} alt={room.name} fill sizes="(max-width: 768px) 100vw, 260px" className="object-cover hover-zoom" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-stone-950">{room.name}</h3>
              {room.originalPrice && room.originalPrice > room.price && (
                <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
                  Offer: {room.offerTitle || "Discounted"}
                </span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm text-stone-600">
              <Users size={16} />
              Up to {room.capacity} guests • {room.bedType} • {room.size}
            </p>
          </div>
          <span
            className={`rounded-md px-3 py-1 text-sm font-semibold ${
              available
                ? "bg-emerald-100 text-emerald-800"
                : "bg-stone-200 text-stone-700"
            }`}
          >
            {room.status}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-stone-600">{room.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {room.features.map((feature) => (
            <span key={feature} className="rounded-md bg-stone-100 px-3 py-1 text-sm text-stone-700">
              {feature}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-stone-600">
            {room.originalPrice && room.originalPrice > room.price ? (
              <>
                <span className="text-sm line-through text-stone-400 mr-2">{formatCurrency(room.originalPrice)}</span>
                <span className="text-2xl font-bold text-emerald-700">{formatCurrency(room.price)}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-stone-950">{formatCurrency(room.price)}</span>
            )}{" "}
            per night
          </p>
          <Link
            href={available ? `/hotels/${hotelSlug}/rooms/${room.id}` : "#"}
            aria-disabled={!available}
            className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold transition ${
              available
                ? "shining-button text-white"
                : "cursor-not-allowed bg-stone-200 text-stone-500"
            }`}
          >
            {available ? "Book Room" : "Unavailable"}
          </Link>
        </div>
      </div>
    </article>
  );
}
