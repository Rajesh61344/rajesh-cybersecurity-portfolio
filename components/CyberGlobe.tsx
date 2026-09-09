"use client";

import { useEffect, useState } from "react";

const nodes = [
  { left: 50, top: 8, delay: "0s" },
  { left: 72, top: 14, delay: "0.2s" },
  { left: 88, top: 28, delay: "0.4s" },
  { left: 94, top: 50, delay: "0.6s" },
  { left: 87, top: 72, delay: "0.8s" },
  { left: 72, top: 86, delay: "1s" },
  { left: 50, top: 92, delay: "1.2s" },
  { left: 28, top: 86, delay: "1.4s" },
  { left: 13, top: 72, delay: "1.6s" },
  { left: 6, top: 50, delay: "1.8s" },
  { left: 13, top: 28, delay: "2s" },
  { left: 28, top: 14, delay: "2.2s" },

  { left: 50, top: 22, delay: "0.3s" },
  { left: 68, top: 30, delay: "0.6s" },
  { left: 78, top: 50, delay: "0.9s" },
  { left: 68, top: 70, delay: "1.2s" },
  { left: 50, top: 78, delay: "1.5s" },
  { left: 32, top: 70, delay: "1.8s" },
  { left: 22, top: 50, delay: "2.1s" },
  { left: 32, top: 30, delay: "2.4s" },
];

export default function CyberGlobe() {
  const [activeNodes, setActiveNodes] = useState(12);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveNodes((current) => (current >= 19 ? 9 : current + 1));
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[380px] w-full sm:h-[430px] md:h-[500px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.045] blur-[70px] sm:h-64 sm:w-64" />

      {/* Globe container */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 sm:h-72 sm:w-72 md:h-80 md:w-80">
        {/* Outer orbit */}
        <div className="orbit orbit-one absolute left-1/2 top-1/2 h-[115%] w-[115%] rounded-full border border-cyan-400/10" />

        {/* Second orbit */}
        <div className="orbit orbit-two absolute left-1/2 top-1/2 h-[105%] w-[125%] rounded-full border border-cyan-400/10" />

        {/* Third orbit */}
        <div className="orbit orbit-three absolute left-1/2 top-1/2 h-[100%] w-[110%] rounded-full border border-cyan-400/[0.06]" />

        {/* Globe */}
        <div
          className="absolute inset-0 overflow-hidden rounded-full border border-cyan-400/20 bg-[#061012]"
          style={{
            boxShadow:
              "inset 0 0 45px rgba(34,211,238,0.06), 0 0 35px rgba(34,211,238,0.04)",
          }}
        >
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-[12%] rounded-full bg-cyan-400/[0.025] blur-2xl" />

          {/* Latitude */}
          <div className="absolute left-[8%] top-[30%] h-px w-[84%] bg-cyan-400/10" />

          <div className="absolute left-[8%] top-1/2 h-px w-[84%] bg-cyan-400/10" />

          <div className="absolute left-[8%] top-[70%] h-px w-[84%] bg-cyan-400/10" />

          {/* Longitude */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-400/10" />

          <div className="absolute left-1/2 top-0 h-full w-[56%] -translate-x-1/2 rounded-full border-x border-cyan-400/[0.08]" />

          {/* Network nodes */}
          {nodes.map((node, index) => (
            <span
              key={`${node.left}-${node.top}-${index}`}
              className={`node absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 ${
                index < activeNodes ? "active-node" : "opacity-20"
              }`}
              style={{
                left: `${node.left}%`,
                top: `${node.top}%`,
                animationDelay: node.delay,
              }}
            />
          ))}

          {/* Connection lines */}
          <div className="absolute left-[25%] top-[42%] h-px w-[25%] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

          <div className="absolute left-1/2 top-[42%] h-[15%] w-px bg-cyan-400/10" />

          <div className="absolute left-1/2 top-[58%] h-px w-[25%] bg-gradient-to-r from-cyan-400/20 via-transparent to-transparent" />

          {/* Center core */}
          <div className="absolute left-1/2 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.8)] sm:h-5 sm:w-5" />

          <div className="core-ring absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15" />

          {/* Scan line */}
          <div className="scan-line pointer-events-none absolute left-0 top-0 h-px w-full bg-cyan-400/30" />
        </div>
      </div>

      {/* Top status */}
      <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-cyan-400/15 bg-[#050708]/95 px-3 py-2 sm:top-5 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400 opacity-30" />
            <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
          </span>

          <span className="whitespace-nowrap font-mono text-[7px] tracking-[0.15em] text-cyan-400 sm:text-[8px]">
            SECURITY SYSTEM ONLINE
          </span>
        </div>
      </div>

      {/* Left status */}
      <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-lg border border-white/5 bg-[#050708]/95 p-3 sm:block">
        <p className="font-mono text-[7px] text-slate-700">
          NETWORK
        </p>

        <p className="mt-1 font-mono text-[9px] text-cyan-400">
          SECURE
        </p>

        <div className="mt-3 h-px w-12 bg-cyan-400/10" />

        <p className="mt-2 font-mono text-[6px] text-slate-700">
          ENCRYPTION
        </p>

        <p className="mt-1 font-mono text-[7px] text-slate-500">
          ACTIVE
        </p>
      </div>

      {/* Right status */}
      <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-lg border border-white/5 bg-[#050708]/95 p-3 text-right sm:block">
        <p className="font-mono text-[7px] text-slate-700">
          NODES
        </p>

        <p className="mt-1 font-mono text-[9px] text-cyan-400">
          {activeNodes} ACTIVE
        </p>

        <div className="ml-auto mt-3 h-px w-12 bg-cyan-400/10" />

        <p className="mt-2 font-mono text-[6px] text-slate-700">
          THREAT
        </p>

        <p className="mt-1 font-mono text-[7px] text-slate-500">
          MONITORING
        </p>
      </div>

      {/* Bottom label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center sm:bottom-5">
        <p className="whitespace-nowrap font-mono text-[6px] tracking-[0.15em] text-slate-700 sm:text-[7px] sm:tracking-[0.2em]">
          CYBERSECURITY // THREAT INTELLIGENCE // ANALYSIS
        </p>
      </div>

      <style jsx>{`
        .orbit {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          will-change: transform;
        }

        .orbit-one {
          transform: translate(-50%, -50%) rotateX(65deg);
          animation: orbitOne 16s linear infinite;
        }

        .orbit-two {
          transform: translate(-50%, -50%) rotateY(65deg);
          animation: orbitTwo 20s linear infinite;
        }

        .orbit-three {
          transform: translate(-50%, -50%) rotateZ(35deg);
          animation: orbitThree 24s linear infinite;
        }

        .node {
          box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
          will-change: opacity, transform;
        }

        .active-node {
          animation: nodePulse 2.5s ease-in-out infinite;
        }

        .core-ring {
          animation: corePulse 2.5s ease-in-out infinite;
        }

        .scan-line {
          animation: scanLine 4s linear infinite;
        }

        @keyframes orbitOne {
          from {
            transform: translate(-50%, -50%) rotateX(65deg) rotateZ(0deg);
          }

          to {
            transform: translate(-50%, -50%) rotateX(65deg) rotateZ(360deg);
          }
        }

        @keyframes orbitTwo {
          from {
            transform: translate(-50%, -50%) rotateY(65deg) rotateZ(360deg);
          }

          to {
            transform: translate(-50%, -50%) rotateY(65deg) rotateZ(0deg);
          }
        }

        @keyframes orbitThree {
          from {
            transform: translate(-50%, -50%) rotateZ(35deg);
          }

          to {
            transform: translate(-50%, -50%) rotateZ(395deg);
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.8);
          }

          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.35);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(0.85);
          }

          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes scanLine {
          0% {
            top: 0%;
            opacity: 0;
          }

          10% {
            opacity: 0.6;
          }

          50% {
            opacity: 0.25;
          }

          90% {
            opacity: 0.6;
          }

          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .orbit,
          .active-node,
          .core-ring,
          .scan-line {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}