import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Messages API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load messages.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID.",
        },
        { status: 400 }
      );
    }

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete message API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message.",
      },
      { status: 500 }
    );
  }
}