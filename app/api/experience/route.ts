import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("GET /api/experience error:", error);

    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const experience = await prisma.experience.create({
      data: {
        role: body.role,
        company: body.company,
        location: body.location ?? null,
        startDate: body.startDate,
        endDate: body.endDate ?? null,
        current: Boolean(body.current),
        description: body.description,
        technologies: Array.isArray(body.technologies)
          ? body.technologies
          : [],
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("POST /api/experience error:", error);

    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.update({
      where: {
        id: Number(body.id),
      },
      data: {
        role: body.role,
        company: body.company,
        location: body.location ?? null,
        startDate: body.startDate,
        endDate: body.endDate ?? null,
        current: Boolean(body.current),
        description: body.description,
        technologies: Array.isArray(body.technologies)
          ? body.technologies
          : [],
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("PUT /api/experience error:", error);

    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Experience ID is required" },
        { status: 400 }
      );
    }

    await prisma.experience.delete({
      where: {
        id: Number(body.id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/experience error:", error);

    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
