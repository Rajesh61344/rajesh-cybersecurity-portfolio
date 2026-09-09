"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Terminal,
} from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [visible, setVisible] = useState(false);
  const [formStatus, setFormStatus] =
    useState<FormStatus>("idle");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const section = document.getElementById("contact");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setFormStatus("error");
      return;
    }

    try {
      setFormStatus("sending");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setFormStatus("success");

      setForm({
        name: "",
        email: "",
        message: "",
      });

      window.setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    } catch {
      setFormStatus("error");

      window.setTimeout(() => {
        setFormStatus("idle");
      }, 4000);
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#010405] py-28"
    >
      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="contact-grid absolute inset-0" />

        <div className="absolute left-[8%] top-1/4 h-80 w-80 rounded-full bg-cyan-400/[0.025] blur-[130px]" />

        <div className="absolute bottom-0 right-[8%] h-80 w-80 rounded-full bg-blue-400/[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={`mb-14 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2">
            <MessageSquare
              size={12}
              className="text-cyan-300"
            />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              COMMUNICATION // SECURE CHANNEL
            </span>
          </div>

          <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
            Let&apos;s Connect
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
            Have a cybersecurity opportunity, project or
            collaboration in mind? Send me a message.
          </p>
        </div>

        {/* =================================================
            LIVE STATUS
        ================================================== */}

        <div
          className={`mb-8 flex flex-col gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.02] p-4 transition-all duration-1000 sm:flex-row sm:items-center sm:justify-between ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-3">

            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />

              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            </span>

            <div>
              <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-emerald-400">
                SECURE CHANNEL ONLINE
              </p>

              <p className="mt-1 text-xs text-white/45">
                Messages are ready to be received.
              </p>
            </div>

          </div>

          <span className="font-mono text-[6px] tracking-[0.12em] text-white/25">
            CONNECTION // ENCRYPTED
          </span>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================== */}

        <div className="grid gap-7 lg:grid-cols-[0.75fr_1.25fr]">

          {/* =================================================
              LEFT INFO
          ================================================== */}

          <div
            className={`rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-1000 ${
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04]">
              <ShieldCheck
                size={21}
                className="text-cyan-300"
              />
            </div>

            <p className="mt-7 font-mono text-[7px] font-bold tracking-[0.18em] text-cyan-300">
              DIRECT CONNECTION
            </p>

            <h3 className="mt-3 text-2xl font-black text-white">
              Let&apos;s build something secure.
            </h3>

            <p className="mt-5 text-sm leading-7 text-white/55">
              I&apos;m open to cybersecurity opportunities,
              internships, projects and collaborations where I
              can learn, contribute and build practical security
              solutions.
            </p>

            {/* Contact details */}

            <div className="mt-8 space-y-4">

              <ContactInfo
                icon={<Mail size={15} />}
                label="EMAIL"
                value="brajeshreddy90@gmail.com"
                href="mailto:brajeshreddy90@gmail.com"
              />

              <ContactInfo
                icon={<MapPin size={15} />}
                label="LOCATION"
                value="India"
              />

            </div>

            {/* Terminal */}

            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-black/20 p-5">

              <div className="flex items-center gap-2 border-b border-white/[0.07] pb-3">

                <Terminal
                  size={12}
                  className="text-cyan-300"
                />

                <span className="font-mono text-[6px] text-white/30">
                  CONNECTION_TERMINAL
                </span>

              </div>

              <div className="mt-4 font-mono text-[7px] leading-6">

                <p className="text-white/30">
                  <span className="text-cyan-300">
                    $
                  </span>{" "}
                  establish_connection
                </p>

                <p className="text-emerald-400">
                  connection established
                </p>

                <p className="text-white/30">
                  <span className="text-cyan-300">
                    $
                  </span>{" "}
                  waiting_for_message...
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              FORM
          ================================================== */}

          <div
            className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-1000 sm:p-8 ${
              visible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >

            {/* Glow */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/[0.04] blur-3xl" />

            <div className="relative">

              {/* Form header */}

              <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">
                    <Send
                      size={16}
                      className="text-cyan-300"
                    />
                  </div>

                  <div>

                    <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-cyan-300">
                      SEND MESSAGE
                    </p>

                    <p className="mt-1 text-xs text-white/40">
                      Secure communication form
                    </p>

                  </div>

                </div>

                <span className="font-mono text-[6px] text-emerald-400">
                  ONLINE
                </span>

              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* Name */}

                <div>

                  <label
                    htmlFor="contact-name"
                    className="mb-2 block font-mono text-[7px] font-bold tracking-[0.12em] text-white/50"
                  >
                    YOUR NAME
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-cyan-400/35 focus:bg-cyan-400/[0.02] focus:shadow-[0_0_25px_rgba(34,211,238,0.04)]"
                  />

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="contact-email"
                    className="mb-2 block font-mono text-[7px] font-bold tracking-[0.12em] text-white/50"
                  >
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value,
                      })
                    }
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-cyan-400/35 focus:bg-cyan-400/[0.02] focus:shadow-[0_0_25px_rgba(34,211,238,0.04)]"
                  />

                </div>

                {/* Message */}

                <div>

                  <label
                    htmlFor="contact-message"
                    className="mb-2 block font-mono text-[7px] font-bold tracking-[0.12em] text-white/50"
                  >
                    MESSAGE
                  </label>

                  <textarea
                    id="contact-message"
                    rows={6}
                    value={form.message}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        message: event.target.value,
                      })
                    }
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-cyan-400/35 focus:bg-cyan-400/[0.02] focus:shadow-[0_0_25px_rgba(34,211,238,0.04)]"
                  />

                </div>

                {/* Status */}

                {formStatus === "error" && (
                  <div className="rounded-xl border border-red-400/15 bg-red-400/[0.03] px-4 py-3">
                    <p className="font-mono text-[7px] font-bold text-red-300">
                      Please complete all fields.
                    </p>
                  </div>
                )}

                {formStatus === "success" && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] px-4 py-3">

                    <CheckCircle2
                      size={15}
                      className="text-emerald-400"
                    />

                    <p className="font-mono text-[7px] font-bold text-emerald-300">
                      MESSAGE SENT SUCCESSFULLY.
                    </p>

                  </div>
                )}

                {/* Submit */}

                <button
                  type="submit"
                  disabled={formStatus === "sending"}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/[0.1] hover:shadow-[0_15px_45px_rgba(34,211,238,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Send
                    size={15}
                    className={`text-cyan-300 transition-transform duration-300 ${
                      formStatus === "sending"
                        ? "animate-pulse"
                        : "group-hover:translate-x-1"
                    }`}
                  />

                  <span className="font-mono text-[7px] font-bold tracking-[0.15em] text-cyan-200">
                    {formStatus === "sending"
                      ? "TRANSMITTING..."
                      : "SEND SECURE MESSAGE"}
                  </span>

                  <ArrowUpRight
                    size={13}
                    className="text-cyan-300/60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />

                </button>

              </form>

            </div>
          </div>
        </div>

        {/* Bottom */}

        <div
          className={`mt-10 flex items-center justify-center gap-3 transition-all duration-1000 ${
            visible
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300/50" />

            <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
          </span>

          <span className="font-mono text-[6px] font-bold tracking-[0.16em] text-white/25">
            COMMUNICATION SYSTEM // READY
          </span>
        </div>

      </div>

      <style jsx>{`
        .contact-grid {
          background-image:
            linear-gradient(
              rgba(34, 211, 238, 0.015) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34, 211, 238, 0.015) 1px,
              transparent 1px
            );

          background-size: 48px 48px;

          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 80%
          );
        }
      `}</style>
    </section>
  );
}

/* ======================================================
   CONTACT INFO
====================================================== */

function ContactInfo({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] text-cyan-300 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="font-mono text-[6px] font-bold tracking-[0.14em] text-white/30">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-medium text-white/75 group-hover:text-cyan-200">
          {value}
        </p>

      </div>

    </div>
  );

  if (href) {
    return (
      <a href={href}>
        {content}
      </a>
    );
  }

  return content;
}