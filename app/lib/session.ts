import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { db } from "@shoestore/db";

const COOKIE_NAME = "authToken";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

/** Emails allowed into the backoffice. No DB roles — just an env allowlist. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminEmails();
  // If no allowlist is configured, any authenticated user counts as admin.
  return list.length === 0 || list.includes(email.toLowerCase());
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);

    const userId = (payload.id || payload.userId) as string;
    if (!userId) return null;

    const user = await db.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: { id: true, name: true, email: true },
    });

    if (!user) return null;
    return { id: user.id, name: user.name, email: user.email };
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") throw error;
    return null;
  }
}

/** Returns the current user only if they're allowed into the backoffice. */
export async function getAdminUser(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export async function setAuthCookie(userId: string, email: string): Promise<void> {
  const secret = getSecret();
  const token = await new SignJWT({ id: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
