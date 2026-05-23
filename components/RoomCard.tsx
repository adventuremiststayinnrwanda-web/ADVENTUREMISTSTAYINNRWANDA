import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import { formatCurrency, Room } from "@/lib/data";

export function RoomCard({ hotelSlug, room }: { hotelSlug: string; room: Room }) {
  const available = room.status === "Available";

  return (
    <article className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm md:grid-cols-[260px_1fr]">
      <div className="relative min-h-64 md:min-h-full">
        <Image src={room.image} alt={room.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-950">{room.name}</h3>
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
            <span className="text-2xl font-bold text-stone-950">{formatCurrency(room.price)}</span>{" "}
            per night
          </p>
          <Link
            href={available ? `/hotels/${hotelSlug}/rooms/${room.id}` : "#"}
            aria-disabled={!available}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              available
                ? "bg-emerald-700 text-white hover:bg-emerald-800"
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
