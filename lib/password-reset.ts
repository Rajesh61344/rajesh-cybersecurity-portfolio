import crypto from "crypto";

export function generateOtp(length = 6) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let otp = "";

  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(
      0,
      chars.length
    );

    otp += chars[index];
  }

  return otp;
}

export function hashOtp(otp: string) {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}