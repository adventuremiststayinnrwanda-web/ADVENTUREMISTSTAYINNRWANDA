import { BedDouble, CalendarCheck, CreditCard, Hotel, TrendingUp } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const stats = [
  { label: "Total bookings", value: "128", icon: CalendarCheck },
  { label: "Revenue", value: "R184k", icon: CreditCard },
  { label: "Available rooms", value: "42", icon: BedDouble },
  { label: "Occupancy", value: "76%", icon: TrendingUp }
];

const bookings = [
  ["Maya Dlamini", "Aurora Grand Hotel", "Deluxe Ocean Room", "Confirmed", "R3,266"],
  ["Theo Jacobs", "Garden Court Luxe", "Garden King Room", "Pending payment", "R2,875"],
  ["Amina Khan", "Harbor Atelier", "Classic Queen Room", "Checked in", "R2,254"]
];

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-emerald-800">Admin dashboard</p>
            <h1 className="mt-2 text-4xl font-bold text-stone-950">Hotel management overview</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white">
            <Hotel size={18} />
            Add Hotel
          </button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {stats.map((stat) => {
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
        <section className="mt-8 rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 p-5">
            <h2 className="text-xl font-bold text-stone-950">Recent bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Hotel</th>
                  <th className="p-4">Room</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.join("-")} className="border-t border-stone-100">
                    {booking.map((item) => (
                      <td key={item} className="p-4 text-stone-700">
                        {item}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
