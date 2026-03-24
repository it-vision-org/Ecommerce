"use server";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

// Shared constants — single source of truth for cookie name and secret
const COOKIE_NAME = "authToken";
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
  userType?: string;
};

/**
 * Get the currently authenticated user from the JWT cookie.
 * Use this in server components & server actions.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AuthUser;
  } catch {
    // Token is invalid or expired — clear it
    cookiesStore.delete(COOKIE_NAME);
    return null;
  }
}

/**
 * Refresh the JWT token with a new expiration.
 * Call this periodically (e.g., on page load) to keep the session alive.
 */
export async function refreshToken(): Promise<AuthUser | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);

    const newToken = await new SignJWT({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      userType: payload.userType,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    cookiesStore.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return payload as AuthUser;
  } catch (error) {
    console.error("Token refresh failed:", error);
    cookiesStore.delete(COOKIE_NAME);
    return null;
  }
}

/**
 * Sign out the current user by clearing the auth cookie.
 */
export async function signOutAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete(COOKIE_NAME);
}
