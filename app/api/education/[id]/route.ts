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
    const educationId = Number(id);

    if (!Number.isInteger(educationId) || educationId <= 0) {
      return NextResponse.json(
        { error: "Valid education ID is required" },
        { status: 400 }
      );
    }

    const education = await prisma.education.findUnique({
      where: {
        id: educationId,
      },
    });

    if (!education) {
      return NextResponse.json(
        { error: "Education record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    console.error("GET /api/education/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to fetch education" },
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
    const educationId = Number(id);

    if (!Number.isInteger(educationId) || educationId <= 0) {
      return NextResponse.json(
        { error: "Valid education ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (
      typeof body.degree !== "string" ||
      !body.degree.trim()
    ) {
      return NextResponse.json(
        { error: "Degree is required" },
        { status: 400 }
      );
    }

    if (
      typeof body.institution !== "string" ||
      !body.institution.trim()
    ) {
      return NextResponse.json(
        { error: "Institution is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.education.findUnique({
      where: {
        id: educationId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Education record not found" },
        { status: 404 }
      );
    }

    const education = await prisma.education.update({
      where: {
        id: educationId,
      },
      data: {
        degree: body.degree.trim(),
        institution: body.institution.trim(),

        location:
          typeof body.location === "string" &&
          body.location.trim()
            ? body.location.trim()
            : null,

        startYear:
          typeof body.startYear === "string" &&
          body.startYear.trim()
            ? body.startYear.trim()
            : null,

        endYear:
          typeof body.endYear === "string" &&
          body.endYear.trim()
            ? body.endYear.trim()
            : null,

        grade:
          typeof body.grade === "string" &&
          body.grade.trim()
            ? body.grade.trim()
            : null,

        description:
          typeof body.description === "string" &&
          body.description.trim()
            ? body.description.trim()
            : null,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("PUT /api/education/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update education" },
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
    const educationId = Number(id);

    if (!Number.isInteger(educationId) || educationId <= 0) {
      return NextResponse.json(
        { error: "Valid education ID is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.education.findUnique({
      where: {
        id: educationId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Education record not found" },
        { status: 404 }
      );
    }

    await prisma.education.delete({
      where: {
        id: educationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education deleted successfully",
      id: educationId,
    });
  } catch (error) {
    console.error("DELETE /api/education/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete education",
      },
      { status: 500 }
    );
  }
}
