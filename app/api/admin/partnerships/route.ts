import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest } from "@/lib/server/supabaseRest";

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    const partnership = await supabaseRest<any[]>("partnerships", {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        logo_url: body.logo_url,
        status: body.status || "active"
      })
    });

    return NextResponse.json({ partnership: partnership?.[0] || partnership });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save partnership." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Partnership ID is required." }, { status: 400 });
    }

    await supabaseRest(`partnerships?id=eq.${encodeURIComponent(body.id)}`, {
      method: "DELETE"
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete partnership." },
      { status: 400 }
    );
  }
}
