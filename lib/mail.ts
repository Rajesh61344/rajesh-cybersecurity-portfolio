import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

if (!smtpUser || !smtpPassword) {
  throw new Error(
    "SMTP_USER and SMTP_PASSWORD must be configured."
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export async function sendPasswordResetOtp(
  email: string,
  otp: string
) {
  await transporter.sendMail({
    from: `"Rajesh Reddy | Security Admin" <${smtpUser}>`,
    to: email,
    subject: "Admin Password Reset OTP",

    text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        background: #050b12;
        padding: 40px;
        color: #ffffff;
      ">
        <div style="
          max-width: 520px;
          margin: auto;
          background: #0b1420;
          border: 1px solid #164e63;
          border-radius: 16px;
          padding: 32px;
        ">

          <h2 style="
            color: #22d3ee;
            margin: 0 0 10px;
          ">
            ADMIN PASSWORD RESET
          </h2>

          <p style="color: #94a3b8;">
            A password reset request was received for
            your administrator account.
          </p>

          <div style="
            margin: 30px 0;
            text-align: center;
          ">
            <div style="
              display: inline-block;
              padding: 16px 28px;
              background: #020617;
              border: 1px solid #0891b2;
              border-radius: 12px;
              color: #22d3ee;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 8px;
            ">
              ${otp}
            </div>
          </div>

          <p style="color: #94a3b8;">
            This OTP expires in
            <strong style="color: #22d3ee;">
              10 minutes
            </strong>.
          </p>

          <p style="
            color: #64748b;
            font-size: 12px;
          ">
            If you did not request this password reset,
            you can safely ignore this email.
          </p>

        </div>
      </div>
    `,
  });
}