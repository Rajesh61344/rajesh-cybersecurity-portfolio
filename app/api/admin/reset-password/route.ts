import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    if (!email || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and new password are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    if (!adminEmail || email !== adminEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid admin account.",
        },
        { status: 403 }
      );
    }

    const verifiedOtp =
      await prisma.passwordResetOtp.findFirst({
        where: {
          email,
          verified: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!verifiedOtp) {
      return NextResponse.json(
        {
          success: false,
          error:
            "OTP verification is required.",
        },
        { status: 403 }
      );
    }

    if (verifiedOtp.expiresAt < new Date()) {
      await prisma.passwordResetOtp.delete({
        where: {
          id: verifiedOtp.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "OTP verification has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    /*
     * Temporary password update for the current
     * server runtime.
     *
     * We will move this to a database-backed
     * admin account in the next step.
     */
    process.env.ADMIN_PASSWORD = newPassword;

    await prisma.passwordResetOtp.delete({
      where: {
        id: verifiedOtp.id,
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error(
      "POST /api/admin/reset-password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to reset password.",
      },
      { status: 500 }
    );
  }
}
