"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Code2,
  Eye,
  LockKeyhole,
  ShieldCheck,
  Terminal,
  UserRound,
} from "lucide-react";

type ProfileData = {
  profileImage?: string | null;
  image?: string | null;
  photo?: string | null;
};

export default function About() {
  const [visible, setVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const section = document.getElementById("about");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /*
   * Load profile image from Admin Panel
   * Admin → Profile → Profile Image
   */
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();

        if (!mounted) return;

        /*
         * Supports:
         * { profileImage: "..." }
         * { image: "..." }
         * { photo: "..." }
         *
         * Also supports:
         * { profile: { profileImage: "..." } }
         */
        const profile: ProfileData =
          data?.profile && typeof data.profile === "object"
            ? data.profile
            : data;

        const image =
          profile?.profileImage ||
          profile?.image ||
          profile?.photo ||
          null;

        setProfileImage(image);
      } catch (error) {
        console.error("Failed to load profile image:", error);
        setProfileImage(null);
      } finally {
        if (mounted) {
          setImageLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#010405] py-28"
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div className="about-grid absolute inset-0" />

        <div className="absolute left-[15%] top-1/3 h-72 w-72 rounded-full bg-cyan-400/[0.025] blur-[120px]" />

        <div className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-blue-400/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}

        <div
          className={`mb-14 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2">
            <Eye size={12} className="text-cyan-300" />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              PROFILE // INTELLIGENCE
            </span>
          </div>

          <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
            About Me
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
            A cybersecurity-focused developer building practical
            security solutions with a defensive mindset.
          </p>
        </div>

        {/* Main */}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* LEFT */}

          <div
            className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-1000 sm:p-9 ${
              visible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl" />

            <div className="relative">

              {/* Terminal header */}

              <div className="mb-7 flex items-center gap-3 border-b border-white/[0.07] pb-5">

                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/60" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400/60" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
                </div>

                <span className="font-mono text-[7px] text-white/35">
                  rajesh@cybersecurity:~/about
                </span>

              </div>

              {/* Terminal */}

              <div className="font-mono text-[8px] leading-7">

                <p className="text-white/40">
                  <span className="text-cyan-300">$</span>{" "}
                  whoami
                </p>

                <p className="text-white">
                  Rajesh Reddy
                </p>

                <p className="mt-3 text-white/40">
                  <span className="text-cyan-300">$</span>{" "}
                  cat profile.txt
                </p>

                <p className="max-w-2xl text-white/65">
                  Cybersecurity-focused developer interested in
                  security monitoring, threat detection,
                  vulnerability analysis, automation and
                  defensive security.
                </p>

              </div>

              {/* Description */}

              <div className="mt-7 space-y-4 text-sm leading-7 text-white/65">

                <p>
                  I enjoy understanding how attacks work and
                  turning that knowledge into practical defensive
                  solutions.
                </p>

                <p>
                  My projects combine Python, cybersecurity
                  concepts and data-driven techniques to identify
                  suspicious activity and security risks.
                </p>

              </div>

              {/* Tags */}

              <div className="mt-7 flex flex-wrap gap-2">

                <Tag label="THREAT DETECTION" />
                <Tag label="SECURITY ANALYSIS" />
                <Tag label="PYTHON" />
                <Tag label="VULNERABILITY" />
                <Tag label="DEFENSIVE SECURITY" />

              </div>

            </div>
          </div>

          {/* RIGHT */}

          <div
            className={`grid gap-4 transition-all duration-1000 ${
              visible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >

            {/* PROFILE IMAGE */}

            <div className="group relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-white/[0.02] p-3 backdrop-blur-xl transition-all duration-500 hover:border-cyan-400/30 hover:shadow-[0_20px_70px_rgba(34,211,238,0.08)]">

              {/* Glow */}

              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/[0.06] blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#020607]">

                {/* Image */}

                {imageLoading ? (
                  <div className="flex aspect-[4/3] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">

                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />

                      <span className="font-mono text-[7px] tracking-[0.15em] text-white/30">
                        LOADING_PROFILE...
                      </span>

                    </div>
                  </div>
                ) : profileImage ? (
                  <div className="relative aspect-[4/3] overflow-hidden">

                    <img
                      src={profileImage}
                      alt="Rajesh Reddy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      onError={() => setProfileImage(null)}
                    />

                    {/* Image overlay */}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-cyan-400/[0.04]" />

                    {/* Scan line */}

                    <div className="pointer-events-none absolute left-0 right-0 top-0 h-px animate-pulse bg-cyan-300/40" />

                    {/* Status */}

                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cyan-400/20 bg-black/50 px-3 py-1.5 backdrop-blur-md">

                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      <span className="font-mono text-[7px] font-bold tracking-[0.15em] text-cyan-300">
                        PROFILE ACTIVE
                      </span>

                    </div>

                    {/* Name overlay */}

                    <div className="absolute bottom-4 left-4 right-4">

                      <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">

                        <p className="font-bold text-white">
                          Rajesh Reddy
                        </p>

                        <p className="mt-1 font-mono text-[6px] tracking-[0.15em] text-cyan-300/70">
                          JUNIOR CYBERSECURITY ANALYST
                        </p>

                      </div>

                    </div>

                  </div>
                ) : (
                  /* Fallback */

                  <div className="flex aspect-[4/3] flex-col items-center justify-center px-6 text-center">

                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04]">

                      <UserRound
                        size={25}
                        className="text-cyan-300/50"
                      />

                    </div>

                    <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-white/40">
                      PROFILE IMAGE
                    </p>

                    <p className="mt-2 max-w-xs font-mono text-[6px] leading-5 text-white/25">
                      Upload a profile image from Admin Panel →
                      Profile.
                    </p>

                  </div>
                )}

              </div>

              {/* Image footer */}

              <div className="relative flex items-center justify-between px-2 pb-1 pt-3">

                <div className="flex items-center gap-2">

                  <LockKeyhole
                    size={11}
                    className="text-cyan-300/50"
                  />

                  <span className="font-mono text-[6px] tracking-[0.12em] text-white/25">
                    SECURE_PROFILE
                  </span>

                </div>

                <span className="font-mono text-[6px] text-emerald-300/50">
                  ONLINE
                </span>

              </div>

            </div>

            {/* SECURITY FIRST */}

            <InfoCard
              icon={<ShieldCheck size={18} />}
              title="SECURITY FIRST"
              text="Focused on identifying risks, analyzing threats and improving defensive security."
            />

            {/* DEVELOPMENT */}

            <InfoCard
              icon={<Code2 size={18} />}
              title="DEVELOPMENT"
              text="Building practical cybersecurity tools with Python and modern development workflows."
            />

            {/* DEFENSIVE */}

            <InfoCard
              icon={<LockKeyhole size={18} />}
              title="DEFENSIVE MINDSET"
              text="Interested in monitoring, detection, vulnerability analysis and security automation."
            />

            {/* CURRENT FOCUS */}

            <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.025] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(34,211,238,0.06)]">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">

                    <Terminal
                      size={17}
                      className="text-cyan-300"
                    />

                  </div>

                  <div>

                    <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-cyan-300">
                      CURRENT FOCUS
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      Cybersecurity
                    </p>

                  </div>

                </div>

                <ArrowRight
                  size={15}
                  className="text-cyan-300 transition-transform duration-300 group-hover:translate-x-1"
                />

              </div>

              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">

                <div className="h-full w-[82%] animate-pulse rounded-full bg-cyan-300" />

              </div>

              <p className="mt-3 font-mono text-[6px] tracking-[0.12em] text-white/35">
                CONTINUOUSLY LEARNING // BUILDING // SECURING
              </p>

            </div>

          </div>
        </div>

      </div>

      <style jsx>{`
        .about-grid {
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
            transparent 78%
          );
        }
      `}</style>
    </section>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-[6px] font-bold tracking-[0.1em] text-white/55 transition-all duration-300 hover:border-cyan-400/25 hover:bg-cyan-400/[0.04] hover:text-cyan-300">
      {label}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-cyan-400/[0.025] hover:shadow-[0_20px_50px_rgba(34,211,238,0.05)]">

      <div className="flex gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div>

          <h3 className="font-mono text-[8px] font-bold tracking-[0.15em] text-white">
            {title}
          </h3>

          <p className="mt-2 text-xs leading-6 text-white/55">
            {text}
          </p>

        </div>

      </div>
    </div>
  );
}