"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  FileText,
  Fingerprint,
  Layers3,
  Radar,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";

export default function Resume() {
  const [visible, setVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = document.getElementById("resume");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const card = cardRef.current;

    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = ((y / rect.height) - 0.5) * -12;

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale3d(1.015,1.015,1.015)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;

    if (!card) return;

    card.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0)
      scale3d(1,1,1)
    `;
  };

  const handleDownload = () => {
    setDownloading(true);

    // Put your actual resume PDF inside /public
    // Example: /public/Rajesh_Reddy_Resume.pdf

    const link = document.createElement("a");
    link.href = "/Rajesh_Reddy_Resume.pdf";
    link.download = "Rajesh_Reddy_Resume.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      setDownloading(false);
    }, 1200);
  };

  return (
    <section
      id="resume"
      className="relative overflow-hidden border-y border-white/[0.04] bg-[#010405] py-28"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="resume-grid absolute inset-0" />

        <div className="absolute left-[8%] top-[20%] h-96 w-96 rounded-full bg-cyan-400/[0.025] blur-[150px]" />

        <div className="absolute bottom-[10%] right-[8%] h-96 w-96 rounded-full bg-blue-500/[0.025] blur-[150px]" />

        <div className="resume-particle left-[12%] top-[25%]" />
        <div className="resume-particle left-[24%] top-[70%]" />
        <div className="resume-particle right-[15%] top-[30%]" />
        <div className="resume-particle right-[25%] bottom-[20%]" />
        <div className="resume-particle left-[50%] top-[12%]" />

        <div className="resume-scan-line absolute left-0 right-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2">
            <Radar
              size={12}
              className="text-cyan-300"
            />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              RESUME // SECURE DOSSIER
            </span>
          </div>

          <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
            My{" "}
            <span className="text-cyan-300">
              Resume
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/50">
            A complete overview of my cybersecurity
            skills, projects, technical experience and
            professional profile.
          </p>
        </div>

        {/* =================================================
            3D RESUME SYSTEM
        ================================================== */}

        <div
          className={`relative mx-auto max-w-6xl transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-16 opacity-0"
          }`}
        >
          {/* 3D rings */}

          <div className="resume-ring ring-one" />
          <div className="resume-ring ring-two" />
          <div className="resume-ring ring-three" />

          {/* =================================================
              MAIN CARD
          ================================================== */}

          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="resume-3d-card relative mx-auto max-w-5xl rounded-[32px] border border-cyan-400/[0.12] bg-[#03090c]/90 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-7 lg:p-9"
          >
            <div className="pointer-events-none absolute -inset-px rounded-[32px] bg-gradient-to-br from-cyan-400/[0.08] via-transparent to-blue-500/[0.05]" />

            {/* Corners */}

            <div className="absolute left-4 top-4 h-5 w-5 border-l border-t border-cyan-300/30" />
            <div className="absolute right-4 top-4 h-5 w-5 border-r border-t border-cyan-300/30" />
            <div className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-cyan-300/30" />
            <div className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-cyan-300/30" />

            {/* =================================================
                TOP BAR
            ================================================== */}

            <div className="relative flex flex-col gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">
                  <Fingerprint
                    size={18}
                    className="text-cyan-300"
                  />
                </div>

                <div>
                  <p className="font-mono text-[7px] tracking-[0.16em] text-white/25">
                    SECURE PROFILE
                  </p>

                  <p className="mt-1 font-mono text-[9px] font-bold tracking-[0.12em] text-cyan-300">
                    RAJESH_REDDY.exe
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">
                <SystemIndicator
                  label="IDENTITY"
                  value="VERIFIED"
                />

                <SystemIndicator
                  label="STATUS"
                  value="READY"
                />
              </div>
            </div>

            {/* =================================================
                MAIN
            ================================================== */}

            <div className="relative mt-7 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">

              {/* =================================================
                  LEFT PROFILE
              ================================================== */}

              <div className="relative">

                <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">

                  {/* Outer rings */}

                  <div className="absolute inset-0 rounded-full border border-cyan-400/[0.10] animate-[spin_18s_linear_infinite]" />

                  <div className="absolute inset-5 rounded-full border border-dashed border-cyan-400/[0.10] animate-[spin_12s_linear_infinite_reverse]" />

                  <div className="absolute inset-12 rounded-full border border-cyan-400/[0.08]" />

                  {/* Orbit */}

                  <div className="absolute inset-3 animate-[spin_8s_linear_infinite]">
                    <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,1)]" />
                  </div>

                  {/* Core */}

                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/[0.035] shadow-[0_0_70px_rgba(34,211,238,0.10)]">

                    <div className="absolute inset-3 rounded-full border border-cyan-300/10" />

                    <ShieldCheck
                      size={58}
                      strokeWidth={1}
                      className="text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]"
                    />

                  </div>

                  <FloatingIcon
                    icon={<BrainCircuit size={14} />}
                    className="left-2 top-12"
                  />

                  <FloatingIcon
                    icon={<BriefcaseBusiness size={14} />}
                    className="right-2 top-16"
                  />

                  <FloatingIcon
                    icon={<Layers3 size={14} />}
                    className="bottom-12 left-6"
                  />

                  <FloatingIcon
                    icon={<BadgeCheck size={14} />}
                    className="bottom-10 right-7"
                  />

                </div>

                {/* Identity */}

                <div className="mt-3 text-center">
                  <p className="font-mono text-[7px] tracking-[0.18em] text-cyan-300/60">
                    CYBERSECURITY PROFILE
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    Rajesh Reddy
                  </h3>

                  <p className="mt-2 text-sm font-medium text-white/45">
                    Junior Cybersecurity Analyst
                  </p>
                </div>

              </div>

              {/* =================================================
                  RIGHT
              ================================================== */}

              <div className="space-y-5">

                {/* Profile */}

                <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">

                  <div className="mb-4 flex items-center gap-2">

                    <Terminal
                      size={12}
                      className="text-cyan-300"
                    />

                    <span className="font-mono text-[7px] font-bold tracking-[0.16em] text-cyan-300">
                      PROFILE SUMMARY
                    </span>

                  </div>

                  <p className="text-xs leading-6 text-white/50">
                    Aspiring Junior Cybersecurity Analyst
                    with practical experience in threat
                    detection, vulnerability analysis,
                    network security, malware analysis and
                    Python-based security projects.
                  </p>

                </div>

                {/* =================================================
                    LIVE COUNTING STATS
                ================================================== */}

                <div className="grid gap-3 sm:grid-cols-3">

                  <LiveResumeStat
                    target={3}
                    label="PROJECTS"
                    visible={visible}
                  />

                  <LiveResumeStat
                    target={2}
                    label="INTERNSHIPS"
                    visible={visible}
                  />

                  <LiveResumeStat
                    target={4}
                    label="SECURITY AREAS"
                    visible={visible}
                    suffix="+"
                  />

                </div>

                {/* Core */}

                <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">

                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <Sparkles
                        size={12}
                        className="text-cyan-300"
                      />

                      <span className="font-mono text-[7px] font-bold tracking-[0.16em] text-white/35">
                        CORE CAPABILITIES
                      </span>

                    </div>

                    <span className="font-mono text-[6px] text-emerald-400">
                      ONLINE
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {[
                      "Threat Detection",
                      "Network Security",
                      "Python",
                      "Malware Analysis",
                      "Risk Assessment",
                      "Vulnerability Analysis",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.025] px-3 py-2 font-mono text-[6px] font-bold text-white/50 transition-all duration-300 hover:border-cyan-300/25 hover:text-cyan-200"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>
                </div>

                {/* Download */}

                <button
                  type="button"
                  onClick={handleDownload}
                  className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.035] px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/[0.06] hover:shadow-[0_20px_50px_rgba(34,211,238,0.08)]"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05]">
                      <FileText
                        size={16}
                        className="text-cyan-300"
                      />
                    </div>

                    <div className="text-left">

                      <p className="font-mono text-[8px] font-bold tracking-[0.14em] text-white">
                        {downloading
                          ? "DOWNLOADING..."
                          : "DOWNLOAD RESUME"}
                      </p>

                      <p className="mt-1 font-mono text-[6px] tracking-[0.1em] text-white/25">
                        PDF // SECURE DOCUMENT
                      </p>

                    </div>

                  </div>

                  <ArrowDownToLine
                    size={17}
                    className={`text-cyan-300 transition-all duration-300 ${
                      downloading
                        ? "animate-bounce"
                        : "group-hover:translate-y-1"
                    }`}
                  />

                  <span className="absolute bottom-0 left-0 h-px w-0 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,1)] transition-all duration-500 group-hover:w-full" />

                </button>

              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="relative mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                <span className="font-mono text-[6px] tracking-[0.14em] text-emerald-400/70">
                  DOCUMENT VERIFIED
                </span>

              </div>

              <span className="font-mono text-[6px] tracking-[0.14em] text-white/20">
                SECURITY_DOSSIER // 2026
              </span>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style jsx>{`
        .resume-grid {
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

          background-size: 52px 52px;

          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 80%
          );
        }

        .resume-3d-card {
          transform-style: preserve-3d;

          transition:
            transform 0.18s ease-out,
            box-shadow 0.4s ease;

          will-change: transform;
        }

        .resume-ring {
          position: absolute;
          left: 50%;
          top: 50%;

          border: 1px solid rgba(34, 211, 238, 0.06);

          border-radius: 50%;

          transform: translate(-50%, -50%);

          pointer-events: none;
        }

        .ring-one {
          width: 92%;
          height: 92%;

          animation: ringPulse 6s ease-in-out infinite;
        }

        .ring-two {
          width: 75%;
          height: 75%;

          border-style: dashed;

          animation: ringRotate 24s linear infinite;
        }

        .ring-three {
          width: 58%;
          height: 58%;

          animation: ringRotateReverse 18s linear infinite;
        }

        .resume-scan-line {
          height: 1px;

          top: 0;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.25),
            transparent
          );

          box-shadow:
            0 0 18px rgba(34, 211, 238, 0.15);

          animation: scan 7s linear infinite;
        }

        .resume-particle {
          position: absolute;

          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: rgba(103, 232, 249, 0.6);

          box-shadow:
            0 0 12px rgba(34, 211, 238, 0.7);

          animation:
            particle 5s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              scale(1);

            opacity: 0.35;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.04);

            opacity: 0.7;
          }
        }

        @keyframes ringRotate {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes ringRotateReverse {
          from {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(0);
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          90% {
            opacity: 1;
          }

          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes particle {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.25;
          }

          50% {
            transform: translate3d(0, -18px, 0);
            opacity: 1;
          }
        }

        @keyframes liveNumber {
          0% {
            transform: translateY(8px);
            opacity: 0.2;
          }

          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .resume-3d-card,
          .resume-ring,
          .resume-scan-line,
          .resume-particle {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   LIVE RESUME STAT
========================================================= */

function LiveResumeStat({
  target,
  label,
  visible,
  suffix = "",
}: {
  target: number;
  label: string;
  visible: boolean;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCount(0);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    /*
      FAST COUNT
      350ms = quick live counter
    */

    const duration = 350;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      /*
        Ease-out effect:
        starts fast and smoothly stops
      */

      const eased =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        eased * target
      );

      setCount(currentValue);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [visible, target]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]">

      {/* animated glow */}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* LIVE indicator */}

      <div className="mb-2 flex items-center justify-center gap-1.5">

        <span className="relative flex h-1.5 w-1.5">

          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />

          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />

        </span>

        <span className="font-mono text-[5px] tracking-[0.12em] text-emerald-400/60">
          LIVE
        </span>

      </div>

      {/* NUMBER */}

      <div
        key={count}
        className="relative"
        style={{
          animation:
            "liveNumber 0.12s ease-out",
        }}
      >
        <p className="font-mono text-3xl font-black tracking-tight text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.35)]">
          {count}
          {suffix}
        </p>
      </div>

      {/* LABEL */}

      <p className="mt-1 font-mono text-[6px] tracking-[0.12em] text-white/25">
        {label}
      </p>

      {/* bottom line */}

      <div className="mx-auto mt-3 h-px w-8 bg-cyan-300/30 transition-all duration-500 group-hover:w-16 group-hover:bg-cyan-300/70" />

    </div>
  );
}

/* =========================================================
   SYSTEM INDICATOR
========================================================= */

function SystemIndicator({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="font-mono text-[5px] tracking-[0.12em] text-white/20">
        {label}
      </p>

      <p className="mt-1 font-mono text-[6px] font-bold text-emerald-400">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   FLOATING ICON
========================================================= */

function FloatingIcon({
  icon,
  className,
}: {
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`absolute flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#041014]/90 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.08)] ${className}`}
      style={{
        animation:
          "floatIcon 4s ease-in-out infinite",
      }}
    >
      {icon}
    </div>
  );
}