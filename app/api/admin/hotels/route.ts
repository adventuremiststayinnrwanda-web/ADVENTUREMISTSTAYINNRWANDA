import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/adminAuth";
import { supabaseRest, supabaseStorageUpload } from "@/lib/server/supabaseRest";

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    
    const contentType = request.headers.get("content-type") || "";
    let body: any = {};
    let images: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body.name = formData.get("name") as string;
      body.city = formData.get("city") as string;
      body.country = formData.get("country") as string;
      body.address = formData.get("address") as string;
      body.description = formData.get("description") as string;
      body.contact_email = formData.get("contact_email") as string;
      body.contact_phone = formData.get("contact_phone") as string;
      body.rating = formData.get("rating") as string;
      body.price_from = formData.get("price_from") as string;
      body.status = formData.get("status") as string;
      body.amenities = JSON.parse((formData.get("amenities") as string) || "[]");
      const allFiles = formData.getAll("images");
      images = allFiles.filter((f) => typeof f === "object" && (f as File).size > 0) as File[];
    } else {
      body = await request.json();
    }

    const hotelPayload: Record<string, any> = {
      name: body.name,
      city: body.city,
      country: body.country || "Rwanda",
      address: body.address,
      description: body.description,
      contact_email: body.contact_email,
      contact_phone: body.contact_phone,
      rating: Number(body.rating || 4.8),
      price_from: Number(body.price_from || 0),
      amenities: Array.isArray(body.amenities) ? `{${body.amenities.map((a: string) => `"${a.replace(/"/g, '\\"')}"`).join(',')}}` : '{}',
      status: body.status || "active"
    };

    let hotel = await supabaseRest<any[]>("hotels", {
      method: "POST",
      body: JSON.stringify(hotelPayload)
    }).catch(async (err: Error) => {
      if (err.message.includes('amenities') || err.message.includes('PGRST204') || err.message.includes('column')) {
        const { amenities: _drop, ...payloadWithoutAmenities } = hotelPayload;
        return supabaseRest<any[]>("hotels", { method: "POST", body: JSON.stringify(payloadWithoutAmenities) });
      }
      throw err;
    });

    if (hotel && hotel.length > 0 && images.length > 0) {
      await Promise.all(images.map(async (file, i) => {
        const fileBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `hotels/${hotel[0].id}/${Date.now()}_${i}.${ext}`;
        let publicUrl: string;
        try {
          publicUrl = await supabaseStorageUpload("hotel-images", filePath, fileBuffer, file.type);
        } catch (uploadErr) {
          throw new Error(`Image upload failed for ${file.name}: ${uploadErr instanceof Error ? uploadErr.message : uploadErr}`);
        }
        try {
          await supabaseRest("hotel_images", {
            method: "POST",
            body: JSON.stringify({ hotel_id: hotel[0].id, image_url: publicUrl, alt_text: body.name + " exterior " + (i + 1), sort_order: i + 1 })
          });
        } catch (dbErr) {
          console.warn(`[hotel_images insert] ${dbErr instanceof Error ? dbErr.message : dbErr}`);
        }
      }));
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ hotel: hotel?.[0] || hotel });
  } catch (error) {
    console.error("[Admin Hotels POST] Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save hotel." }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireAdmin(request);

    const contentType = request.headers.get("content-type") || "";
    let body: any = {};
    let images: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body.id = formData.get("id") as string;
      body.name = formData.get("name") as string;
      body.city = formData.get("city") as string;
      body.country = formData.get("country") as string;
      body.address = formData.get("address") as string;
      body.description = formData.get("description") as string;
      body.contact_email = formData.get("contact_email") as string;
      body.contact_phone = formData.get("contact_phone") as string;
      body.rating = formData.get("rating") as string;
      body.price_from = formData.get("price_from") as string;
      body.status = formData.get("status") as string;
      body.amenities = JSON.parse((formData.get("amenities") as string) || "[]");
      const allFiles = formData.getAll("images");
      images = allFiles.filter((f) => typeof f === "object" && (f as File).size > 0) as File[];
    } else {
      body = await request.json();
    }

    const patchPayload: Record<string, any> = {
      name: body.name,
      city: body.city,
      country: body.country,
      address: body.address,
      description: body.description,
      contact_email: body.contact_email,
      contact_phone: body.contact_phone,
      rating: Number(body.rating),
      price_from: Number(body.price_from),
      amenities: Array.isArray(body.amenities) ? `{${body.amenities.map((a: string) => `"${a.replace(/"/g, '\\"')}"`).join(',')}}` : undefined,
      status: body.status
    };
    Object.keys(patchPayload).forEach(k => patchPayload[k] === undefined && delete patchPayload[k]);

    let hotel = await supabaseRest<any[]>(`hotels?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify(patchPayload)
    }).catch(async (err: Error) => {
      if (err.message.includes('amenities') || err.message.includes('PGRST204') || err.message.includes('column')) {
        const { amenities: _drop, ...payloadWithoutAmenities } = patchPayload;
        return supabaseRest<any[]>(`hotels?id=eq.${encodeURIComponent(body.id)}`, { method: "PATCH", body: JSON.stringify(payloadWithoutAmenities) });
      }
      throw err;
    });

    // Handle new images if uploaded
    if (images.length > 0) {
      // Delete old hotel images from DB
      try {
        await supabaseRest(`hotel_images?hotel_id=eq.${encodeURIComponent(body.id)}`, { method: "DELETE" });
      } catch (_) {}

      await Promise.all(images.map(async (file, i) => {
        const fileBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `hotels/${body.id}/${Date.now()}_${i}.${ext}`;
        let publicUrl: string;
        try {
          publicUrl = await supabaseStorageUpload("hotel-images", filePath, fileBuffer, file.type);
        } catch (uploadErr) {
          throw new Error(`Image upload failed for ${file.name}: ${uploadErr instanceof Error ? uploadErr.message : uploadErr}`);
        }
        try {
          await supabaseRest("hotel_images", {
            method: "POST",
            body: JSON.stringify({ hotel_id: body.id, image_url: publicUrl, alt_text: body.name + " exterior " + (i + 1), sort_order: i + 1 })
          });
        } catch (dbErr) {
          console.warn(`[hotel_images insert] ${dbErr instanceof Error ? dbErr.message : dbErr}`);
        }
      }));
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ hotel: hotel?.[0] || hotel });
  } catch (error) {
    console.error("[Admin Hotels PATCH] Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update hotel." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Hotel ID is required." }, { status: 400 });

    // Delete associated hotel images from DB
    try {
      await supabaseRest(`hotel_images?hotel_id=eq.${encodeURIComponent(body.id)}`, { method: "DELETE" });
    } catch (_) {}

    await supabaseRest(`hotels?id=eq.${encodeURIComponent(body.id)}`, { method: "DELETE" });

    revalidatePath('/', 'layout');
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete hotel." }, { status: 400 });
  }
}
