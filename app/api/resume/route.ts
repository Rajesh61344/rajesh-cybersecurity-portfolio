import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =========================================================
   GET ALL RESUMES
========================================================= */

export async function GET() {
  try {
    const resumes =
      await prisma.resume.findMany({
        orderBy: {
          id: "desc",
        },
      });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error(
      "GET /api/resume error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch resumes",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST RESUME
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const fileUrl =
      typeof body.fileUrl === "string"
        ? body.fileUrl.trim()
        : "";

    if (!title || !fileUrl) {
      return NextResponse.json(
        {
          error:
            "Resume title and file URL are required",
        },
        {
          status: 400,
        }
      );
    }

    const resume =
      await prisma.resume.create({
        data: {
          title,

          fileUrl,

          downloadUrl:
            typeof body.downloadUrl ===
            "string" &&
            body.downloadUrl.trim()
              ? body.downloadUrl.trim()
              : null,
        },
      });

    return NextResponse.json(
      resume,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/resume error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create resume",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PUT RESUME
========================================================= */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error:
            "Valid resume ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.resume.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Resume not found",
        },
        {
          status: 404,
        }
      );
    }

    const title =
      body.title !== undefined
        ? String(body.title).trim()
        : existing.title;

    const fileUrl =
      body.fileUrl !== undefined
        ? String(body.fileUrl).trim()
        : existing.fileUrl;

    if (!title || !fileUrl) {
      return NextResponse.json(
        {
          error:
            "Resume title and file URL are required",
        },
        {
          status: 400,
        }
      );
    }

    const resume =
      await prisma.resume.update({
        where: {
          id,
        },

        data: {
          title,

          fileUrl,

          downloadUrl:
            body.downloadUrl !== undefined
              ? body.downloadUrl
                ? String(
                    body.downloadUrl
                  ).trim()
                : null
              : existing.downloadUrl,
        },
      });

    return NextResponse.json(resume);
  } catch (error) {
    console.error(
      "PUT /api/resume error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update resume",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE RESUME
========================================================= */

export async function DELETE(
  request: Request
) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error:
            "Valid resume ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.resume.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Resume not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.resume.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/resume error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete resume",
      },
      {
        status: 500,
      }
    );
  }
}