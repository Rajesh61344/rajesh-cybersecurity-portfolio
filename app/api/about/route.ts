import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =========================================================
   GET ABOUT
========================================================= */

export async function GET() {
  try {
    const about = await prisma.about.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error("GET /api/about error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch about information",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST ABOUT
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.heading) {
      return NextResponse.json(
        {
          error: "About heading is required",
        },
        {
          status: 400,
        }
      );
    }

    const about = await prisma.about.create({
      data: {
        heading: String(body.heading),

        description:
          body.description !== undefined
            ? String(body.description)
            : "",

        highlights: Array.isArray(
          body.highlights
        )
          ? body.highlights
              .map((item: unknown) =>
                String(item).trim()
              )
              .filter(Boolean)
          : [],
      },
    });

    return NextResponse.json(about, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/about error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to create about information",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PUT ABOUT
========================================================= */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error: "Valid About ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingAbout =
      await prisma.about.findUnique({
        where: {
          id,
        },
      });

    if (!existingAbout) {
      return NextResponse.json(
        {
          error: "About record not found",
        },
        {
          status: 404,
        }
      );
    }

    const about =
      await prisma.about.update({
        where: {
          id,
        },

        data: {
          heading:
            body.heading !== undefined
              ? String(body.heading)
              : existingAbout.heading,

          description:
            body.description !== undefined
              ? String(body.description)
              : existingAbout.description,

          highlights:
            body.highlights !== undefined
              ? Array.isArray(
                  body.highlights
                )
                ? body.highlights
                    .map(
                      (item: unknown) =>
                        String(item).trim()
                    )
                    .filter(Boolean)
                : []
              : existingAbout.highlights,
        },
      });

    return NextResponse.json(about);
  } catch (error) {
    console.error("PUT /api/about error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to update about information",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE ABOUT
========================================================= */

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error: "Valid About ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingAbout =
      await prisma.about.findUnique({
        where: {
          id,
        },
      });

    if (!existingAbout) {
      return NextResponse.json(
        {
          error: "About record not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.about.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "About section deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/about error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete about information",
      },
      {
        status: 500,
      }
    );
  }
}