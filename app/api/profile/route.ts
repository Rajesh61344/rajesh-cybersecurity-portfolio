import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* =========================================================
   GET PROFILE
========================================================= */

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch profile",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST PROFILE
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.title) {
      return NextResponse.json(
        {
          error: "Name and title are required",
        },
        {
          status: 400,
        }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        name: String(body.name),
        title: String(body.title),

        tagline:
          body.tagline !== undefined
            ? body.tagline || null
            : null,

        description:
          body.description !== undefined
            ? body.description || null
            : null,

        email:
          body.email !== undefined
            ? body.email || null
            : null,

        phone:
          body.phone !== undefined
            ? body.phone || null
            : null,

        location:
          body.location !== undefined
            ? body.location || null
            : null,

        profileImage:
          body.profileImage !== undefined
            ? body.profileImage || null
            : null,

        github:
          body.github !== undefined
            ? body.github || null
            : null,

        linkedin:
          body.linkedin !== undefined
            ? body.linkedin || null
            : null,

        resumeUrl:
          body.resumeUrl !== undefined
            ? body.resumeUrl || null
            : null,

        availability:
          body.availability !== undefined
            ? body.availability || null
            : null,
      },
    });

    return NextResponse.json(profile, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/profile error:", error);

    return NextResponse.json(
      {
        error: "Failed to create profile",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PUT PROFILE
========================================================= */

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error: "Valid profile ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingProfile =
      await prisma.profile.findUnique({
        where: {
          id,
        },
      });

    if (!existingProfile) {
      return NextResponse.json(
        {
          error: "Profile not found",
        },
        {
          status: 404,
        }
      );
    }

    const profile =
      await prisma.profile.update({
        where: {
          id,
        },

        data: {
          name:
            body.name !== undefined
              ? String(body.name)
              : existingProfile.name,

          title:
            body.title !== undefined
              ? String(body.title)
              : existingProfile.title,

          tagline:
            body.tagline !== undefined
              ? body.tagline || null
              : existingProfile.tagline,

          description:
            body.description !== undefined
              ? body.description || null
              : existingProfile.description,

          email:
            body.email !== undefined
              ? body.email || null
              : existingProfile.email,

          phone:
            body.phone !== undefined
              ? body.phone || null
              : existingProfile.phone,

          location:
            body.location !== undefined
              ? body.location || null
              : existingProfile.location,

          profileImage:
            body.profileImage !== undefined
              ? body.profileImage || null
              : existingProfile.profileImage,

          github:
            body.github !== undefined
              ? body.github || null
              : existingProfile.github,

          linkedin:
            body.linkedin !== undefined
              ? body.linkedin || null
              : existingProfile.linkedin,

          resumeUrl:
            body.resumeUrl !== undefined
              ? body.resumeUrl || null
              : existingProfile.resumeUrl,

          availability:
            body.availability !== undefined
              ? body.availability || null
              : existingProfile.availability,
        },
      });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PUT /api/profile error:", error);

    return NextResponse.json(
      {
        error: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE PROFILE
========================================================= */

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id = Number(body.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        {
          error: "Valid profile ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingProfile =
      await prisma.profile.findUnique({
        where: {
          id,
        },
      });

    if (!existingProfile) {
      return NextResponse.json(
        {
          error: "Profile not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.profile.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/profile error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete profile",
      },
      {
        status: 500,
      }
    );
  }
}