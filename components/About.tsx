"use client";

import { useEffect, useState, useRef } from "react";

type ProfileData = {
  id?: number;
  name?: string | null;
  title?: string | null;
  tagline?: string | null;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  profileImage?: string | null;
  github?: string | null;
  linkedin?: string | null;
  resumeUrl?: string | null;
  availability?: string | null;
};

type TagProps = {
  children: React.ReactNode;
};

type InfoCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function Tag({ children }: TagProps) {
  return (
    <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.03] px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-cyan-200/60">
      {children}
    </span>
  );
}

function InfoCard({ title, icon, children }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-300/20 hover:bg-white/[0.035]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] text-cyan-300/70">
          {icon}
        </div>

        <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/60">
          {title}
        </h3>
      </div>

      <div className="font-mono text-xs leading-6 text-white/40">
        {children}
      </div>
    </div>
  );
}

export default function About() {
  {/*const [visible, setVisible] = useState(false); */}
  const [visible, setVisible] = useState(true);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileDescription, setProfileDescription] = useState("");

  const [typedName, setTypedName] = useState("");
  const [typedCommand, setTypedCommand] = useState("");
  const [typedDescription, setTypedDescription] = useState("");

 const [imageLoading, setImageLoading] = useState(true);
const [imageError, setImageError] = useState(false);

const profileImageRef = useRef<HTMLDivElement | null>(null);

  /* =====================================================
     SECTION VISIBILITY
  ===================================================== */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* =====================================================
     LOAD PROFILE FROM ADMIN API
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        const profile: ProfileData =
          data?.profile && typeof data.profile === "object"
            ? data.profile
            : data;

        if (!mounted) return;

        const image =
          typeof profile?.profileImage === "string"
            ? profile.profileImage.trim()
            : "";

        const description =
          typeof profile?.description === "string"
            ? profile.description.trim()
            : "";

        setProfileImage(image || null);
        setProfileDescription(description);
      } catch (error) {
        console.error("Failed to load profile:", error);

        if (!mounted) return;

        setProfileImage(null);
        setProfileDescription("");
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LIVE WRITING / TYPEWRITER ANIMATION
  ===================================================== */

  useEffect(() => {
    if (!profileDescription) {
      setTypedName("");
      setTypedCommand("");
      setTypedDescription("");
      return;
    }

    const nameText = "Rajesh Reddy";
    const commandText = "cat profile.txt";

    let nameIndex = 0;
    let commandIndex = 0;
    let descriptionIndex = 0;

    let nameTimer: number | null = null;
    let commandTimer: number | null = null;
    let descriptionTimer: number | null = null;

    setTypedName("");
    setTypedCommand("");
    setTypedDescription("");

    /* -----------------------------------------------------
       TYPE NAME
    ----------------------------------------------------- */

    nameTimer = window.setInterval(() => {
      nameIndex += 1;

      setTypedName(nameText.slice(0, nameIndex));

      if (nameIndex >= nameText.length) {
        if (nameTimer !== null) {
          window.clearInterval(nameTimer);
        }

        /* -------------------------------------------------
           TYPE COMMAND
        ------------------------------------------------- */

        commandTimer = window.setInterval(() => {
          commandIndex += 1;

          setTypedCommand(commandText.slice(0, commandIndex));

          if (commandIndex >= commandText.length) {
            if (commandTimer !== null) {
              window.clearInterval(commandTimer);
            }

            /* ---------------------------------------------
               TYPE FULL DESCRIPTION
            --------------------------------------------- */

            descriptionTimer = window.setInterval(() => {
              descriptionIndex += 1;

              setTypedDescription(
                profileDescription.slice(0, descriptionIndex)
              );

              if (descriptionIndex >= profileDescription.length) {
                if (descriptionTimer !== null) {
                  window.clearInterval(descriptionTimer);
                }
              }
            }, 25);
          }
        }, 45);
      }
    }, 55);

    return () => {
      if (nameTimer !== null) {
        window.clearInterval(nameTimer);
      }

      if (commandTimer !== null) {
        window.clearInterval(commandTimer);
      }

      if (descriptionTimer !== null) {
        window.clearInterval(descriptionTimer);
      }
    };
  }, [profileDescription]);

  return (
    <section
      id="about"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/[0.025] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          className={`mb-14 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-cyan-300/40" />

            <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-cyan-300/60">
              01 / ABOUT
            </span>
          </div>

          <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            About Me
          </h2>

          <p className="mt-4 max-w-2xl font-mono text-xs leading-6 text-white/35">
            Security-focused developer with an interest in offensive security,
            defensive engineering, automation, and practical cybersecurity.
          </p>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* =================================================
              LEFT TERMINAL / DESCRIPTION
          ================================================= */}

          <div
            className={`flex flex-col rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-md transition-all duration-1000 sm:p-8 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >

            {/* Terminal header */}

            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
              </div>

              <span className="font-mono text-[9px] tracking-[0.2em] text-white/20">
                profile.sh
              </span>
            </div>

            {/* Terminal content */}

            <div className="pt-8">

              {/* whoami */}

              <div className="font-mono text-xs">
                <span className="text-cyan-300/50">$</span>{" "}
                <span className="text-white/40">
                  whoami
                </span>
              </div>

              {/* Name */}

              <div className="mt-2 min-h-[32px] font-mono text-lg font-bold text-cyan-200 sm:text-xl">
                {typedName}

                {typedName.length > 0 &&
                  typedName.length < "Rajesh Reddy".length && (
                    <span className="ml-1 inline-block h-5 w-px animate-pulse bg-cyan-300/70 align-middle" />
                  )}
              </div>

              {/* cat profile */}

              <div className="mt-7 font-mono text-xs">
                <span className="text-cyan-300/50">$</span>{" "}
                <span className="text-white/40">
                  {typedCommand}
                </span>

                {typedCommand.length > 0 &&
                  typedCommand.length < "cat profile.txt".length && (
                    <span className="ml-1 inline-block h-4 w-px animate-pulse bg-cyan-300/70 align-middle" />
                  )}
              </div>

              {/* =================================================
                  DESCRIPTION
                  NO FLEX CENTER
                  NO FLEX-1
                  NO 650PX HEIGHT
              ================================================= */}

              <div className="mt-8 w-full">

                <p className="mb-5 font-mono text-[7px] font-bold tracking-[0.2em] text-cyan-300/50">
                  PROFILE_DESCRIPTION
                </p>

                <p className="max-w-3xl whitespace-pre-wrap break-words font-mono text-sm leading-8 text-white/70 sm:text-base">
                  {typedDescription}

                  {profileDescription &&
                    typedDescription.length <
                      profileDescription.length && (
                      <span className="ml-1 inline-block h-5 w-px animate-pulse bg-cyan-300/70 align-middle" />
                    )}
                </p>

              </div>

              {/* Terminal cursor after complete description */}

              {profileDescription &&
                typedDescription.length >=
                  profileDescription.length && (
                  <div className="mt-6 font-mono text-xs text-cyan-300/50">
                    <span>$</span>

                    <span className="ml-2 inline-block h-4 w-px animate-pulse bg-cyan-300/60 align-middle" />
                  </div>
                )}

            </div>

            {/* Tags */}

            <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
              <Tag>CYBERSECURITY</Tag>
              <Tag>PYTHON</Tag>
              <Tag>NETWORK SECURITY</Tag>
              <Tag>THREAT DETECTION</Tag>
              <Tag>CTF</Tag>
            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className={`flex flex-col gap-6 transition-all delay-150 duration-1000 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >

            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-3 shadow-2xl backdrop-blur-md">

              <div
  ref={profileImageRef}
  className="group relative aspect-square overflow-hidden rounded-2xl bg-white/[0.02] [perspective:1200px]"
>

                {profileImage && !imageError ? (
                  <>
                    

                    <img
  src={profileImage}
  alt="Rajesh Reddy"
  className="h-full w-full object-cover animate-profile-float transition-transform duration-500 ease-out will-change-transform hover:scale-[1.05] hover:[transform:perspective(1000px)_rotateX(-3deg)_rotateY(5deg)_scale(1.05)]"
  onLoad={() => {
    console.log("PROFILE IMAGE LOADED:", profileImage);
  }}
  onError={() => {
    console.error("PROFILE IMAGE FAILED:", profileImage);
    setImageError(true);
  }}
/>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-center">

                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/10 bg-cyan-300/[0.03]">
                        <span className="font-mono text-2xl text-cyan-300/40">
                          RR
                        </span>
                      </div>

                      <p className="font-mono text-[9px] tracking-[0.2em] text-white/20">
                        PROFILE IMAGE
                      </p>

                    </div>
                  </div>
                )}

                {/* Image overlay */}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full border border-cyan-300/10 bg-black/50 px-3 py-1 font-mono text-[8px] tracking-[0.15em] text-cyan-200/60 backdrop-blur-md">
                    SECURITY ANALYST
                  </span>
                </div>

              </div>
            </div>

            {/* =================================================
                SECURITY FIRST
            ================================================= */}

            <InfoCard
              title="SECURITY FIRST"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              }
            >
              <p>
                Focused on identifying vulnerabilities, understanding attack
                paths, and building practical security solutions.
              </p>
            </InfoCard>

            {/* =================================================
                DEVELOPMENT
            ================================================= */}

            <InfoCard
              title="DEVELOPMENT"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path d="M8 9l-4 3 4 3" />
                  <path d="M16 9l4 3-4 3" />
                  <path d="M14 5l-4 14" />
                </svg>
              }
            >
              <p>
                Building security-focused Python projects, automation tools,
                and practical applications that solve real-world problems.
              </p>
            </InfoCard>

            {/* =================================================
                DEFENSIVE MINDSET
            ================================================= */}

            <InfoCard
              title="DEFENSIVE MINDSET"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path d="M12 3v18" />
                  <path d="M5 7h14" />
                  <path d="M7 7l-3 6h6L7 7z" />
                  <path d="M17 7l-3 6h6l-3-6z" />
                </svg>
              }
            >
              <p>
                Thinking like an attacker to understand threats while
                designing stronger defensive controls and monitoring.
              </p>
            </InfoCard>

            {/* =================================================
                CURRENT FOCUS
            ================================================= */}

            <div className="rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.025] p-6 backdrop-blur-md">

              <div className="mb-5 flex items-center justify-between">

                <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-cyan-300/60">
                  CURRENT_FOCUS
                </span>

                <span className="flex items-center gap-2 font-mono text-[8px] text-green-300/50">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-300/60" />
                  ACTIVE
                </span>

              </div>

              <div className="space-y-3">

                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-mono text-xs text-white/35">
                    Offensive Security
                  </span>

                  <span className="font-mono text-[9px] text-cyan-300/40">
                    LEARNING
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-mono text-xs text-white/35">
                    Python Security
                  </span>

                  <span className="font-mono text-[9px] text-cyan-300/40">
                    BUILDING
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/35">
                    Security Analysis
                  </span>

                  <span className="font-mono text-[9px] text-cyan-300/40">
                    EXPLORING
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}