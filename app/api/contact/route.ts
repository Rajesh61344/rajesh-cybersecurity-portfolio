import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get contact form fields
    const name = (
      body.name ??
      body.fullName ??
      ""
    ).trim();

    const email = (
      body.email ??
      body.emailAddress ??
      ""
    ).trim();

    const message = (
      body.message ??
      body.description ??
      ""
    ).trim();

    // Subject is optional for the frontend.
    // If the frontend does not send one, use a default subject.
    const subject = (
      body.subject ??
      body.topic ??
      "Portfolio Contact"
    ).trim();

    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing contact fields:", {
        name: Boolean(name),
        email: Boolean(email),
        subject: Boolean(subject),
        message: Boolean(message),
      });

      return NextResponse.json(
        {
          success: false,
          message: "Please complete all fields.",
        },
        {
          status: 400,
        }
      );
    }

    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
    });

    /*
     * =====================================================
     * CONTACT MESSAGE HANDLING
     * =====================================================
     *
     * At this point the form data is valid.
     *
     * If your project already has email/database logic,
     * keep that logic here.
     *
     * For now, this API successfully accepts the contact
     * form submission and returns a success response.
     */

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
        data: {
          name,
          email,
          subject,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}