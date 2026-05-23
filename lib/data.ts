import {
  AirVent,
  Car,
  Dumbbell,
  Soup,
  Tv,
  Utensils,
  Waves,
  Wifi
} from "lucide-react";

export type Room = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  bedType: string;
  size: string;
  status: "Available" | "Fully booked" | "Maintenance";
  image: string;
  features: string[];
  description: string;
};

export type Hotel = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  priceFrom: number;
  image: string;
  gallery: string[];
  description: string;
  address: string;
  phone: string;
  email: string;
  amenities: string[];
  rooms: Room[];
};

export const amenityIcons = {
  WiFi: Wifi,
  Pool: Waves,
  Parking: Car,
  Gym: Dumbbell,
  Restaurant: Utensils,
  "Air conditioning": AirVent,
  TV: Tv,
  Breakfast: Soup
};

export const hotels: Hotel[] = [
  {
    id: "h-001",
    slug: "aurora-grand-hotel",
    name: "Aurora Grand Hotel",
    city: "Cape Town",
    country: "South Africa",
    rating: 4.8,
    priceFrom: 1420,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "A polished coastal hotel with spacious suites, mountain views, and a calm hospitality experience for business and leisure stays.",
    address: "18 Ocean View Road, Cape Town",
    phone: "+27 21 555 0180",
    email: "reservations@auroragrand.example",
    amenities: ["WiFi", "Pool", "Parking", "Gym", "Restaurant", "Air conditioning"],
    rooms: [
      {
        id: "r-001",
        name: "Deluxe Ocean Room",
        price: 1420,
        capacity: 2,
        bedType: "King bed",
        size: "38 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        features: ["Balcony", "TV", "Hot shower", "Breakfast"],
        description:
          "A bright ocean-facing room with private balcony, work desk, breakfast, and fast WiFi."
      },
      {
        id: "r-002",
        name: "Executive Mountain Suite",
        price: 2180,
        capacity: 3,
        bedType: "King bed + sofa",
        size: "55 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        features: ["Lounge", "TV", "Breakfast", "Air conditioning"],
        description:
          "A larger suite with lounge seating, premium linens, and generous storage for longer stays."
      }
    ]
  },
  {
    id: "h-002",
    slug: "harbor-atelier",
    name: "Harbor Atelier",
    city: "Durban",
    country: "South Africa",
    rating: 4.6,
    priceFrom: 980,
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "A city harbor stay with comfortable rooms, easy beach access, and practical amenities for quick trips.",
    address: "44 Marina Street, Durban",
    phone: "+27 31 555 0144",
    email: "hello@harboratelier.example",
    amenities: ["WiFi", "Parking", "Restaurant", "Air conditioning"],
    rooms: [
      {
        id: "r-003",
        name: "Classic Queen Room",
        price: 980,
        capacity: 2,
        bedType: "Queen bed",
        size: "30 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
        features: ["TV", "Hot shower", "Air conditioning"],
        description:
          "A compact, quiet room with soft lighting and everything needed for an easy overnight stay."
      },
      {
        id: "r-004",
        name: "Family Studio",
        price: 1560,
        capacity: 4,
        bedType: "Two queen beds",
        size: "48 sqm",
        status: "Fully booked",
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
        features: ["TV", "Breakfast", "Mini fridge"],
        description:
          "A practical family room with two queen beds, breakfast, and extra space for luggage."
      }
    ]
  },
  {
    id: "h-003",
    slug: "garden-court-luxe",
    name: "Garden Court Luxe",
    city: "Johannesburg",
    country: "South Africa",
    rating: 4.7,
    priceFrom: 1250,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "A modern urban hotel with garden spaces, business-friendly rooms, and fast access to key city districts.",
    address: "7 Rosebank Avenue, Johannesburg",
    phone: "+27 11 555 0107",
    email: "stay@gardencourtluxe.example",
    amenities: ["WiFi", "Pool", "Parking", "Gym", "Restaurant"],
    rooms: [
      {
        id: "r-005",
        name: "Garden King Room",
        price: 1250,
        capacity: 2,
        bedType: "King bed",
        size: "35 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
        features: ["TV", "Breakfast", "Work desk"],
        description:
          "A refined king room overlooking the hotel garden, with a proper desk and quiet sleep setup."
      },
      {
        id: "r-006",
        name: "Business Twin Room",
        price: 1320,
        capacity: 2,
        bedType: "Two twin beds",
        size: "34 sqm",
        status: "Maintenance",
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
        features: ["TV", "Hot shower", "Work desk"],
        description:
          "A twin room designed for colleagues or friends travelling together."
      }
    ]
  }
];

export const reviews = [
  {
    name: "Maya Dlamini",
    location: "Pretoria",
    rating: 5,
    comment: "The booking was quick and the QR check-in made arrival feel effortless."
  },
  {
    name: "Theo Jacobs",
    location: "Cape Town",
    rating: 5,
    comment: "Clear prices, smooth payment, and the hotel had everything listed."
  },
  {
    name: "Amina Khan",
    location: "Durban",
    rating: 4,
    comment: "I liked that I could book without creating an account first."
  }
];

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);

export const getHotel = (slug: string) => hotels.find((hotel) => hotel.slug === slug);

export const getRoom = (hotelSlug: string, roomId: string) =>
  getHotel(hotelSlug)?.rooms.find((room) => room.id === roomId);
