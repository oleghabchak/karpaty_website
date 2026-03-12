import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin-news-session";
const COOKIE_SALT = "karpaty-news-admin";

function hashSecret(secret: string) {
  return createHash("sha256").update(`${secret}:${COOKIE_SALT}`).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminSecret() {
  return process.env.ADMIN_NEWS_SECRET || process.env.ADMIN_SECRET || "";
}

export async function isAdminAuthenticated() {
  const secret = getAdminSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return safeEqual(session, hashSecret(secret));
}

export async function createAdminSession() {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error("ADMIN_NEWS_SECRET is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, hashSecret(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
