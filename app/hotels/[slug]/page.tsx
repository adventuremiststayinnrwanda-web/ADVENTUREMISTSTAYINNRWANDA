export const dynamic = 'force-dynamic';
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RoomCard } from "@/components/RoomCard";
import { ReviewForm } from "@/components/ReviewForm";
import { amenityIcons } from "@/lib/data";
import { getDbHotel, getDbHotelReviews } from "@/lib/server/db";

export default async function HotelDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = await getDbHotel(slug);

  if (!hotel) {
    notFound();
  }

  const reviews = await getDbHotelReviews(hotel.id);

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="relative min-h-[420px] overflow-hidden rounded-lg">
              <Image src={hotel.gallery[0]} alt={hotel.name} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" priority />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {hotel.gallery.slice(1).map((image) => (
                <div key={image} className="relative min-h-48 overflow-hidden rounded-lg">
                  <Image src={image} alt={hotel.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 460px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="font-semibold text-emerald-800">{hotel.city}, {hotel.country}</p>
              <h1 className="mt-2 text-4xl font-bold text-stone-950">{hotel.name}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-700">{hotel.description}</p>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-stone-950">Amenities</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {hotel.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity as keyof typeof amenityIcons];
                    return (
                      <div key={amenity} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-4">
                        {Icon ? <Icon className="text-emerald-700" size={20} /> : null}
                        <span className="font-medium text-stone-800">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <aside className="h-fit rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-950">Hotel contact</h2>
              <div className="mt-4 grid gap-4 text-sm text-stone-700">
                <p className="flex gap-3">
                  <MapPin className="text-emerald-700" size={18} />
                  {hotel.address}
                </p>
                <p className="flex gap-3">
                  <Phone className="text-emerald-700" size={18} />
                  {hotel.phone}
                </p>
                <p className="flex gap-3">
                  <Mail className="text-emerald-700" size={18} />
                  {hotel.email}
                </p>
              </div>
              <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-stone-100 p-6 text-center text-sm text-stone-600">
                Google Maps integration placeholder
              </div>
            </aside>
          </div>
        </section>
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-stone-950">Rooms at {hotel.name}</h2>
            <div className="mt-8 grid gap-6">
              {hotel.rooms.map((room) => (
                <RoomCard key={room.id} hotelSlug={hotel.slug} room={room} />
              ))}
              {hotel.rooms.length === 0 && (
                <p className="text-center py-10 text-stone-500">No rooms available at this hotel.</p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-stone-50 py-12 border-t border-stone-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-stone-950">Guest Reviews</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-stone-950">{review.name}</p>
                        <p className="text-xs text-stone-500">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <Star key={index} size={16} fill="currentColor" className="stroke-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-stone-700 text-sm leading-relaxed">{review.comment}</p>
                  </article>
                ))}
                {reviews.length === 0 && (
                  <p className="py-10 text-stone-500 text-center border border-dashed border-stone-200 bg-white rounded-xl">No reviews yet for this hotel.</p>
                )}
              </div>
              <div>
                <ReviewForm hotelId={hotel.id} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
