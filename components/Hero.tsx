"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Download,
  LockKeyhole,
  ShieldCheck,
  Terminal,
} from "lucide-react";

const roles = [
  "Junior Cybersecurity Analyst",
  "Security Analyst",
  "Cybersecurity Enthusiast",
  "Python Security Developer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];

    const typingSpeed = isDeleting ? 45 : 85;

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentRole.slice(
          0,
          displayText.length + 1
        );

        setDisplayText(nextText);

        if (nextText === currentRole) {
          setIsDeleting(true);
        }
      } else {
        const nextText = currentRole.slice(
          0,
          Math.max(0, displayText.length - 1)
        );

        setDisplayText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setRoleIndex(
            (previous) =>
              (previous + 1) % roles.length
          );
        }
      }
    }, typingSpeed);

    return () => {
      window.clearTimeout(timer);
    };
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="
        relative
        flex
        min-h-screen
        items-center
        overflow-hidden
        px-6
        py-24
        md:px-10
        lg:px-16
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          overflow-hidden
        "
      >
        {/* Cyber grid */}

        <div className="cyber-grid absolute inset-0 opacity-70" />

        {/* Cyan glow */}

        <div
          className="
            absolute
            left-[8%]
            top-[18%]
            h-72
            w-72
            rounded-full
            bg-cyan-400/10
            blur-[110px]
            animate-pulse
          "
        />

        {/* Blue glow */}

        <div
          className="
            absolute
            bottom-[12%]
            right-[8%]
            h-80
            w-80
            rounded-full
            bg-blue-500/10
            blur-[120px]
            animate-pulse
          "
        />

        {/* Center glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-56
            w-56
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-400/5
            blur-[100px]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          mx-auto
          grid
          w-full
          max-w-7xl
          items-center
          gap-14
          lg:grid-cols-[1.15fr_0.85fr]
        "
      >
        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="relative z-10">
          {/* Status */}

          <div
            className="
              mb-7
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/[0.04]
              px-4
              py-2
              text-xs
              font-medium
              tracking-[0.18em]
              text-cyan-200
              shadow-[0_0_25px_rgba(34,211,238,0.06)]
              backdrop-blur-xl
            "
          >
            <span className="live-dot" />

            <span>CYBERSECURITY PORTFOLIO</span>
          </div>

          {/* =================================================
              NAME
          ================================================= */}

          <div className="main-title-wrap overflow-visible">
            <h1
              className="
                main-title
                whitespace-nowrap
              "
            >
              Rajesh Reddy
            </h1>
          </div>

          {/* =================================================
              TYPING ROLE
          ================================================= */}

          <div
            className="
              mt-8
              flex
              min-h-[42px]
              items-center
              text-xl
              font-bold
              tracking-tight
              sm:text-2xl
              md:text-3xl
            "
            aria-live="polite"
          >
            <span className="typing-text">
              {displayText}
            </span>

            <span
              aria-hidden="true"
              className="typing-cursor"
            />
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-white/60
              sm:text-base
              sm:leading-8
            "
          >
            Aspiring cybersecurity professional focused on
            security monitoring, threat detection,
            Python-based security tools, vulnerability
            analysis, and practical defensive security.
          </p>

          {/* =================================================
              QUICK STATS
          ================================================= */}

          <div
            className="
              mt-8
              grid
              max-w-2xl
              grid-cols-1
              gap-3
              sm:grid-cols-3
            "
          >
            {/* Security */}

            <div className="cyber-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    text-cyan-300
                  "
                >
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Focus
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    Security
                  </p>
                </div>
              </div>
            </div>

            {/* Python */}

            <div className="cyber-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-blue-400/20
                    bg-blue-400/10
                    text-blue-300
                  "
                >
                  <Terminal size={18} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Language
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    Python
                  </p>
                </div>
              </div>
            </div>

            {/* Monitoring */}

            <div className="cyber-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-emerald-400/20
                    bg-emerald-400/10
                    text-emerald-300
                  "
                >
                  <Activity size={18} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-9 flex flex-wrap gap-4">
            {/* Projects */}

            <a
              href="#projects"
              className="
                cyber-button
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                px-6
                py-3.5
                text-sm
                font-semibold
                text-cyan-100
              "
            >
              <span>Explore Projects</span>

              <ArrowRight
                size={17}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </a>

            {/* Contact */}

            <a
              href="#contact"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.025]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white/80
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-400/30
                hover:bg-cyan-400/[0.05]
                hover:text-cyan-100
                hover:shadow-[0_12px_35px_rgba(34,211,238,0.08)]
              "
            >
              <span>Let's Connect</span>

              <LockKeyhole
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:rotate-6
                "
              />
            </a>

            {/* Resume */}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-white/10
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white/65
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-400/30
                hover:text-blue-200
              "
            >
              <Download
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-y-0.5
                "
              />

              Resume
            </a>
          </div>
        </div>

        {/* ===================================================
            RIGHT SECURITY VISUAL
        =================================================== */}

        <div
          className="
            relative
            hidden
            min-h-[430px]
            items-center
            justify-center
            lg:flex
          "
        >
          {/* Outer glow */}

          <div
            aria-hidden="true"
            className="
              absolute
              h-80
              w-80
              rounded-full
              bg-cyan-400/5
              blur-[90px]
            "
          />

          {/* 3D scene */}

          <div
            className="
              relative
              h-[380px]
              w-[380px]
              [perspective:1200px]
            "
          >
            {/* Rotating ring */}

            <div
              aria-hidden="true"
              className="
                absolute
                inset-[18px]
                rounded-full
                border
                border-cyan-400/10
                [transform-style:preserve-3d]
                animate-[spin_18s_linear_infinite]
              "
            />

            {/* Second rotating ring */}

            <div
              aria-hidden="true"
              className="
                absolute
                inset-[45px]
                rounded-full
                border
                border-blue-400/10
                [transform-style:preserve-3d]
                animate-[spin_14s_linear_infinite_reverse]
              "
            />

            {/* Main card */}

            <div
              className="
                cyber-3d
                cyber-card
                absolute
                left-1/2
                top-1/2
                w-[290px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-3xl
                p-6
                shadow-[0_30px_80px_rgba(0,0,0,0.45)]
              "
            >
              {/* Card header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/5
                  pb-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-cyan-400/20
                      bg-cyan-400/10
                      text-cyan-300
                      shadow-[0_0_20px_rgba(34,211,238,0.08)]
                    "
                  >
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      SECURITY
                    </p>

                    <p className="mt-0.5 text-[10px] tracking-widest text-white/35">
                      MONITOR
                    </p>
                  </div>
                </div>

                <span className="live-dot" />
              </div>

              {/* Main security visual */}

              <div className="relative mt-7 flex justify-center">
                <div
                  className="
                    flex
                    h-36
                    w-36
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-400/[0.025]
                    shadow-[0_0_50px_rgba(34,211,238,0.08)]
                  "
                >
                  <div
                    className="
                      flex
                      h-24
                      w-24
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-blue-400/20
                      bg-blue-400/[0.04]
                    "
                  >
                    <ShieldCheck
                      size={48}
                      strokeWidth={1.2}
                      className="
                        text-cyan-300
                        drop-shadow-[0_0_14px_rgba(34,211,238,0.55)]
                      "
                    />
                  </div>
                </div>

                {/* Orbit dot */}

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    left-1/2
                    top-0
                    h-2
                    w-2
                    -translate-x-1/2
                    rounded-full
                    bg-cyan-300
                    shadow-[0_0_15px_rgba(34,211,238,1)]
                    animate-pulse
                  "
                />
              </div>

              {/* Security metrics */}

              <div className="mt-7 space-y-3">
                {/* Threat */}

                <div>
                  <div className="mb-1.5 flex justify-between text-[10px]">
                    <span className="text-white/40">
                      THREAT MONITORING
                    </span>

                    <span className="text-cyan-300">
                      ACTIVE
                    </span>
                  </div>

                  <div className="h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="
                        h-full
                        w-[86%]
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-400
                        to-blue-500
                        shadow-[0_0_10px_rgba(34,211,238,0.5)]
                      "
                    />
                  </div>
                </div>

                {/* Security */}

                <div>
                  <div className="mb-1.5 flex justify-between text-[10px]">
                    <span className="text-white/40">
                      SECURITY STATUS
                    </span>

                    <span className="text-emerald-300">
                      SECURE
                    </span>
                  </div>

                  <div className="h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="
                        h-full
                        w-[94%]
                        rounded-full
                        bg-gradient-to-r
                        from-emerald-400
                        to-cyan-400
                        shadow-[0_0_10px_rgba(52,211,153,0.35)]
                      "
                    />
                  </div>
                </div>
              </div>

              {/* Card footer */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/5
                  pt-4
                "
              >
                <span className="terminal-text text-[9px] text-white/30">
                  SYS://ONLINE
                </span>

                <span className="text-[9px] text-cyan-300/70">
                  MONITORING
                </span>
              </div>
            </div>

            {/* Floating node 1 */}

            <div
              className="
                absolute
                left-0
                top-24
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-cyan-400/15
                bg-black/40
                text-cyan-300
                shadow-[0_0_25px_rgba(34,211,238,0.08)]
                backdrop-blur-xl
                cyber-float
              "
            >
              <Terminal size={19} />
            </div>

            {/* Floating node 2 */}

            <div
              className="
                absolute
                bottom-20
                right-0
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                border
                border-blue-400/15
                bg-black/40
                text-blue-300
                shadow-[0_0_25px_rgba(59,130,246,0.08)]
                backdrop-blur-xl
                cyber-float
              "
              style={{
                animationDelay: "0.8s",
              }}
            >
              <Activity size={19} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="
          absolute
          bottom-8
          left-1/2
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-2
          text-white/25
          transition-colors
          duration-300
          hover:text-cyan-300/70
          md:flex
        "
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">
          Scroll
        </span>

        <span
          aria-hidden="true"
          className="
            h-10
            w-px
            bg-gradient-to-b
            from-cyan-400/50
            to-transparent
            animate-pulse
          "
        />
      </a>
    </section>
  );
}