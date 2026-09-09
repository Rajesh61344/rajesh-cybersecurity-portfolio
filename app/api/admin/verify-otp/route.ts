import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashOtp } from "@/lib/password-reset";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const otp =
      typeof body.otp === "string"
        ? body.otp.trim().toUpperCase()
        : "";

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and OTP are required.",
        },
        { status: 400 }
      );
    }

    const resetOtp =
      await prisma.passwordResetOtp.findFirst({
        where: {
          email,
          verified: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!resetOtp) {
      return NextResponse.json(
        {
          success: false,
          error:
            "OTP not found. Please request a new OTP.",
        },
        { status: 404 }
      );
    }

    if (resetOtp.expiresAt < new Date()) {
      await prisma.passwordResetOtp.delete({
        where: {
          id: resetOtp.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error:
            "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    if (resetOtp.attempts >= 5) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Too many incorrect attempts. Please request a new OTP.",
        },
        { status: 429 }
      );
    }

    const otpHash = hashOtp(otp);

    if (otpHash !== resetOtp.otpHash) {
      await prisma.passwordResetOtp.update({
        where: {
          id: resetOtp.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid OTP.",
        },
        { status: 400 }
      );
    }

    await prisma.passwordResetOtp.update({
      where: {
        id: resetOtp.id,
      },
      data: {
        verified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error(
      "POST /api/admin/verify-otp error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify OTP.",
      },
      { status: 500 }
    );
  }
}