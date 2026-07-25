import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, QrCode, Users } from "lucide-react";
import { BookingCheckout } from "@/components/BookingCheckout";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RoomImageGallery } from "@/components/RoomImageGallery";
import { getDbHotel } from "@/lib/server/db";

export default async function RoomDetailsPage({
  params
}: {
  params: Promise<{ slug: string; roomId: string }>;
}) {
  const { slug, roomId } = await params;
  const hotel = await getDbHotel(slug);
  const room = hotel ? hotel.rooms.find((r) => r.id === roomId) || null : null;

  if (!hotel || !room) {
    notFound();
  }

  const galleryImages = room.images && room.images.length > 0 ? room.images : [room.image];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <section>
            {/* Full-page room gallery */}
            <div className="room-detail-gallery">
              <RoomImageGallery images={galleryImages} roomName={room.name} />
            </div>
            <div className="mt-8">
              <p className="font-semibold text-emerald-800">{hotel.name}</p>
              <h1 className="mt-2 text-4xl font-bold text-stone-950">{room.name}</h1>
              <p className="mt-4 text-lg leading-8 text-stone-700">{room.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <Users className="text-emerald-700" />
                  <p className="mt-3 font-semibold">Up to {room.capacity} guests</p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <CalendarDays className="text-emerald-700" />
                  <p className="mt-3 font-semibold">{room.bedType}</p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <QrCode className="text-emerald-700" />
                  <p className="mt-3 font-semibold">QR check-in included</p>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-stone-950">Guest checkout</h2>
            {room.status === "Available" ? (
              <>
                <p className="mt-2 text-sm text-stone-600">No customer registration required.</p>
                <BookingCheckout
                  hotelSlug={hotel.slug}
                  roomId={room.id}
                  roomPrice={room.price}
                  roomCapacity={room.capacity}
                  roomName={room.name}
                />
              </>
            ) : (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50/50 p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <CalendarDays size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-stone-900">
                  {room.status === "Fully booked" ? "This Room has Been Booked" : "Room Unavailable"}
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  {room.status === "Fully booked"
                    ? "This room is currently occupied by another guest. Please check back later or view other rooms."
                    : "This room is currently undergoing maintenance and is not available for booking."}
                </p>
                <div className="mt-6">
                  <a
                    href={`/hotels/${hotel.slug}`}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 transition"
                  >
                    View Other Rooms
                  </a>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
