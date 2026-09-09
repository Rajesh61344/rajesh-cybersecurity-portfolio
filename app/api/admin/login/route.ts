import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          error:
            "Admin authentication is not configured.",
        },
        { status: 500 }
      );
    }

    if (
      email !== adminEmail ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        {
          error: "Invalid admin credentials.",
        },
        { status: 401 }
      );
    }

    await createAdminSession();

    return NextResponse.json({
      success: true,
      message: "Admin login successful.",
    });
  } catch (error) {
    console.error(
      "POST /api/admin/login error:",
      error
    );

    return NextResponse.json(
      {
        error: "Login failed.",
      },
      { status: 500 }
    );
  }
}