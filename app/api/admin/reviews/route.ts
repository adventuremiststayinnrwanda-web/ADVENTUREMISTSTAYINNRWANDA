import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Review ID and status are required." }, { status: 400 });
    }

    if (!["pending", "published", "hidden"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const review = await supabaseRest(`reviews?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status: body.status })
    });

    return NextResponse.json({ review });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update review." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    await supabaseRest(`reviews?id=eq.${encodeURIComponent(body.id)}`, {
      method: "DELETE"
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete review." },
      { status: 400 }
    );
  }
}
