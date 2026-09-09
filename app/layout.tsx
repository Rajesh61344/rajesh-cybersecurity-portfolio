
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rajesh Reddy | Cybersecurity Analyst",
    template: "%s | Rajesh Reddy",
  },

  description:
    "Rajesh Reddy is a cybersecurity professional and B.Tech graduate focused on cybersecurity, information security, Python, vulnerability assessment, and secure technologies.",

  keywords: [
    "Rajesh Reddy",
    "Rajesh Reddy Cybersecurity",
    "Cybersecurity Analyst",
    "Junior Cybersecurity Analyst",
    "Cybersecurity Fresher",
    "Information Security",
    "Cybersecurity Portfolio",
    "Python",
    "Vulnerability Assessment",
    "Network Security",
    "Security Analyst",
  ],

  authors: [
    {
      name: "Rajesh Reddy",
    },
  ],

  creator: "Rajesh Reddy",

  applicationName: "Rajesh Reddy Cybersecurity Portfolio",

  metadataBase: new URL("https://example.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Rajesh Reddy | Cybersecurity Portfolio",
    title: "Rajesh Reddy | Cybersecurity Analyst",
    description:
      "Cybersecurity portfolio showcasing projects, technical skills, education, certifications, and information security experience.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rajesh Reddy | Cybersecurity Analyst",
    description:
      "Cybersecurity portfolio showcasing projects, skills, certifications, and information security work.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020607",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
