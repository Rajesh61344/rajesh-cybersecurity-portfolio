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

    const skill = await prisma.skill.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        category: body.category,
        level: Number(body.level),
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Update skill error:", error);

    return NextResponse.json(
      { error: "Failed to update skill" },
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

    await prisma.skill.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete skill error:", error);

    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
