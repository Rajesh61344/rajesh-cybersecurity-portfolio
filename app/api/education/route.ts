import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =========================================================
   GET ALL EDUCATION
========================================================= */

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("GET /api/education error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch education",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   CREATE EDUCATION
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      typeof body.degree !== "string" ||
      !body.degree.trim()
    ) {
      return NextResponse.json(
        {
          error: "Degree is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.institution !== "string" ||
      !body.institution.trim()
    ) {
      return NextResponse.json(
        {
          error: "Institution is required",
        },
        {
          status: 400,
        }
      );
    }

    const education =
      await prisma.education.create({
        data: {
          degree: body.degree.trim(),
          institution:
            body.institution.trim(),

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

    return NextResponse.json(
      education,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/education error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create education",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE EDUCATION
   Supports:
   PUT /api/education
   {
     id: 1,
     degree: "...",
     institution: "..."
   }
========================================================= */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "Valid education ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.degree !== "string" ||
      !body.degree.trim()
    ) {
      return NextResponse.json(
        {
          error: "Degree is required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body.institution !== "string" ||
      !body.institution.trim()
    ) {
      return NextResponse.json(
        {
          error: "Institution is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.education.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Education record not found",
        },
        {
          status: 404,
        }
      );
    }

    const education =
      await prisma.education.update({
        where: {
          id,
        },

        data: {
          degree: body.degree.trim(),

          institution:
            body.institution.trim(),

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

    return NextResponse.json(
      education
    );
  } catch (error) {
    console.error(
      "PUT /api/education error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update education",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE EDUCATION
   Supports:
   
   DELETE /api/education
   Body:
   {
     id: 1
   }

   AND

   DELETE /api/education/1
   ========================================================
   
   NOTE:
   /api/education/1 is handled by:
   app/api/education/[id]/route.ts
========================================================= */

export async function DELETE(request: Request) {
  try {
    let body: { id?: number | string } = {};

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "Valid education ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.education.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Education record not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.education.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Education deleted successfully",
      id,
    });
  } catch (error) {
    console.error(
      "DELETE /api/education error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete education",
      },
      {
        status: 500,
      }
    );
  }
}