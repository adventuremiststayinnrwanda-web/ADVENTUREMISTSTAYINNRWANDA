import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const cookieName = "adventure_admin_session";

function adminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.PESAPAL_CONSUMER_SECRET || "dev-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", adminSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "adventuremiststayinnrwanda@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return false;
  }

  return safeEqual(email.trim().toLowerCase(), adminEmail.toLowerCase()) && safeEqual(password, adminPassword);
}

export function createAdminSession(email: string) {
  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      expires: Date.now() + 1000 * 60 * 60 * 12
    })
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function readAdminSession(request: NextRequest) {
  const session = request.cookies.get(cookieName)?.value;

  if (!session) {
    return null;
  }

  const [payload, signature] = session.split(".");

  if (!payload || !signature || !safeEqual(signature, sign(payload))) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email: string;
      expires: number;
    };

    if (Date.now() > data.expires) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function requireAdmin(request: NextRequest) {
  const session = readAdminSession(request);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export function setAdminCookie(response: NextResponse, session: string) {
  response.cookies.set(cookieName, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0
  });
}
