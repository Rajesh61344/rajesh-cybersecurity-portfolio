import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills error:", error);

    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        level: Number(body.level),
      },
    });

    return NextResponse.json(skill, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/skills error:", error);

    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}