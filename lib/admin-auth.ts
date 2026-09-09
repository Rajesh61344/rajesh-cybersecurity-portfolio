import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SECRET is not defined.");
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession() {
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error("ADMIN_EMAIL is not defined.");
  }

  const token = await new SignJWT({
    email,
    role: "owner",
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get(
      COOKIE_NAME
    )?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      getSecret()
    );

    if (
      payload.role !== "owner" ||
      payload.email !== process.env.ADMIN_EMAIL
    ) {
      return null;
    }

    return {
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated() {
  const session = await getAdminSession();

  return !!session;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}