import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =========================================================
   GET ALL CERTIFICATIONS
========================================================= */

export async function GET() {
  try {
    const certifications =
      await prisma.certification.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error(
      "GET /api/certifications error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch certifications",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   CREATE CERTIFICATION
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const issuer =
      typeof body.issuer === "string"
        ? body.issuer.trim()
        : "";

    const year =
      typeof body.year === "string" ||
      typeof body.year === "number"
        ? String(body.year).trim()
        : "";

    const credentialId =
      typeof body.credentialId === "string"
        ? body.credentialId.trim()
        : null;

    const credentialUrl =
      typeof body.credentialUrl === "string"
        ? body.credentialUrl.trim()
        : null;

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Certification name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!issuer) {
      return NextResponse.json(
        {
          error: "Certification issuer is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!year) {
      return NextResponse.json(
        {
          error: "Certification year is required",
        },
        {
          status: 400,
        }
      );
    }

    const certification =
      await prisma.certification.create({
        data: {
          name,
          issuer,
          year,
          credentialId:
            credentialId || null,
          credentialUrl:
            credentialUrl || null,
          description:
            description || null,
        },
      });

    return NextResponse.json(
      certification,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/certifications error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create certification",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   UPDATE CERTIFICATION
========================================================= */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!body.id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error:
            "Certification ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const issuer =
      typeof body.issuer === "string"
        ? body.issuer.trim()
        : "";

    const year =
      typeof body.year === "string" ||
      typeof body.year === "number"
        ? String(body.year).trim()
        : "";

    const credentialId =
      typeof body.credentialId === "string"
        ? body.credentialId.trim()
        : null;

    const credentialUrl =
      typeof body.credentialUrl === "string"
        ? body.credentialUrl.trim()
        : null;

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Certification name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!issuer) {
      return NextResponse.json(
        {
          error:
            "Certification issuer is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!year) {
      return NextResponse.json(
        {
          error:
            "Certification year is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.certification.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Certification not found",
        },
        {
          status: 404,
        }
      );
    }

    const certification =
      await prisma.certification.update({
        where: {
          id,
        },
        data: {
          name,
          issuer,
          year,
          credentialId:
            credentialId || null,
          credentialUrl:
            credentialUrl || null,
          description:
            description || null,
        },
      });

    return NextResponse.json(
      certification
    );
  } catch (error) {
    console.error(
      "PUT /api/certifications error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update certification",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE CERTIFICATION
========================================================= */

export async function DELETE(
  request: Request
) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!body.id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error:
            "Certification ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.certification.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Certification not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.certification.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Certification deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/certifications error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete certification",
      },
      {
        status: 500,
      }
    );
  }
}