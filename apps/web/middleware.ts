import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "authToken";
const JWT_SECRET = process.env.JWT_SECRET;

const publicPaths = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgetPassword",
  "/auth/resetPassword",
  "/",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/forgetPassword",
  "/api/auth/resetPassword",
];

const authOnlyPaths = ["/auth/login", "/auth/signup"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  const isAuthOnlyPath = authOnlyPaths.some((path) => pathname.startsWith(path));

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const secretValue = JWT_SECRET;
    if (!secretValue) {
      console.error("JWT_SECRET is not set for middleware");
      return NextResponse.next();
    }

    try {
      const secret = new TextEncoder().encode(secretValue);
      await jwtVerify(token, secret);

      if (isAuthOnlyPath) {
        return NextResponse.redirect(new URL("/", request.url)); 
      }
    } catch {
      const response = isPublicPath
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/auth/login", request.url));

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};