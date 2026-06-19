import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Refund & Cancellation Policy | Adventure Mist Stay Inn Rwanda",
  description: "Read the Refund & Cancellation Policy for Adventure Mist Stay Inn Rwanda before confirming your reservation.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <article className="prose prose-stone mx-auto">
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Refund & Cancellation Policy
            </h1>
            <p className="mt-6 text-base leading-7 text-stone-600">
              At Adventure Mist Stay Inn Rwanda, we strive to provide our guests with a comfortable and enjoyable stay. By making a reservation through our website, you agree to the following refund and cancellation terms.
            </p>

            <div className="mt-10 space-y-10">
              {/* Section 1 */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                  1. Cancellation Policy
                </h2>
                <p className="mt-3 text-stone-600">
                  Guests who wish to cancel their reservation must submit a written cancellation request via email or through our official communication channels.
                </p>

                <div className="mt-6 space-y-6 border-l-2 border-emerald-600 pl-4">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">More than 30 Days Before Arrival</h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-stone-600">
                      <li>Cancellations made more than thirty (30) days before the scheduled arrival date are eligible for a full refund.</li>
                      <li>Any bank charges, payment gateway fees, or transaction costs incurred during the refund process may be deducted from the refunded amount.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-stone-900">15–30 Days Before Arrival</h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-stone-600">
                      <li>Cancellations made between fifteen (15) and thirty (30) days before the scheduled arrival date will incur a cancellation fee equal to fifty percent (50%) of the total booking amount.</li>
                      <li>The remaining balance will be refunded to the guest.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-stone-900">14 Days or Less Before Arrival</h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-stone-600">
                      <li>Cancellations made within fourteen (14) days of the scheduled arrival date are non-refundable.</li>
                      <li>No refunds will be provided for no-shows, unused nights, or early departures.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                  2. Refund Processing
                </h2>
                <ul className="mt-3 list-disc list-inside space-y-2 text-stone-600">
                  <li>Approved refunds will be processed using the original payment method used for the reservation.</li>
                  <li>Refund processing times may vary depending on the payment provider, bank, or financial institution.</li>
                  <li>Adventure Mist Stay Inn Rwanda is not responsible for delays caused by third-party payment providers or banking institutions.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                  3. Reservation Modifications
                </h2>
                <p className="mt-3 text-stone-600">
                  Requests to change reservation dates or guest details are subject to availability and approval by management. Additional charges may apply depending on the nature of the modification.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                  4. Force Majeure
                </h2>
                <p className="mt-3 text-stone-600">
                  Adventure Mist Stay Inn Rwanda shall not be held liable for cancellations or disruptions caused by events beyond our reasonable control, including but not limited to natural disasters, government restrictions, pandemics, civil disturbances, or transportation interruptions.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-2">
                  5. Contact Information
                </h2>
                <p className="mt-3 text-stone-600">
                  For all cancellation, refund, or booking-related inquiries, please contact Adventure Mist Stay Inn Rwanda through our official website or customer support channels.
                </p>
              </section>
            </div>

            <div className="mt-10 border-t border-stone-200 pt-6 text-sm text-stone-500 text-center">
              By confirming a reservation, guests acknowledge that they have read, understood, and agreed to this Refund & Cancellation Policy.
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
