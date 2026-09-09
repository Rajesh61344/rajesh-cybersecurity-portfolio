import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const certification =
      await prisma.certification.update({
        where: {
          id: Number(id),
        },
        data: {
          name: body.name,
          issuer: body.issuer,
          year: String(body.year),
        },
      });

    return NextResponse.json(certification);
  } catch (error) {
    console.error(
      "Update certification error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update certification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    await prisma.certification.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete certification error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete certification",
      },
      { status: 500 }
    );
  }
}
