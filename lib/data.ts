import {
  AirVent,
  Car,
  Coffee,
  Dumbbell,
  Mountain,
  ShieldCheck,
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
  originalPrice?: number;
  offerTitle?: string;
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
  Breakfast: Soup,
  Coffee: Coffee,
  Security: ShieldCheck,
  "Mountain views": Mountain
};

export const hotels: Hotel[] = [
  {
    id: "adventure-mist-stay-inn-rwanda",
    slug: "adventure-mist-stay-inn-rwanda",
    name: "Adventure Mist Stay Inn Rwanda",
    city: "Kigali",
    country: "Rwanda",
    rating: 4.8,
    priceFrom: 65,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80"
    ],
    description:
      "Adventure Mist Stay Inn Rwanda is a calm Kigali stay for travelers who want comfort, reliable service, and easy access to Rwanda's city experiences and outdoor adventures.",
    address: "Kigali, Rwanda",
    phone: "+250 700 000 000",
    email: "adventuremiststayinnrwanda@gmail.com",
    amenities: [
      "WiFi",
      "Parking",
      "Restaurant",
      "Breakfast",
      "Coffee",
      "Security",
      "Mountain views",
      "Air conditioning"
    ],
    rooms: [
      {
        id: "standard-queen-room",
        name: "Standard Queen Room",
        price: 10,
        capacity: 2,
        bedType: "Queen bed",
        size: "28 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
        features: ["WiFi", "Breakfast", "Hot shower", "Work desk"],
        description:
          "A clean and comfortable queen room for solo travelers or couples, with breakfast and reliable WiFi included."
      },
      {
        id: "deluxe-king-room",
        name: "Deluxe King Room",
        price: 90,
        capacity: 2,
        bedType: "King bed",
        size: "36 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        features: ["King bed", "Breakfast", "Air conditioning", "Mountain views"],
        description:
          "A spacious king room with a calmer premium feel, designed for longer stays and restful evenings in Kigali."
      },
      {
        id: "family-suite",
        name: "Family Suite",
        price: 125,
        capacity: 4,
        bedType: "King bed + twin beds",
        size: "52 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
        features: ["Family space", "Breakfast", "Mini fridge", "TV"],
        description:
          "A practical suite for families or small groups with extra sleeping space, TV, breakfast, and room to settle in."
      },
      {
        id: "adventure-view-suite",
        name: "Adventure View Suite",
        price: 150,
        capacity: 3,
        bedType: "King bed + sofa",
        size: "58 sqm",
        status: "Available",
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        features: ["Lounge", "Mountain views", "Breakfast", "Premium linen"],
        description:
          "A larger suite with lounge seating and scenic views, ideal for guests who want extra comfort after a day out."
      }
    ]
  }
];

export const reviews = [
  {
    name: "Divine U.",
    location: "Kigali",
    rating: 5,
    comment: "The stay was quiet, friendly, and easy to arrange."
  },
  {
    name: "Jean Paul M.",
    location: "Musanze",
    rating: 5,
    comment: "Comfortable rooms and a smooth booking process."
  },
  {
    name: "Aline K.",
    location: "Kigali",
    rating: 4,
    comment: "Good location, helpful service, and clear prices."
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
