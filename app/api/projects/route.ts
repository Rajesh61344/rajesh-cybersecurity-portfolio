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
   GET /api/projects
   Fetch all projects
========================================================= */

export async function GET() {
  try {
    const prisma = getPrisma();

    const projects = await prisma.project.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error(
      "GET /api/projects error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST /api/projects
   Create a new project
========================================================= */

export async function POST(request: Request) {
  try {
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
    } = body;

    if (
      !title ||
      !description ||
      !category ||
      !status ||
      !statusType ||
      !icon
    ) {
      return NextResponse.json(
        {
          error:
            "title, description, category, status, statusType and icon are required",
        },
        {
          status: 400,
        }
      );
    }

    const technologyList = Array.isArray(
      technologies
    )
      ? technologies.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [];

    const projectProgress = Math.min(
      Math.max(
        Number(progress ?? 0),
        0
      ),
      100
    );

    const prisma = getPrisma();

    const project = await prisma.project.create({
      data: {
        title: String(title),
        description: String(description),
        category: String(category),
        status: String(status),
        statusType: String(statusType),
        technologies: technologyList,
        progress: projectProgress,
        icon: String(icon),
        github:
          github &&
          String(github).trim() !== ""
            ? String(github)
            : null,
      },
    });

    return NextResponse.json(project, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/projects error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}