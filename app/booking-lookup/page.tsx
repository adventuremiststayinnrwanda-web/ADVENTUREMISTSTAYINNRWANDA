import { Mail, ReceiptText } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function BookingLookupPage() {
  return (
    <>
      <Header />
      <main className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full max-w-xl rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="font-semibold text-emerald-800">My Booking</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-950">Find your booking</h1>
          <p className="mt-3 text-stone-600">
            Customers can view bookings without registering. Use the email and booking
            reference from the confirmation email.
          </p>
          <form className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Email</span>
              <span className="flex items-center gap-3 rounded-md border border-stone-300 px-3 py-3">
                <Mail className="text-emerald-700" size={18} />
                <input type="email" className="w-full outline-none" placeholder="you@example.com" />
              </span>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-stone-800">Booking reference</span>
              <span className="flex items-center gap-3 rounded-md border border-stone-300 px-3 py-3">
                <ReceiptText className="text-emerald-700" size={18} />
                <input className="w-full outline-none" placeholder="SE-2026-00124" />
              </span>
            </label>
            <button className="rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white">
              View Booking
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
