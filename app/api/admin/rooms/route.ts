import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const room = await supabaseRest("rooms", {
      method: "POST",
      body: JSON.stringify({
        hotel_id: body.hotel_id,
        name: body.name,
        room_number: body.room_number,
        description: body.description,
        price_per_night: Number(body.price_per_night || 0),
        capacity: Number(body.capacity || 1),
        bed_type: body.bed_type,
        room_size: body.room_size,
        status: body.status || "available"
      })
    });

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save room." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const room = await supabaseRest(`rooms?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: body.name,
        room_number: body.room_number,
        description: body.description,
        price_per_night: Number(body.price_per_night),
        capacity: Number(body.capacity),
        bed_type: body.bed_type,
        room_size: body.room_size,
        status: body.status
      })
    });

    return NextResponse.json({ room });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update room." },
      { status: 400 }
    );
  }
}
