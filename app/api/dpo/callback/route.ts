import { NextRequest, NextResponse } from "next/server";
import { reconcileDpoPayment } from "@/lib/server/reconcileDpoPayment";

export async function GET(request: NextRequest) {
  const transactionToken =
    request.nextUrl.searchParams.get("TransactionToken") ||
    request.nextUrl.searchParams.get("transactionToken") ||
    request.nextUrl.searchParams.get("ID");
    
  const reference =
    request.nextUrl.searchParams.get("CompanyRef") ||
    request.nextUrl.searchParams.get("companyRef");

  if (!transactionToken || !reference) {
    console.error("DPO callback received missing parameters:", { transactionToken, reference });
    return NextResponse.redirect(new URL("/booking-lookup?payment=missing", request.url));
  }

  try {
    const paymentStatus = await reconcileDpoPayment(transactionToken, reference);
    return NextResponse.redirect(
      new URL(
        `/booking-lookup?reference=${encodeURIComponent(reference)}&payment=${paymentStatus}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Error reconciling DPO payment in callback:", error);
    return NextResponse.redirect(
      new URL(
        `/booking-lookup?reference=${encodeURIComponent(reference)}&payment=error`,
        request.url
      )
    );
  }
}
