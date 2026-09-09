import { NextResponse } from "next/server";
import { sendPasswordResetOtp } from "@/lib/mail";

export async function GET() {
  try {
    const testOtp = "A7K9P2";

    await sendPasswordResetOtp(
      "brajeshreddy90@gmail.com",
      testOtp
    );

    return NextResponse.json({
      success: true,
      message: "Test OTP email sent successfully.",
    });
  } catch (error) {
    console.error("TEST MAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to send test email.",
      },
      { status: 500 }
    );
  }
}