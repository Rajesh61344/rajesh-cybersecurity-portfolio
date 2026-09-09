import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId) || experienceId <= 0) {
      return NextResponse.json(
        { error: "Valid experience ID is required" },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
    });

    if (!experience) {
      return NextResponse.json(
        { error: "Experience record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error("GET /api/experience/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to fetch experience" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId) || experienceId <= 0) {
      return NextResponse.json(
        { error: "Valid experience ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (
      typeof body.role !== "string" ||
      !body.role.trim()
    ) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      );
    }

    if (
      typeof body.company !== "string" ||
      !body.company.trim()
    ) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 }
      );
    }

    if (
      typeof body.startDate !== "string" ||
      !body.startDate.trim()
    ) {
      return NextResponse.json(
        { error: "Start date is required" },
        { status: 400 }
      );
    }

    if (
      typeof body.description !== "string" ||
      !body.description.trim()
    ) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Experience record not found" },
        { status: 404 }
      );
    }

    const experience = await prisma.experience.update({
      where: {
        id: experienceId,
      },
      data: {
        role: body.role.trim(),
        company: body.company.trim(),

        location:
          typeof body.location === "string" &&
          body.location.trim()
            ? body.location.trim()
            : null,

        startDate: body.startDate.trim(),

        endDate:
          typeof body.endDate === "string" &&
          body.endDate.trim()
            ? body.endDate.trim()
            : null,

        current: Boolean(body.current),

        description: body.description.trim(),

        technologies: Array.isArray(body.technologies)
          ? body.technologies
          : [],
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("PUT /api/experience/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const experienceId = Number(id);

    if (!Number.isInteger(experienceId) || experienceId <= 0) {
      return NextResponse.json(
        { error: "Valid experience ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.experience.findUnique({
      where: {
        id: experienceId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Experience record not found" },
        { status: 404 }
      );
    }

    await prisma.experience.delete({
      where: {
        id: experienceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully",
      id: experienceId,
    });
  } catch (error) {
    console.error("DELETE /api/experience/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete experience",
      },
      { status: 500 }
    );
  }
}
