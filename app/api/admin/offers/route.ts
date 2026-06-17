import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    const offers = await supabaseRest<any[]>("offers?select=*&order=created_at.desc");
    return NextResponse.json({ offers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch offers." },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    // Validation
    if (!body.title || !body.discount_type || body.discount_value === undefined) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const payload = {
      hotel_id: body.hotel_id || null,
      room_id: body.room_id || null,
      title: body.title,
      description: body.description || null,
      discount_type: body.discount_type,
      discount_value: Number(body.discount_value),
      valid_from: body.valid_from || null,
      valid_until: body.valid_until || null,
      status: body.status || "active"
    };

    const offer = await supabaseRest("offers", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ offer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create offer." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Offer ID is required." }, { status: 400 });
    }

    const payload: Record<string, any> = {};
    if (body.hotel_id !== undefined) payload.hotel_id = body.hotel_id || null;
    if (body.room_id !== undefined) payload.room_id = body.room_id || null;
    if (body.title !== undefined) payload.title = body.title;
    if (body.description !== undefined) payload.description = body.description || null;
    if (body.discount_type !== undefined) payload.discount_type = body.discount_type;
    if (body.discount_value !== undefined) payload.discount_value = Number(body.discount_value);
    if (body.valid_from !== undefined) payload.valid_from = body.valid_from || null;
    if (body.valid_until !== undefined) payload.valid_until = body.valid_until || null;
    if (body.status !== undefined) payload.status = body.status;

    const offer = await supabaseRest(`offers?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ offer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update offer." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Offer ID is required." }, { status: 400 });
    }

    await supabaseRest(`offers?id=eq.${encodeURIComponent(body.id)}`, {
      method: "DELETE"
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete offer." },
      { status: 400 }
    );
  }
}
