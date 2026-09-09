import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetOtp } from "@/lib/mail";
import {
  generateOtp,
  hashOtp,
} from "@/lib/password-reset";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (!adminEmail) {
      return NextResponse.json(
        {
          error:
            "Admin authentication is not configured.",
        },
        { status: 500 }
      );
    }

    /*
     * Do not reveal whether an email belongs
     * to the admin account.
     */
    if (email !== adminEmail) {
      return NextResponse.json({
        success: true,
        message:
          "If the account exists, a verification code has been sent.",
      });
    }

    /*
     * Generate a secure alphanumeric OTP.
     *
     * Example:
     * A7K9XP
     */
    const otp = generateOtp(6);

    const otpHash = hashOtp(otp);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    /*
     * Remove previous reset OTPs
     * for this email.
     */
    await prisma.passwordResetOtp.deleteMany({
      where: {
        email,
      },
    });

    /*
     * Store only the hash.
     * Never store the real OTP.
     */
    await prisma.passwordResetOtp.create({
      data: {
        email,
        otpHash,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    /*
     * Send OTP through Gmail SMTP.
     */
    await sendPasswordResetOtp(
      email,
      otp
    );

    return NextResponse.json({
      success: true,
      message:
        "Verification code sent successfully.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process password reset request.",
      },
      { status: 500 }
    );
  }
}