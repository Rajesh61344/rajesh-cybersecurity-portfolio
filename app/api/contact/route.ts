import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = (
      body.name ??
      body.fullName ??
      ""
    ).trim();

    const email = (
      body.email ??
      body.emailAddress ??
      ""
    ).trim();

    const message = (
      body.message ??
      body.description ??
      ""
    ).trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all fields.",
        },
        { status: 400 }
      );
    }

    await prisma.contact.create({
      data: {
        email,
        description: `Name: ${name}\n\nMessage: ${message}`,
        updatedAt: new Date(),
      },
    });

    console.log("Contact message saved:", {
      name,
      email,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}