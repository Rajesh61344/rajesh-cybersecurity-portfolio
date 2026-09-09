import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  globalForPrisma.prisma = prisma;

  return prisma;
}

/* =========================================================
   GET /api/projects/[id]
========================================================= */

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        {
          error: "Invalid project ID",
        },
        {
          status: 400,
        }
      );
    }

    const prisma = getPrisma();

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(
      "GET /api/projects/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch project",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PUT /api/projects/[id]
========================================================= */

export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        {
          error: "Invalid project ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      category,
      status,
      statusType,
      technologies,
      progress,
      icon,
      github,
      liveUrl,
      image,
      featured,
    } = body;

    const data: {
      title?: string;
      description?: string;
      category?: string;
      status?: string;
      statusType?: string;
      technologies?: string[];
      progress?: number;
      icon?: string;
      github?: string | null;
      liveUrl?: string | null;
      image?: string | null;
      featured?: boolean;
    } = {};

    if (title !== undefined) {
      data.title = String(title);
    }

    if (description !== undefined) {
      data.description = String(description);
    }

    if (category !== undefined) {
      data.category = String(category);
    }

    if (status !== undefined) {
      data.status = String(status);
    }

    if (statusType !== undefined) {
      data.statusType = String(statusType);
    }

    if (technologies !== undefined) {
      data.technologies = Array.isArray(
        technologies
      )
        ? technologies.filter(
            (item): item is string =>
              typeof item === "string"
          )
        : [];
    }

    if (progress !== undefined) {
      data.progress = Math.min(
        Math.max(Number(progress), 0),
        100
      );
    }

    if (icon !== undefined) {
      data.icon = String(icon);
    }

    if (github !== undefined) {
      data.github =
        github === null ||
        String(github).trim() === ""
          ? null
          : String(github);
    }

    if (liveUrl !== undefined) {
      data.liveUrl =
        liveUrl === null ||
        String(liveUrl).trim() === ""
          ? null
          : String(liveUrl);
    }

    if (image !== undefined) {
      data.image =
        image === null ||
        String(image).trim() === ""
          ? null
          : String(image);
    }

    if (featured !== undefined) {
      data.featured = Boolean(featured);
    }

    const prisma = getPrisma();

    const existingProject =
      await prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

    if (!existingProject) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedProject =
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data,
      });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(
      "PUT /api/projects/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update project",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE /api/projects/[id]
========================================================= */

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json(
        {
          error: "Invalid project ID",
        },
        {
          status: 400,
        }
      );
    }

    const prisma = getPrisma();

    const existingProject =
      await prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

    if (!existingProject) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/projects/[id] error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete project",
      },
      {
        status: 500,
      }
    );
  }
}