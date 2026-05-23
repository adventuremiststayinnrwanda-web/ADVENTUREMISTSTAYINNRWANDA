"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarCheck,
  CreditCard,
  Hotel,
  Loader2,
  Lock,
  LogOut,
  Save,
  TrendingUp
} from "lucide-react";
import { formatCurrency } from "@/lib/data";

type HotelRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  status: string;
  price_from: number;
};

type RoomRow = {
  id: string;
  hotel_id: string;
  name: string;
  room_number: string | null;
  price_per_night: number;
  capacity: number;
  status: string;
};

type BookingRow = {
  id: string;
  booking_reference: string;
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  total_amount: number;
  status: string;
  created_at: string;
};

type PaymentRow = {
  id: string;
  booking_id: string;
  gateway_reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
};

type DashboardData = {
  stats: {
    bookings: number;
    revenue: number;
    availableRooms: number;
    pendingPayments: number;
  };
  hotels: HotelRow[];
  rooms: RoomRow[];
  bookings: BookingRow[];
  payments: PaymentRow[];
};

const roomStatuses = ["available", "fully_booked", "maintenance"];
const bookingStatuses = ["pending_payment", "confirmed", "checked_in", "completed", "cancelled", "refunded"];

async function apiFetch(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {})
    }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export function AdminDashboard() {
  const [email, setEmail] = useState("adventuremiststayinnrwanda@gmail.com");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [hotelForm, setHotelForm] = useState({
    name: "Adventure Mist Stay Inn Rwanda",
    city: "Kigali",
    country: "Rwanda",
    price_from: "65",
    status: "active"
  });
  const [roomForm, setRoomForm] = useState({
    hotel_id: "",
    name: "",
    room_number: "",
    price_per_night: "65",
    capacity: "2",
    status: "available"
  });

  const hotelById = useMemo(
    () => new Map((data?.hotels || []).map((hotel) => [hotel.id, hotel])),
    [data?.hotels]
  );

  async function loadDashboard() {
    setError("");
    const dashboard = (await apiFetch("/api/admin/dashboard")) as DashboardData;
    setData(dashboard);
    setRoomForm((current) => ({
      ...current,
      hotel_id: current.hotel_id || dashboard.hotels[0]?.id || ""
    }));
  }

  useEffect(() => {
    async function boot() {
      try {
        const session = await apiFetch("/api/admin/session");
        setAuthenticated(session.authenticated);

        if (session.authenticated) {
          await loadDashboard();
        }
      } catch (sessionError) {
        setError(sessionError instanceof Error ? sessionError.message : "Unable to load admin session.");
      } finally {
        setLoading(false);
      }
    }

    boot();
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving("login");
    setError("");

    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setAuthenticated(true);
      await loadDashboard();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setSaving("");
    }
  }

  async function logout() {
    await apiFetch("/api/admin/logout", { method: "POST", body: "{}" });
    setAuthenticated(false);
    setData(null);
    setPassword("");
  }

  async function addHotel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving("hotel");
    setError("");

    try {
      await apiFetch("/api/admin/hotels", {
        method: "POST",
        body: JSON.stringify(hotelForm)
      });
      await loadDashboard();
    } catch (hotelError) {
      setError(hotelError instanceof Error ? hotelError.message : "Unable to add hotel.");
    } finally {
      setSaving("");
    }
  }

  async function addRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving("room");
    setError("");

    try {
      await apiFetch("/api/admin/rooms", {
        method: "POST",
        body: JSON.stringify(roomForm)
      });
      setRoomForm((current) => ({ ...current, name: "", room_number: "" }));
      await loadDashboard();
    } catch (roomError) {
      setError(roomError instanceof Error ? roomError.message : "Unable to add room.");
    } finally {
      setSaving("");
    }
  }

  async function updateRoomStatus(room: RoomRow, status: string) {
    setSaving(room.id);
    await apiFetch("/api/admin/rooms", {
      method: "PATCH",
      body: JSON.stringify({ ...room, status })
    });
    await loadDashboard();
    setSaving("");
  }

  async function updateBookingStatus(booking: BookingRow, status: string) {
    setSaving(booking.id);
    await apiFetch("/api/admin/bookings", {
      method: "PATCH",
      body: JSON.stringify({ id: booking.id, status })
    });
    await loadDashboard();
    setSaving("");
  }

  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4">
        <Loader2 className="animate-spin text-emerald-700" />
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={login} className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Lock className="text-emerald-700" />
            <div>
              <p className="font-semibold text-emerald-800">Admin login</p>
              <h1 className="text-2xl font-bold text-stone-950">Adventure Mist controls</h1>
            </div>
          </div>
          <label className="mt-6 grid gap-2">
            <span className="text-sm font-semibold text-stone-800">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border border-stone-300 px-3 py-3"
            />
          </label>
          <label className="mt-4 grid gap-2">
            <span className="text-sm font-semibold text-stone-800">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-stone-300 px-3 py-3"
            />
          </label>
          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <button
            disabled={saving === "login"}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white disabled:bg-stone-400"
          >
            {saving === "login" ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-emerald-800">Admin dashboard</p>
          <h1 className="mt-2 text-4xl font-bold text-stone-950">Adventure Mist management</h1>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-800"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error ? <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {[
          { label: "Bookings", value: data?.stats.bookings || 0, icon: CalendarCheck },
          { label: "Revenue", value: formatCurrency(data?.stats.revenue || 0), icon: CreditCard },
          { label: "Available rooms", value: data?.stats.availableRooms || 0, icon: BedDouble },
          { label: "Pending payments", value: data?.stats.pendingPayments || 0, icon: TrendingUp }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <Icon className="text-emerald-700" />
              <p className="mt-4 text-3xl font-bold text-stone-950">{stat.value}</p>
              <p className="mt-1 text-sm text-stone-600">{stat.label}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={addHotel} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-950">
            <Hotel size={20} />
            Add hotel
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(["name", "city", "country", "price_from"] as const).map((field) => (
              <input
                key={field}
                value={hotelForm[field]}
                onChange={(event) => setHotelForm({ ...hotelForm, [field]: event.target.value })}
                className="rounded-md border border-stone-300 px-3 py-3"
                placeholder={field.replace("_", " ")}
              />
            ))}
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white">
            <Save size={18} />
            {saving === "hotel" ? "Saving..." : "Save Hotel"}
          </button>
        </form>

        <form onSubmit={addRoom} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-950">
            <BedDouble size={20} />
            Add room
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select
              value={roomForm.hotel_id}
              onChange={(event) => setRoomForm({ ...roomForm, hotel_id: event.target.value })}
              className="rounded-md border border-stone-300 px-3 py-3"
            >
              {(data?.hotels || []).map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <input
              value={roomForm.name}
              onChange={(event) => setRoomForm({ ...roomForm, name: event.target.value })}
              className="rounded-md border border-stone-300 px-3 py-3"
              placeholder="Room name"
            />
            <input
              value={roomForm.room_number}
              onChange={(event) => setRoomForm({ ...roomForm, room_number: event.target.value })}
              className="rounded-md border border-stone-300 px-3 py-3"
              placeholder="Room number"
            />
            <input
              value={roomForm.price_per_night}
              onChange={(event) => setRoomForm({ ...roomForm, price_per_night: event.target.value })}
              className="rounded-md border border-stone-300 px-3 py-3"
              placeholder="Price"
            />
            <input
              value={roomForm.capacity}
              onChange={(event) => setRoomForm({ ...roomForm, capacity: event.target.value })}
              className="rounded-md border border-stone-300 px-3 py-3"
              placeholder="Capacity"
            />
            <select
              value={roomForm.status}
              onChange={(event) => setRoomForm({ ...roomForm, status: event.target.value })}
              className="rounded-md border border-stone-300 px-3 py-3"
            >
              {roomStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white">
            <Save size={18} />
            {saving === "room" ? "Saving..." : "Save Room"}
          </button>
        </form>
      </div>

      <section className="mt-8 rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-bold text-stone-950">Rooms</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-stone-100 text-stone-700">
              <tr>
                <th className="p-4">Room</th>
                <th className="p-4">Hotel</th>
                <th className="p-4">Price</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.rooms || []).map((room) => (
                <tr key={room.id} className="border-t border-stone-100">
                  <td className="p-4 font-semibold text-stone-800">{room.name}</td>
                  <td className="p-4 text-stone-700">{hotelById.get(room.hotel_id)?.name || "Hotel"}</td>
                  <td className="p-4 text-stone-700">{formatCurrency(Number(room.price_per_night))}</td>
                  <td className="p-4 text-stone-700">{room.capacity}</td>
                  <td className="p-4">
                    <select
                      value={room.status}
                      disabled={saving === room.id}
                      onChange={(event) => updateRoomStatus(room, event.target.value)}
                      className="rounded-md border border-stone-300 px-3 py-2"
                    >
                      {roomStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-bold text-stone-950">Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-stone-100 text-stone-700">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Guest</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.bookings || []).map((booking) => (
                <tr key={booking.id} className="border-t border-stone-100">
                  <td className="p-4 font-semibold text-stone-800">{booking.booking_reference}</td>
                  <td className="p-4 text-stone-700">
                    {booking.guest_full_name}
                    <span className="block text-stone-500">{booking.guest_email}</span>
                  </td>
                  <td className="p-4 text-stone-700">
                    {booking.check_in_date} to {booking.check_out_date}
                  </td>
                  <td className="p-4 text-stone-700">{formatCurrency(Number(booking.total_amount))}</td>
                  <td className="p-4">
                    <select
                      value={booking.status}
                      disabled={saving === booking.id}
                      onChange={(event) => updateBookingStatus(booking, event.target.value)}
                      className="rounded-md border border-stone-300 px-3 py-2"
                    >
                      {bookingStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-xl font-bold text-stone-950">Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-stone-100 text-stone-700">
              <tr>
                <th className="p-4">Gateway reference</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Paid at</th>
              </tr>
            </thead>
            <tbody>
              {(data?.payments || []).map((payment) => (
                <tr key={payment.id} className="border-t border-stone-100">
                  <td className="p-4 font-semibold text-stone-800">{payment.gateway_reference}</td>
                  <td className="p-4 text-stone-700">{formatCurrency(Number(payment.amount))}</td>
                  <td className="p-4 text-stone-700">{payment.status}</td>
                  <td className="p-4 text-stone-700">{payment.paid_at || "Not paid yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
