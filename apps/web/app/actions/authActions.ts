"use server";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const COOKIE_NAME = "authToken";
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

export type AuthUser = {
  id: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "NORMAL_USER";
  userType: "INDIVIDUAL" | "RESTAURANT";
  name: string;
};

/**
 * Get the currently authenticated user from the JWT cookie.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AuthUser;
  } catch {
    cookiesStore.delete(COOKIE_NAME);
    return null;
  }
}

/**
 * Refresh the JWT token with a new expiration.
 */
export async function refreshToken(): Promise<AuthUser | null> {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);

    const user: AuthUser = {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as AuthUser["role"],
      userType: payload.userType as AuthUser["userType"],
      name: payload.name as string,
    };

    const newToken = await new SignJWT({ ...user })
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
      maxAge: 60 * 60 * 24 * 7,
    });

    return user;
  } catch (error) {
    console.error("Token refresh failed:", error);
    cookiesStore.delete(COOKIE_NAME);
    return null;
  }
}

/**
 * Sign out the current user.
 */
export async function signOutAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete(COOKIE_NAME);
}
