import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  const results: Record<string, any> = {
    supabaseUrl: url,
    keyType: key.startsWith("eyJ") ? "Valid JWT (service role)" : key.startsWith("sb_") ? "Publishable/anon key (NOT service role)" : "Unknown",
    keyPrefix: key.substring(0, 20) + "...",
  };

  // Test 1: Check if we can list buckets
  try {
    const res = await fetch(`${url}/storage/v1/bucket`, {
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
      },
    });
    const text = await res.text();
    results.listBuckets = { status: res.status, body: text.substring(0, 300) };
  } catch (e) {
    results.listBuckets = { error: String(e) };
  }

  // Test 2: Try creating the hotel-images bucket
  try {
    const res = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "hotel-images", name: "hotel-images", public: true }),
    });
    const text = await res.text();
    results.createBucket = { status: res.status, body: text.substring(0, 300) };
  } catch (e) {
    results.createBucket = { error: String(e) };
  }

  // Test 3: Try uploading a tiny test file
  const testContent = new TextEncoder().encode("test").buffer;
  try {
    const res = await fetch(`${url}/storage/v1/object/hotel-images/test/test.txt`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "text/plain",
        "x-upsert": "true",
      },
      body: testContent,
    });
    const text = await res.text();
    results.testUpload = { status: res.status, body: text.substring(0, 300) };
  } catch (e) {
    results.testUpload = { error: String(e) };
  }

  return NextResponse.json(results, { status: 200 });
}
