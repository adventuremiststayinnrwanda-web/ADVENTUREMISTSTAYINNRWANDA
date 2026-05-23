import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const hotel = await supabaseRest("hotels", {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        city: body.city,
        country: body.country || "Rwanda",
        address: body.address,
        description: body.description,
        contact_email: body.contact_email,
        contact_phone: body.contact_phone,
        rating: Number(body.rating || 4.8),
        price_from: Number(body.price_from || 0),
        status: body.status || "active"
      })
    });

    return NextResponse.json({ hotel });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save hotel." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const hotel = await supabaseRest(`hotels?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: body.name,
        city: body.city,
        country: body.country,
        address: body.address,
        description: body.description,
        contact_email: body.contact_email,
        contact_phone: body.contact_phone,
        rating: Number(body.rating),
        price_from: Number(body.price_from),
        status: body.status
      })
    });

    return NextResponse.json({ hotel });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update hotel." },
      { status: 400 }
    );
  }
}
