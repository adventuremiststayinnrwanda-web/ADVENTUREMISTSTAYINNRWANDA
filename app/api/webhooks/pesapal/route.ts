export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { reconcilePesapalPayment } from "@/lib/server/reconcilePesapalPayment";

type PesapalIpnPayload = {
  OrderTrackingId?: string;
  OrderMerchantReference?: string;
};

async function getPostPayload(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as PesapalIpnPayload;
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    return {
      OrderTrackingId: String(formData.get("OrderTrackingId") || ""),
      OrderMerchantReference: String(formData.get("OrderMerchantReference") || "")
    };
  }

  return {};
}

async function handleIpn(orderTrackingId: string | null, reference: string | null) {
  if (!orderTrackingId || !reference) {
    return NextResponse.json({ status: 500, message: "Missing Pesapal IPN parameters." });
  }

  try {
    await reconcilePesapalPayment(orderTrackingId, reference);
    return NextResponse.json({
      orderNotificationType: "IPNCHANGE",
      orderTrackingId,
      orderMerchantReference: reference,
      status: 200
    });
  } catch (error) {
    return NextResponse.json({
      orderNotificationType: "IPNCHANGE",
      orderTrackingId,
      orderMerchantReference: reference,
      status: 500,
      message: error instanceof Error ? error.message : "IPN processing failed."
    });
  }
}

export async function POST(request: NextRequest) {
  const body = await getPostPayload(request);

  return handleIpn(body.OrderTrackingId || null, body.OrderMerchantReference || null);
}

export async function GET(request: NextRequest) {
  return handleIpn(
    request.nextUrl.searchParams.get("OrderTrackingId"),
    request.nextUrl.searchParams.get("OrderMerchantReference")
  );
}
