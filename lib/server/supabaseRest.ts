/**
 * supabaseRest.ts
 *
 * Drop-in replacement for raw PostgREST fetch calls.
 * Uses @supabase/supabase-js so that the new sb_secret_* key format works correctly.
 * The legacy supabaseRest(path, options) signature is preserved so all API routes
 * continue to work without changes.
 */

// Offset Date.now by 5 minutes to absorb any clock skew with Supabase servers
const _originalNow = Date.now;
Date.now = () => _originalNow() - 300000;

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase credentials. Ensure SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file."
    );
  }

  _adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _adminClient;
}

/** Reset the singleton so the next call gets a fresh client with a new JWT. */
function resetSupabaseAdmin() {
  _adminClient = null;
}

/** Returns true if the Supabase error is a JWT clock-skew error (PGRST303). */
function isClockSkewError(error: any): boolean {
  return (
    error?.code === "PGRST303" ||
    (typeof error?.message === "string" &&
      error.message.toLowerCase().includes("jwt issued at future"))
  );
}


// ---------------------------------------------------------------------------
// Path parser helpers
// ---------------------------------------------------------------------------

/** Parse a PostgREST path like "hotels?id=eq.abc&status=eq.active&order=created_at.desc" */
function parsePath(path: string): {
  table: string;
  selectColumns: string;
  filters: Array<{ col: string; op: string; val: string }>;
  order: { col: string; ascending: boolean } | null;
  limit: number | null;
} {
  const [tablePart, queryString] = path.split("?");
  const table = tablePart;
  let selectColumns = "*";
  const filters: Array<{ col: string; op: string; val: string }> = [];
  let order: { col: string; ascending: boolean } | null = null;
  let limit: number | null = null;

  if (queryString) {
    const params = new URLSearchParams(queryString);

    if (params.get("select")) selectColumns = params.get("select")!;

    for (const [key, value] of params.entries()) {
      if (key === "select" || key === "order" || key === "limit" || key === "offset") continue;
      const match = value.match(/^(eq|neq|lt|lte|gt|gte|like|ilike|is|in)\.(.+)$/);
      if (match) {
        filters.push({ col: key, op: match[1], val: match[2] });
      }
    }

    const orderParam = params.get("order");
    if (orderParam) {
      const [col, dir] = orderParam.split(".");
      order = { col, ascending: dir !== "desc" };
    }

    const limitParam = params.get("limit");
    if (limitParam) limit = parseInt(limitParam, 10);
  }

  return { table, selectColumns, filters, order, limit };
}

/** Apply PostgREST-style filters to any Supabase query builder */
function applyFilters(query: any, filters: Array<{ col: string; op: string; val: string }>) {
  for (const { col, op, val } of filters) {
    switch (op) {
      case "eq":    query = query.eq(col, val); break;
      case "neq":   query = query.neq(col, val); break;
      case "lt":    query = query.lt(col, val); break;
      case "lte":   query = query.lte(col, val); break;
      case "gt":    query = query.gt(col, val); break;
      case "gte":   query = query.gte(col, val); break;
      case "like":  query = query.like(col, val); break;
      case "ilike": query = query.ilike(col, val); break;
      case "is":    query = query.is(col, val === "null" ? null : val); break;
      case "in":    query = query.in(col, val.replace(/^\(|\)$/g, "").split(",")); break;
    }
  }
  return query;
}

// ---------------------------------------------------------------------------
// Main compat shim — same signature as before
// ---------------------------------------------------------------------------

type SupabaseRestOptions = RequestInit & {
  headers?: Record<string, string>;
};

export async function supabaseRest<T = unknown>(
  path: string,
  options: SupabaseRestOptions = {}
): Promise<T> {
  const client = getSupabaseAdmin();
  const method = (options.method || "GET").toUpperCase();
  const { table, selectColumns, filters, order, limit } = parsePath(path);

  // ── GET ─────────────────────────────────────────────────────────────────
  if (method === "GET") {
    let query = client.from(table).select(selectColumns);
    query = applyFilters(query, filters);
    if (order) query = query.order(order.col, { ascending: order.ascending });
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw new Error(JSON.stringify(error));
    return (data ?? []) as T;
  }

  // ── POST (insert) ────────────────────────────────────────────────────────
  if (method === "POST") {
    const payload = options.body ? JSON.parse(options.body as string) : {};
    const { data, error } = await client
      .from(table)
      .insert(payload)
      .select();
    if (error) throw new Error(JSON.stringify(error));
    return (data ?? []) as T;
  }

  // ── PATCH (update) ───────────────────────────────────────────────────────
  if (method === "PATCH") {
    const payload = options.body ? JSON.parse(options.body as string) : {};
    let query = client.from(table).update(payload);
    query = applyFilters(query as any, filters);
    const { data, error } = await (query as any).select();
    if (error) throw new Error(JSON.stringify(error));
    return (data ?? []) as T;
  }

  // ── DELETE ───────────────────────────────────────────────────────────────
  if (method === "DELETE") {
    let query = client.from(table).delete();
    query = applyFilters(query as any, filters);
    const { data, error } = await (query as any).select();
    if (error) throw new Error(JSON.stringify(error));
    return (data ?? []) as T;
  }

  throw new Error(`Unsupported method: ${method}`);
}

// ---------------------------------------------------------------------------
// Storage upload via direct REST API (works with any Supabase key format)
// ---------------------------------------------------------------------------

export async function supabaseStorageUpload(
  bucket: string,
  filePath: string,
  fileBuffer: ArrayBuffer,
  mimeType: string
): Promise<string> {
  // Use whichever URL/key is available
  const url = supabaseUrl;
  // Prefer service role key, fall back to publishable key
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!url || !key) {
    throw new Error("Missing Supabase credentials for storage upload.");
  }

  const uploadUrl = `${url}/storage/v1/object/${bucket}/${filePath}`;

  // Try upload
  let res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": mimeType,
      "x-upsert": "true",
    },
    body: fileBuffer,
  });

  // If bucket doesn't exist (404) or forbidden (400/403), create bucket first then retry
  if (!res.ok && (res.status === 404 || res.status === 400 || res.status === 403)) {
    // Attempt to create the bucket
    const createBucketRes = await fetch(`${url}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: bucket, name: bucket, public: true }),
    });

    // Ignore error if bucket already exists (409 conflict is fine)
    if (!createBucketRes.ok && createBucketRes.status !== 409) {
      const bucketErr = await createBucketRes.text();
      console.warn("Could not create bucket:", bucketErr);
    }

    // Retry upload
    res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        "Content-Type": mimeType,
        "x-upsert": "true",
      },
      body: fileBuffer,
    });
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Storage upload failed (${res.status}): ${errText}`);
  }

  // Return the public URL
  return `${url}/storage/v1/object/public/${bucket}/${filePath}`;
}

