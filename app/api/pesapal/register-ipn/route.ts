import { NextRequest, NextResponse } from "next/server";
import { getRegisteredPesapalIpns, registerPesapalIpnUrl } from "@/lib/server/pesapal";

function publicBaseUrl(request: NextRequest) {
  return (
    process.env.PESAPAL_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin
  ).replace(/\/$/, "");
}

function defaultIpnUrl(request: NextRequest) {
  return `${publicBaseUrl(request)}/api/webhooks/pesapal`;
}

export async function GET() {
  try {
    const ipns = await getRegisteredPesapalIpns();
    return NextResponse.json({ ipns });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch Pesapal IPNs." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = body.url || defaultIpnUrl(request);

    if (!url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Pesapal IPN URL must be a public HTTPS URL." },
        { status: 400 }
      );
    }

    const ipn = await registerPesapalIpnUrl(url, body.notification_type === "POST" ? "POST" : "GET");

    return NextResponse.json({
      ipn,
      message: `Add PESAPAL_IPN_ID=${ipn.ipn_id} to .env.local`
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register Pesapal IPN." },
      { status: 500 }
    );
  }
}
