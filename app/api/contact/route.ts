import { NextResponse } from "next/server";

interface ContactRequest {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as ContactRequest;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is too long.",
        },
        { status: 400 }
      );
    }

    if (subject.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject is too long.",
        },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is too long.",
        },
        { status: 400 }
      );
    }

    const contactEmail =
      process.env.CONTACT_EMAIL;

    const resendApiKey =
      process.env.RESEND_API_KEY;

    if (
      !contactEmail ||
      !resendApiKey
    ) {
      console.error(
        "Contact API is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Contact service is not configured yet.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${resendApiKey}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          from:
            "Cybersecurity Portfolio <onboarding@resend.dev>",

          to: [contactEmail],

          reply_to: email,

          subject:
            `Portfolio Contact: ${subject}`,

          html: `
            <!DOCTYPE html>
            <html>
              <body
                style="
                  margin:0;
                  padding:30px;
                  background:#020609;
                  color:#e2e8f0;
                  font-family:Arial,sans-serif;
                "
              >
                <div
                  style="
                    max-width:650px;
                    margin:auto;
                    padding:30px;
                    background:#050b0e;
                    border:1px solid #12343b;
                    border-radius:16px;
                  "
                >

                  <div
                    style="
                      color:#22d3ee;
                      font-size:12px;
                      letter-spacing:3px;
                      margin-bottom:20px;
                    "
                  >
                    CYBERSECURITY PORTFOLIO
                  </div>

                  <h1 style="color:#ffffff;">
                    New Contact Message
                  </h1>

                  <p>
                    <strong>Name:</strong>
                    ${escapeHtml(name)}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${escapeHtml(email)}
                  </p>

                  <p>
                    <strong>Subject:</strong>
                    ${escapeHtml(subject)}
                  </p>

                  <hr />

                  <p
                    style="
                      line-height:1.7;
                      white-space:pre-wrap;
                    "
                  >
                    ${escapeHtml(message)}
                  </p>

                </div>
              </body>
            </html>
          `,
        }),
      }
    );

    if (!response.ok) {
      const errorData =
        await response.text();

      console.error(
        "Email provider error:",
        errorData
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send your message right now.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Contact API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(
  value: string
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}