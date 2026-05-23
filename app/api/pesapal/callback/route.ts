import { NextRequest, NextResponse } from "next/server";
import { reconcilePesapalPayment } from "@/lib/server/reconcilePesapalPayment";

export async function GET(request: NextRequest) {
  const orderTrackingId = request.nextUrl.searchParams.get("OrderTrackingId");
  const reference = request.nextUrl.searchParams.get("OrderMerchantReference");

  if (!orderTrackingId || !reference) {
    return NextResponse.redirect(new URL("/booking-lookup?payment=missing", request.url));
  }

  try {
    const payment = await reconcilePesapalPayment(orderTrackingId, reference);
    return NextResponse.redirect(
      new URL(`/booking-lookup?reference=${encodeURIComponent(reference)}&payment=${payment}`, request.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/booking-lookup?reference=${encodeURIComponent(reference)}&payment=error`, request.url)
    );
  }
}
