
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type NodePoint = {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  delay: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

const events = [
  "AUTH_CHECK",
  "PACKET_SCAN",
  "PORT_MONITOR",
  "THREAT_SCAN",
  "FIREWALL_OK",
  "SESSION_SECURE",
];

export default function LiveCyberScene() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  });

  const [liveTime, setLiveTime] = useState("");
  const [eventIndex, setEventIndex] = useState(0);

  const nodes = useMemo<NodePoint[]>(() => {
    return Array.from({ length: 38 }, (_, index) => {
      const angle = (index / 38) * Math.PI * 2;

      const radius =
        30 + Math.sin(index * 1.9) * 8;

      return {
        id: index,
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
        z: Math.sin(angle * 1.7) * 35,
        size: 2 + (index % 3),
        delay: index * 0.09,
      };
    });
  }, []);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 55 }, (_, index) => ({
      id: index,
      x: (index * 47.13) % 100,
      y: (index * 73.17) % 100,
      size: 1 + (index % 2),
      delay: (index % 15) * 0.2,
      duration: 3 + (index % 5),
    }));
  }, []);

  useEffect(() => {
    const updateTime = () => {
      setLiveTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();

    const timer = window.setInterval(
      updateTime,
      1000
    );

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setEventIndex(
        (previous) =>
          (previous + 1) % events.length
      );
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const handleMove = (event: MouseEvent) => {
      const rect = scene.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      setRotation({
        x: y * -10,
        y: x * 13,
      });
    };

    const reset = () => {
      setRotation({
        x: 0,
        y: 0,
      });
    };

    scene.addEventListener(
      "mousemove",
      handleMove
    );

    scene.addEventListener(
      "mouseleave",
      reset
    );

    return () => {
      scene.removeEventListener(
        "mousemove",
        handleMove
      );

      scene.removeEventListener(
        "mouseleave",
        reset
      );
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="relative h-[440px] w-full overflow-hidden rounded-3xl border border-cyan-400/[0.09] bg-[#020607] sm:h-[520px] lg:h-[620px]"
      style={{
        perspective: "1200px",
      }}
    >
      {/* BACKGROUND GRID */}

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(34,211,238,0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34,211,238,0.04) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "45px 45px",
          maskImage:
            "radial-gradient(circle, black, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(circle, black, transparent 82%)",
        }}
      />

      {/* AMBIENT LIGHT */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.04] blur-[120px]" />

      {/* PARTICLES */}

      <div className="pointer-events-none absolute inset-0">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-cyan-300/50"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `particleFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
              boxShadow:
                "0 0 8px rgba(34,211,238,.5)",
            }}
          />
        ))}
      </div>

      {/* 3D WORLD */}

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
          `,
          transition:
            "transform 450ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        {/* ORBIT */}

        <div
          className="absolute h-[250px] w-[250px] rounded-full border border-cyan-400/[0.13] sm:h-[320px] sm:w-[320px] lg:h-[380px] lg:w-[380px]"
          style={{
            transform:
              "rotateX(68deg) rotateZ(20deg)",
            animation:
              "orbitA 12s linear infinite",
          }}
        />

        <div
          className="absolute h-[280px] w-[280px] rounded-full border border-cyan-400/[0.08] sm:h-[350px] sm:w-[350px] lg:h-[410px] lg:w-[410px]"
          style={{
            transform:
              "rotateY(70deg)",
            animation:
              "orbitB 16s linear infinite reverse",
          }}
        />

        <div
          className="absolute h-[190px] w-[190px] rounded-full border border-blue-400/[0.1] sm:h-[260px] sm:w-[260px]"
          style={{
            transform:
              "rotateX(50deg) rotateY(45deg)",
            animation:
              "orbitC 9s linear infinite",
          }}
        />

        {/* CORE */}

        <div className="relative flex h-40 w-40 items-center justify-center rounded-full sm:h-48 sm:w-48 lg:h-56 lg:w-56">
          <div className="absolute inset-0 rounded-full bg-cyan-400/[0.035] blur-2xl" />

          <div className="absolute inset-0 rounded-full border border-cyan-400/[0.18] animate-core" />

          <div className="absolute inset-4 rounded-full border border-cyan-400/[0.12]" />

          <div className="absolute inset-8 rounded-full border border-cyan-400/[0.1]" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-[#061014] shadow-[0_0_55px_rgba(34,211,238,.14)] sm:h-24 sm:w-24">
            <div className="flex flex-col items-center">
              <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.9)]" />

              <span className="mt-2 font-mono text-[6px] tracking-[.22em] text-cyan-300/60">
                SECURE
              </span>
            </div>
          </div>
        </div>

        {/* NETWORK NODES */}

        {nodes.map((node) => (
          <span
            key={node.id}
            className="absolute rounded-full bg-cyan-300/60"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
              transform: `translateZ(${node.z}px)`,
              boxShadow:
                "0 0 10px rgba(34,211,238,.55)",
              animation: `nodePulse 2.2s ease-in-out ${node.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* TOP STATUS */}

      <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
        <div className="rounded-full border border-white/[0.06] bg-black/30 px-3 py-1.5 backdrop-blur-md">
          <span className="font-mono text-[7px] tracking-[.18em] text-slate-500">
            LIVE_SECURITY_NODE
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-cyan-400/[0.08] bg-black/30 px-3 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

          <span className="font-mono text-[7px] tracking-[.15em] text-cyan-400/70">
            ONLINE
          </span>
        </div>
      </div>

      {/* LEFT HUD */}

      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-xl border border-white/[0.05] bg-black/25 p-3 backdrop-blur-md sm:block">
        <p className="font-mono text-[6px] tracking-[.15em] text-slate-700">
          SYSTEM
        </p>

        <div className="mt-3 space-y-2">
          <div>
            <div className="mb-1 flex justify-between gap-5">
              <span className="font-mono text-[5px] text-slate-700">
                CPU
              </span>

              <span className="font-mono text-[5px] text-cyan-400/50">
                42%
              </span>
            </div>

            <div className="h-px w-20 bg-white/[0.05]">
              <div className="h-px w-[42%] bg-cyan-400/40" />
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between gap-5">
              <span className="font-mono text-[5px] text-slate-700">
                NET
              </span>

              <span className="font-mono text-[5px] text-cyan-400/50">
                78%
              </span>
            </div>

            <div className="h-px w-20 bg-white/[0.05]">
              <div className="h-px w-[78%] bg-cyan-400/40" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT THREAT MONITOR */}

      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-xl border border-white/[0.05] bg-black/25 p-3 backdrop-blur-md sm:block">
        <div className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-cyan-400" />

          <span className="font-mono text-[6px] tracking-[.15em] text-slate-600">
            EVENT
          </span>
        </div>

        <p className="mt-2 min-w-[85px] font-mono text-[7px] text-cyan-400/60">
          {events[eventIndex]}
        </p>

        <p className="mt-1 font-mono text-[5px] text-slate-800">
          STATUS // PASS
        </p>
      </div>

      {/* BOTTOM HUD */}

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between sm:bottom-6 sm:left-6 sm:right-6">
        <div className="rounded-xl border border-white/[0.05] bg-black/25 px-3 py-2 backdrop-blur-md">
          <span className="font-mono text-[5px] tracking-[.16em] text-slate-700">
            THREAT_LEVEL
          </span>

          <p className="mt-1 font-mono text-[8px] text-cyan-400/60">
            LOW
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-black/25 px-3 py-2 text-right backdrop-blur-md">
          <span className="font-mono text-[5px] tracking-[.16em] text-slate-700">
            SYSTEM_TIME
          </span>

          <p className="mt-1 font-mono text-[8px] text-cyan-400/60">
            {liveTime || "--:--:--"}
          </p>
        </div>
      </div>

      {/* SCAN LINE */}

      <div
        className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
        style={{
          animation:
            "scanLine 5s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes orbitA {
          from {
            transform: rotateX(68deg) rotateZ(0deg);
          }

          to {
            transform: rotateX(68deg) rotateZ(360deg);
          }
        }

        @keyframes orbitB {
          from {
            transform: rotateY(70deg) rotateZ(0deg);
          }

          to {
            transform: rotateY(70deg) rotateZ(360deg);
          }
        }

        @keyframes orbitC {
          from {
            transform: rotateX(50deg) rotateY(45deg) rotateZ(0deg);
          }

          to {
            transform: rotateX(50deg) rotateY(45deg) rotateZ(360deg);
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            opacity: 0.18;
            scale: 0.7;
          }

          50% {
            opacity: 1;
            scale: 1.3;
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            opacity: 0.08;
            transform: translateY(0) scale(0.8);
          }

          50% {
            opacity: 0.75;
            transform: translateY(-15px) scale(1.15);
          }
        }

        @keyframes scanLine {
          0% {
            top: -5%;
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          85% {
            opacity: 0.7;
          }

          100% {
            top: 105%;
            opacity: 0;
          }
        }

        .animate-core {
          animation: corePulse 3s ease-in-out infinite;
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.45;
          }

          50% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          :global(.hero-scene) {
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
