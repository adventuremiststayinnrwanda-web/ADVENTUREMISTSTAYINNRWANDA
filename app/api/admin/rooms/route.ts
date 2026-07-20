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
      body.hotel_id = formData.get("hotel_id") as string;
      body.name = formData.get("name") as string;
      body.room_number = formData.get("room_number") as string;
      body.description = formData.get("description") as string;
      body.price_per_night = formData.get("price_per_night") as string;
      body.capacity = formData.get("capacity") as string;
      body.bed_type = formData.get("bed_type") as string;
      body.room_size = formData.get("room_size") as string;
      body.status = formData.get("status") as string;
      body.amenities = JSON.parse((formData.get("amenities") as string) || "[]");
      
      const allFiles = formData.getAll("images");
      images = allFiles.filter((f) => typeof f === "object" && (f as File).size > 0) as File[];
    } else {
      body = await request.json();
    }

    const roomPayload: Record<string, any> = {
      hotel_id: body.hotel_id,
      name: body.name,
      room_number: body.room_number,
      description: body.description,
      price_per_night: Number(body.price_per_night || 0),
      capacity: Number(body.capacity || 1),
      bed_type: body.bed_type,
      room_size: body.room_size,
      amenities: Array.isArray(body.amenities) ? `{${body.amenities.map((a: string) => `"${a.replace(/"/g, '\\"')}"`).join(',')}}` : '{}',
      status: body.status || "available"
    };

    let room = await supabaseRest<any[]>("rooms", {
      method: "POST",
      body: JSON.stringify(roomPayload)
    }).catch(async (err: Error) => {
      // If amenities column doesn't exist, retry without it
      if (err.message.includes('amenities') || err.message.includes('PGRST204') || err.message.includes('column')) {
        const { amenities: _drop, ...payloadWithoutAmenities } = roomPayload;
        return supabaseRest<any[]>("rooms", {
          method: "POST",
          body: JSON.stringify(payloadWithoutAmenities)
        });
      }
      throw err;
    });

    if (room && room.length > 0) {
      if (images.length > 0) {
        await Promise.all(images.map(async (file, i) => {
          const fileBuffer = await file.arrayBuffer();
          const ext = file.name.split('.').pop() || 'jpg';
          const filePath = `rooms/${room[0].id}/${Date.now()}_${i}.${ext}`;
          
          let publicUrl: string;
          try {
            publicUrl = await supabaseStorageUpload("hotel-images", filePath, fileBuffer, file.type);
          } catch (uploadErr) {
            throw new Error(`Image upload failed for file ${file.name}: ${uploadErr instanceof Error ? uploadErr.message : uploadErr}`);
          }

          try {
            await supabaseRest("room_images", {
              method: "POST",
              body: JSON.stringify({
                room_id: room[0].id,
                image_url: publicUrl,
                alt_text: body.name + " image " + (i + 1),
                sort_order: i + 1
              })
            });
          } catch (dbErr) {
            // room_images table may not exist — log and continue (image is already uploaded)
            console.warn(`[room_images insert] ${dbErr instanceof Error ? dbErr.message : dbErr}`);
          }
        }));
      } else if (Array.isArray(body.images) && body.images.length > 0) {
        for (let i = 0; i < body.images.length; i++) {
          if (!body.images[i]) continue;
          await supabaseRest("room_images", {
            method: "POST",
            body: JSON.stringify({
              room_id: room[0].id,
              image_url: body.images[i],
              alt_text: body.name + " image " + (i + 1),
              sort_order: i + 1
            })
          });
        }
      }
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ room: room?.[0] || room });
  } catch (error) {
    console.error("[Admin Rooms POST] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save room." },
      { status: 400 }
    );
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
      body.room_number = formData.get("room_number") as string;
      body.description = formData.get("description") as string;
      body.price_per_night = formData.get("price_per_night") as string;
      body.capacity = formData.get("capacity") as string;
      body.bed_type = formData.get("bed_type") as string;
      body.room_size = formData.get("room_size") as string;
      body.status = formData.get("status") as string;
      body.amenities = JSON.parse((formData.get("amenities") as string) || "[]");
      
      const allFiles = formData.getAll("images");
      images = allFiles.filter((f) => typeof f === "object" && (f as File).size > 0) as File[];
    } else {
      body = await request.json();
    }

    const patchPayload: Record<string, any> = {};
    if (body.name !== undefined) patchPayload.name = body.name;
    if (body.room_number !== undefined) patchPayload.room_number = body.room_number;
    if (body.description !== undefined) patchPayload.description = body.description;
    if (body.price_per_night !== undefined) patchPayload.price_per_night = Number(body.price_per_night);
    if (body.capacity !== undefined) patchPayload.capacity = Number(body.capacity);
    if (body.bed_type !== undefined) patchPayload.bed_type = body.bed_type;
    if (body.room_size !== undefined) patchPayload.room_size = body.room_size;
    if (body.status !== undefined) patchPayload.status = body.status;
    if (body.amenities !== undefined) {
      patchPayload.amenities = Array.isArray(body.amenities) ? `{${body.amenities.map((a: string) => `"${a.replace(/"/g, '\\"')}"`).join(',')}}` : undefined;
    }

    // Remove undefined values if any
    Object.keys(patchPayload).forEach(k => patchPayload[k] === undefined && delete patchPayload[k]);

    let room = await supabaseRest<any[]>(`rooms?id=eq.${encodeURIComponent(body.id)}`, {
      method: "PATCH",
      body: JSON.stringify(patchPayload)
    }).catch(async (err: Error) => {
      if (err.message.includes('amenities') || err.message.includes('PGRST204') || err.message.includes('column')) {
        const { amenities: _drop, ...payloadWithoutAmenities } = patchPayload;
        return supabaseRest<any[]>(`rooms?id=eq.${encodeURIComponent(body.id)}`, {
          method: "PATCH",
          body: JSON.stringify(payloadWithoutAmenities)
        });
      }
      throw err;
    });

    if (room && room.length > 0 && images.length > 0) {
      // Delete old room images
      await supabaseRest(`room_images?room_id=eq.${encodeURIComponent(body.id)}`, {
        method: "DELETE"
      });

      // Upload new images
      await Promise.all(images.map(async (file, i) => {
        const fileBuffer = await file.arrayBuffer();
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `rooms/${body.id}/${Date.now()}_${i}.${ext}`;
        
        const publicUrl = await supabaseStorageUpload("hotel-images", filePath, fileBuffer, file.type);
        
        await supabaseRest("room_images", {
          method: "POST",
          body: JSON.stringify({
            room_id: body.id,
            image_url: publicUrl,
            alt_text: body.name + " image " + (i + 1),
            sort_order: i + 1
          })
        });
      }));
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ room: room?.[0] || room });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update room." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Room ID is required." }, { status: 400 });
    }

    const roomIdEscaped = encodeURIComponent(body.id);

    // 1. Fetch all bookings for this room
    const bookings = await supabaseRest<Array<{ id: string }>>(`bookings?room_id=eq.${roomIdEscaped}&select=id`).catch(() => []);

    if (Array.isArray(bookings) && bookings.length > 0) {
      const bookingIds = bookings.map(b => b.id);
      
      // Delete child records for each booking (payments and reviews)
      for (const bookingId of bookingIds) {
        const bookingIdEscaped = encodeURIComponent(bookingId);
        
        await supabaseRest(`reviews?booking_id=eq.${bookingIdEscaped}`, {
          method: "DELETE"
        }).catch(() => {});

        await supabaseRest(`payments?booking_id=eq.${bookingIdEscaped}`, {
          method: "DELETE"
        }).catch(() => {});
      }

      // Delete the bookings themselves
      await supabaseRest(`bookings?room_id=eq.${roomIdEscaped}`, {
        method: "DELETE"
      });
    }

    // 2. Delete room-specific offers
    await supabaseRest(`offers?room_id=eq.${roomIdEscaped}`, {
      method: "DELETE"
    }).catch(() => {});

    // 3. Delete room images
    await supabaseRest(`room_images?room_id=eq.${roomIdEscaped}`, {
      method: "DELETE"
    }).catch(() => {});

    // 4. Delete the room itself
    await supabaseRest(`rooms?id=eq.${roomIdEscaped}`, {
      method: "DELETE"
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete room." },
      { status: 400 }
    );
  }
}
