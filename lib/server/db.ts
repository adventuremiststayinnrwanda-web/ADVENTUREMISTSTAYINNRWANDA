import { cache } from "react";
import { supabaseRest } from "@/lib/server/supabaseRest";
import { Hotel, Room, hotels as staticHotels, reviews as staticReviews } from "@/lib/data";

// Helper to generate slug from name
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export const getDbHotels = cache(async function getDbHotels(): Promise<Hotel[]> {
  try {
    // Fetch all required data in parallel to drastically improve loading speed
    const [hotelsData, roomsData, hotelImages, roomImages, offersData] = await Promise.all([
      supabaseRest<any[]>("hotels?select=*&status=eq.active"),
      supabaseRest<any[]>("rooms?select=*"),
      supabaseRest<any[]>("hotel_images?select=*&order=sort_order.asc"),
      supabaseRest<any[]>("room_images?select=*&order=sort_order.asc"),
      supabaseRest<any[]>("offers?select=*&status=eq.active").catch(() => [])
    ]);

    if (!hotelsData || hotelsData.length === 0) return [];

    const now = new Date();

    // Map rooms
    const mappedRooms = roomsData.map((room) => {
      const images = roomImages.filter((img) => img.room_id === room.id).map((img) => img.image_url);
      const primaryImage = images[0] || "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80";

      const basePrice = Number(room.price_per_night);
      let activePrice = basePrice;
      let originalPrice: number | undefined = undefined;
      let offerTitle: string | undefined = undefined;

      // Find active room-specific offer first
      let activeOffer = (offersData || []).find((o) => 
        o.room_id === room.id &&
        (!o.valid_from || new Date(o.valid_from) <= now) &&
        (!o.valid_until || new Date(o.valid_until) >= now)
      );

      // If not found, find hotel-specific offer
      if (!activeOffer) {
        activeOffer = (offersData || []).find((o) => 
          o.hotel_id === room.hotel_id &&
          !o.room_id &&
          (!o.valid_from || new Date(o.valid_from) <= now) &&
          (!o.valid_until || new Date(o.valid_until) >= now)
        );
      }

      if (activeOffer) {
        originalPrice = basePrice;
        offerTitle = activeOffer.title;
        if (activeOffer.discount_type === "percentage") {
          activePrice = Math.round(basePrice * (1 - Number(activeOffer.discount_value) / 100));
        } else if (activeOffer.discount_type === "flat") {
          activePrice = Math.max(0, basePrice - Number(activeOffer.discount_value));
        }
      }

      return {
        id: room.id,
        name: room.name,
        price: activePrice,
        ...(originalPrice !== undefined ? { originalPrice, offerTitle } : {}),
        capacity: Number(room.capacity),
        bedType: room.bed_type || "Queen bed",
        size: room.room_size || "28 sqm",
        status: room.status === "available" ? "Available" : room.status === "fully_booked" ? "Fully booked" : "Maintenance",
        image: primaryImage,
        images: images.length > 0 ? images : [primaryImage],
        features: Array.isArray(room.amenities) && room.amenities.length > 0 ? room.amenities : ["WiFi", "Breakfast", "Hot shower", "Work desk"],
        description: room.description || ""
      } as Room;
    });

    // Map hotels
    return hotelsData.map((hotel) => {
      const hotelRooms = mappedRooms.filter((r) => {
        const originalRoom = roomsData.find((orig) => orig.id === r.id);
        return originalRoom && originalRoom.hotel_id === hotel.id;
      });

      const images = hotelImages.filter((img) => img.hotel_id === hotel.id).map((img) => img.image_url);
      const gallery = images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
      ];

      const slug = slugify(hotel.name);
      const prices = hotelRooms.map((r) => r.price);
      const computedPriceFrom = prices.length > 0 ? Math.min(...prices) : Number(hotel.price_from || 0);

      return {
        id: hotel.id,
        slug,
        name: hotel.name,
        city: hotel.city,
        country: hotel.country,
        rating: Number(hotel.rating || 4.5),
        priceFrom: computedPriceFrom,
        image: gallery[0],
        gallery,
        description: hotel.description || "",
        address: hotel.address || "",
        phone: hotel.contact_phone || "",
        email: hotel.contact_email || "",
        amenities: Array.isArray(hotel.amenities) && hotel.amenities.length > 0 ? hotel.amenities : [
          "WiFi",
          "Parking",
          "Restaurant",
          "Breakfast",
          "Coffee",
          "Security",
          "Mountain views",
          "Air conditioning"
        ],
        rooms: hotelRooms
      } as Hotel;
    });
  } catch (error) {
    console.error("Database fetch error in getDbHotels:", error);
    throw error;
  }
});

export const getDbHotel = cache(async function getDbHotel(slug: string): Promise<Hotel | null> {
  const hotelsList = await getDbHotels();
  return hotelsList.find((h) => h.slug === slug) || null;
});

export const getDbRoom = cache(async function getDbRoom(hotelSlug: string, roomId: string): Promise<Room | null> {
  const hotel = await getDbHotel(hotelSlug);
  return hotel?.rooms.find((r) => r.id === roomId) || null;
});

export const getDbReviews = cache(async function getDbReviews() {
  try {
    const rawReviews = await supabaseRest<any[]>(
      "reviews?select=*,bookings(guest_full_name,hotels(city))&status=eq.published"
    );
    if (!rawReviews) return [];
    return rawReviews.map((r) => ({
      id: r.id,
      rating: Number(r.rating || 5),
      comment: r.comment || "",
      name: r.bookings?.guest_full_name || "Guest",
      location: r.bookings?.hotels?.city || "Kigali"
    }));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("ENOTFOUND") || msg.includes("fetch failed") || msg.includes("Connect Timeout")) {
      console.warn("Supabase URL is unreachable. Using static local reviews fallback.");
    } else {
      console.error("Error fetching reviews:", error);
    }
    return staticReviews.map((r, index) => ({
      id: `static-review-${index}`,
      rating: r.rating,
      comment: r.comment,
      name: r.name,
      location: r.location
    }));
  }
});

const fallbackPartners = [
  {
    id: "fallback-1",
    name: "Visit Rwanda",
    logo_url: "",
    status: "active"
  },
  {
    id: "fallback-2",
    name: "Rwanda Development Board (RDB)",
    logo_url: "",
    status: "active"
  }
];

export const getDbPartnerships = cache(async function getDbPartnerships() {
  try {
    const rawPartners = await supabaseRest<any[]>(
      "partnerships?select=*&status=eq.active&order=created_at.desc"
    );
    return rawPartners || [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("PGRST205") ||
      message.includes("Could not find the table") ||
      message.includes("Connect Timeout Error") ||
      message.includes("ENOTFOUND") ||
      message.includes("fetch failed")
    ) {
      console.warn("Supabase URL is unreachable or Partnerships table not available. Using fallback partnership data.");
      return fallbackPartners;
    }
    console.error("Error fetching partnerships:", error);
    return [];
  }
});

export const getDbHotelReviews = cache(async function getDbHotelReviews(hotelId: string) {
  try {
    const rawReviews = await supabaseRest<any[]>(
      `reviews?select=*,bookings(guest_full_name)&hotel_id=eq.${encodeURIComponent(hotelId)}&status=eq.published`
    );
    if (!rawReviews) return [];
    return rawReviews.map((r) => ({
      id: r.id,
      rating: Number(r.rating || 5),
      comment: r.comment || "",
      name: r.bookings?.guest_full_name || "Guest",
      created_at: r.created_at
    }));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("ENOTFOUND") || msg.includes("fetch failed") || msg.includes("Connect Timeout")) {
      console.warn("Supabase URL is unreachable. Using static local hotel reviews fallback.");
    } else {
      console.error("Error fetching hotel reviews:", error);
    }
    return staticReviews.map((r, index) => ({
      id: `static-hreview-${index}`,
      rating: r.rating,
      comment: r.comment,
      name: r.name,
      created_at: new Date().toISOString()
    }));
  }
});
