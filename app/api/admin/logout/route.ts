import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  const cookiesToClear = [
    "admin_session",
    "adminToken",
    "auth-token",
    "session",
  ];

  cookiesToClear.forEach((name) => {
    response.cookies.set(name, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
  });

  return response;
}