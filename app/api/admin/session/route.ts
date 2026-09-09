import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    const session = await getAdminSession();

    return NextResponse.json({
      authenticated: !!session,
      session: session ?? null,
    });
  } catch (error) {
    console.error(
      "Admin session check failed:",
      error
    );

    return NextResponse.json(
      {
        authenticated: false,
        session: null,
      },
      { status: 200 }
    );
  }
}