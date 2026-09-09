import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    return null;
  }

  return new TextEncoder().encode(secret);
}

async function isAuthenticated(
  request: NextRequest
) {
  const token =
    request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const secret = getSecret();

  if (!secret) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    return (
      payload.role === "owner" &&
      typeof payload.email === "string" &&
      payload.email.toLowerCase() ===
        adminEmail
    );
  } catch {
    return false;
  }
}

export async function proxy(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  /*
   * ================================
   * ADMIN LOGIN
   * ================================
   *
   * Logged in:
   * /admin/login -> /admin
   *
   * Logged out:
   * /admin/login -> stay on login
   */
  if (pathname === "/admin/login") {
    const authenticated =
      await isAuthenticated(request);

    if (authenticated) {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ================================
   * ADMIN DASHBOARD
   * ================================
   *
   * No valid session:
   * /admin -> /admin/login
   *
   * Valid session:
   * /admin -> dashboard
   */
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    const authenticated =
      await isAuthenticated(request);

    if (!authenticated) {
      const loginUrl = new URL(
        "/admin/login",
        request.url
      );

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};