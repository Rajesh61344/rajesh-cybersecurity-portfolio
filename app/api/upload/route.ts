import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

const MAX_PROFILE_SIZE = 5 * 1024 * 1024;
const MAX_RESUME_SIZE = 10 * 1024 * 1024;

function safeExtension(filename: string, contentType: string) {
  const fromName = path.extname(filename).toLowerCase();
  if (/^\.[a-z0-9]{1,8}$/.test(fromName)) return fromName;

  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "application/pdf": ".pdf",
  };

  return map[contentType] || "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = String(formData.get("type") || "profile");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400 }
      );
    }

    if (type !== "profile" && type !== "resume") {
      return NextResponse.json(
        { error: "Invalid upload type." },
        { status: 400 }
      );
    }

    const isProfile = type === "profile";
    const maxSize = isProfile ? MAX_PROFILE_SIZE : MAX_RESUME_SIZE;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: isProfile
            ? "Profile image must be 5MB or smaller."
            : "Resume must be 10MB or smaller.",
        },
        { status: 400 }
      );
    }

    if (isProfile && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Profile upload must be an image." },
        { status: 400 }
      );
    }

    if (!isProfile && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Resume upload must be a PDF." },
        { status: 400 }
      );
    }

    const extension = safeExtension(file.name, file.type);
    if (!extension) {
      return NextResponse.json(
        { error: "Unsupported file type." },
        { status: 400 }
      );
    }

    const directory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(directory, { recursive: true });

    const filename = `${type}-${randomUUID()}${extension}`;
    const absolutePath = path.join(directory, filename);
    const bytes = Buffer.from(await file.arrayBuffer());

    await writeFile(absolutePath, bytes);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      type,
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
