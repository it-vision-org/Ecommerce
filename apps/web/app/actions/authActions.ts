"use server";

import { cookies } from "next/headers";
import { db } from "@monkeyprint/db";
import { jwtVerify, SignJWT } from "jose";

const COOKIE_NAME = "authToken"; // Changed from "auth-token" to match login API

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  userType: string | null;
};

/**
 * Get the currently authenticated user from the JWT cookie.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value; // Use COOKIE_NAME constant

    if (!token) {
      return null;
    }

    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);

    // The login API stores these fields directly in the JWT payload
    const userId = (payload.id || payload.userId) as string;

    if (!userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userType: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      userType: user.userType,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
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
      id: (payload.id || payload.userId) as string,
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
