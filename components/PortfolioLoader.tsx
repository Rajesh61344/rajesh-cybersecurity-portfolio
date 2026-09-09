"use client";

import { useEffect, useState } from "react";

interface PortfolioLoaderProps {
  onComplete: () => void;
}

export default function PortfolioLoader({
  onComplete,
}: PortfolioLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");

  const welcomeText = "Welcome to Rajesh Reddy's Portfolio";

  // Typing animation
  useEffect(() => {
    let index = 0;

    const typingInterval = window.setInterval(() => {
      if (index < welcomeText.length) {
        index += 1;
        setTypedText(welcomeText.slice(0, index));
      } else {
        window.clearInterval(typingInterval);
      }
    }, 55);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, []);

  // Loading progress
  useEffect(() => {
    let current = 0;

    const interval = window.setInterval(() => {
      const increment = Math.floor(Math.random() * 7) + 3;

      current += increment;

      if (current >= 100) {
        current = 100;

        window.clearInterval(interval);

        window.setTimeout(() => {
          onComplete();
        }, 500);
      }

      setProgress(current);
    }, 90);

    return () => {
      window.clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#010405]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[120px]" />

        <div className="absolute left-[15%] top-[20%] h-[180px] w-[180px] rounded-full bg-blue-500/[0.025] blur-[100px]" />

        <div className="absolute bottom-[15%] right-[15%] h-[200px] w-[200px] rounded-full bg-cyan-400/[0.025] blur-[100px]" />
      </div>

      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-[min(92vw,620px)] text-center">
        {/* ================================
            3D LOADING CORE
        ================================= */}

        <div className="relative mx-auto h-48 w-48 [perspective:800px]">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-full bg-cyan-300/[0.025] blur-2xl" />

          {/* 3D curved orbit 1 */}
          <div
            className="absolute inset-2 rounded-full border border-cyan-300/20"
            style={{
              transform: "rotateX(68deg) rotateZ(15deg)",
              boxShadow:
                "0 0 25px rgba(34,211,238,0.12), inset 0 0 25px rgba(34,211,238,0.04)",
              animation: "loaderOrbitOne 4s linear infinite",
            }}
          >
            <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)]" />
          </div>

          {/* 3D curved orbit 2 */}
          <div
            className="absolute inset-5 rounded-full border border-blue-400/20"
            style={{
              transform: "rotateY(68deg) rotateZ(-20deg)",
              boxShadow:
                "0 0 25px rgba(59,130,246,0.10), inset 0 0 20px rgba(59,130,246,0.04)",
              animation: "loaderOrbitTwo 5s linear infinite",
            }}
          >
            <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(96,165,250,1)]" />
          </div>

          {/* 3D curved orbit 3 */}
          <div
            className="absolute inset-8 rounded-full border border-cyan-200/15"
            style={{
              transform: "rotateX(65deg) rotateY(35deg)",
              animation: "loaderOrbitThree 3.5s linear infinite reverse",
            }}
          >
            <span className="absolute right-[15%] top-[8%] h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,1)]" />
          </div>

          {/* Center 3D cube */}
          <div
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.035] shadow-[0_0_40px_rgba(34,211,238,0.14),inset_0_0_30px_rgba(34,211,238,0.05)]"
            style={{
              transformStyle: "preserve-3d",
              animation: "loaderCore 3s ease-in-out infinite",
            }}
          >
            {/* Inner cube */}
            <div
              className="absolute h-14 w-14 rounded-xl border border-cyan-300/30 bg-cyan-300/[0.025]"
              style={{
                transform: "translateZ(18px)",
                boxShadow: "0 0 25px rgba(34,211,238,0.12)",
              }}
            />

            <span className="relative z-10 text-2xl font-black tracking-tight text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]">
              RR
            </span>
          </div>

          {/* Corner brackets */}
          <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan-300/30" />
          <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan-300/30" />
          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan-300/30" />
          <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan-300/30" />
        </div>

        {/* ================================
            TITLE
        ================================= */}

        <div className="mt-7">
          <p className="font-mono text-[8px] font-bold tracking-[0.35em] text-cyan-300/60">
            CYBERSECURITY PORTFOLIO
          </p>

          <h1 className="mt-3 min-h-[42px] px-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {typedText}
            <span className="ml-1 inline-block h-6 w-[2px] animate-pulse bg-cyan-300 align-middle shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
          </h1>

          <p className="mt-3 font-mono text-[7px] tracking-[0.2em] text-white/30">
            JUNIOR CYBERSECURITY ANALYST
          </p>
        </div>

        {/* ================================
            STATUS + PERCENTAGE
        ================================= */}

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />

            <span className="font-mono text-[6px] font-bold tracking-[0.15em] text-emerald-400/70">
              {progress < 100
                ? "SYSTEM INITIALIZING"
                : "SYSTEM ONLINE"}
            </span>
          </div>

          <span className="h-3 w-px bg-white/10" />

          <span className="min-w-[38px] text-right font-mono text-[8px] font-bold text-cyan-300">
            {progress}%
          </span>
        </div>

        {/* ================================
            CURVED LOADING INDICATOR
        ================================= */}

        <div className="relative mx-auto mt-6 h-10 w-[min(80vw,360px)]">
          {/* Curved track */}
          <svg
            viewBox="0 0 360 40"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {/* Background curve */}
            <path
              d="M 8 30 Q 90 2 180 20 T 352 10"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />

            {/* Progress curve */}
            <path
              d="M 8 30 Q 90 2 180 20 T 352 10"
              fill="none"
              stroke="rgba(34,211,238,0.75)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - progress}
              style={{
                filter:
                  "drop-shadow(0 0 7px rgba(34,211,238,0.75))",
                transition: "stroke-dashoffset 120ms linear",
              }}
            />

            {/* Moving dot */}
            <circle
              cx={8 + (344 * progress) / 100}
              cy={30 - (20 * progress) / 100}
              r="3"
              fill="rgb(103,232,249)"
              style={{
                filter:
                  "drop-shadow(0 0 8px rgba(34,211,238,1))",
                transition: "cx 120ms linear, cy 120ms linear",
              }}
            />
          </svg>

          {/* Reflection */}
          <div className="absolute left-[10%] right-[10%] top-8 h-4 rounded-full bg-cyan-300/[0.04] blur-xl" />
        </div>

        <p className="mt-2 font-mono text-[6px] tracking-[0.16em] text-white/20">
          {progress < 100
            ? "ESTABLISHING SECURE CONNECTION..."
            : "SECURE CONNECTION ESTABLISHED"}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-7 left-0 right-0 text-center">
        <span className="font-mono text-[5px] tracking-[0.3em] text-white/15">
          RAJESH_REDDY // SECURE_NODE // 2026
        </span>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes loaderOrbitOne {
          0% {
            transform: rotateX(68deg) rotateZ(0deg);
          }

          100% {
            transform: rotateX(68deg) rotateZ(360deg);
          }
        }

        @keyframes loaderOrbitTwo {
          0% {
            transform: rotateY(68deg) rotateZ(0deg);
          }

          100% {
            transform: rotateY(68deg) rotateZ(360deg);
          }
        }

        @keyframes loaderOrbitThree {
          0% {
            transform: rotateX(65deg) rotateY(35deg) rotateZ(0deg);
          }

          100% {
            transform: rotateX(65deg) rotateY(35deg) rotateZ(360deg);
          }
        }

        @keyframes loaderCore {
          0%,
          100% {
            transform: translate(-50%, -50%) rotateX(0deg)
              rotateY(0deg) scale(1);
          }

          50% {
            transform: translate(-50%, -50%) rotateX(12deg)
              rotateY(18deg) scale(1.06);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}