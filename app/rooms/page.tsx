import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RoomCard } from "@/components/RoomCard";
import { hotels } from "@/lib/data";

export default function RoomsPage() {
  const rooms = hotels.flatMap((hotel) => hotel.rooms.map((room) => ({ hotel, room })));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="font-semibold text-emerald-800">Rooms</p>
        <h1 className="mt-2 text-4xl font-bold text-stone-950">Browse all rooms</h1>
        <div className="mt-8 grid gap-6">
          {rooms.map(({ hotel, room }) => (
            <RoomCard key={room.id} hotelSlug={hotel.slug} room={room} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
