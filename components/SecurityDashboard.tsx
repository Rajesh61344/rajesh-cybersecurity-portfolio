"use client";

import {
  Activity,
  Cpu,
  Database,
  Globe2,
  LockKeyhole,
  Network,
  Radio,
  Server,
  ShieldCheck,
  Signal,
  Wifi,
  Zap,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import ScrollReveal from "./ScrollReveal";

interface Packet {
  id: number;
  left: number;
  duration: number;
  delay: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export default function SecurityDashboard() {
  const [mounted, setMounted] =
    useState(false);

  const [threatLevel, setThreatLevel] =
    useState("LOW");

  const [packets, setPackets] =
    useState(1248);

  const [requests, setRequests] =
    useState(8234);

  const [cpu, setCpu] =
    useState(31);

  const [memory, setMemory] =
    useState(48);

  const [network, setNetwork] =
    useState(72);

  const [activeNodes, setActiveNodes] =
    useState(18);

  const [timestamp, setTimestamp] =
    useState("");

  const [packetAnimation, setPacketAnimation] =
    useState<Packet[]>([]);

  const [nodes, setNodes] =
    useState<Node[]>([]);

  useEffect(() => {
    setMounted(true);

    const createPackets = () => {
      const generated: Packet[] =
        Array.from(
          { length: 16 },
          (_, index) => ({
            id: Date.now() + index,
            left:
              5 +
              Math.random() * 90,
            duration:
              1.5 +
              Math.random() * 2,
            delay:
              Math.random() * 2,
          })
        );

      setPacketAnimation(generated);
    };

    const createNodes = () => {
      const generated: Node[] =
        Array.from(
          { length: 28 },
          (_, index) => ({
            id: index,
            x: 5 + Math.random() * 90,
            y: 5 + Math.random() * 90,
            active:
              Math.random() > 0.25,
          })
        );

      setNodes(generated);
    };

    createPackets();
    createNodes();

    const clock = window.setInterval(() => {
      const now = new Date();

      setTimestamp(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    const telemetry =
      window.setInterval(() => {
        setPackets(
          (current) =>
            current +
            Math.floor(
              Math.random() * 35 + 5
            )
        );

        setRequests(
          (current) =>
            current +
            Math.floor(
              Math.random() * 90 + 20
            )
        );

        setCpu(
          Math.floor(
            25 + Math.random() * 30
          )
        );

        setMemory(
          Math.floor(
            40 + Math.random() * 25
          )
        );

        setNetwork(
          Math.floor(
            60 + Math.random() * 35
          )
        );

        setActiveNodes(
          Math.floor(
            14 + Math.random() * 9
          )
        );

        const levels = [
          "LOW",
          "LOW",
          "LOW",
          "MODERATE",
        ];

        setThreatLevel(
          levels[
            Math.floor(
              Math.random() *
                levels.length
            )
          ]
        );

        createPackets();

        setNodes((current) =>
          current.map((node) => ({
            ...node,
            active:
              Math.random() > 0.2,
          }))
        );
      }, 2500);

    return () => {
      window.clearInterval(clock);
      window.clearInterval(telemetry);
    };
  }, []);

  return (
    <section
      id="security"
      className="relative overflow-hidden border-y border-white/5 bg-[#03080b] py-24"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.055),transparent_40%)]" />

      <div className="cyber-grid pointer-events-none absolute inset-0 opacity-50" />

      {/* =====================================================
          SCAN
      ====================================================== */}

      {mounted && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="cyber-scan absolute left-0 top-0 h-1/3 w-full bg-gradient-to-b from-transparent via-cyan-400/[0.025] to-transparent" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* =================================================
            HEADER
        ================================================== */}

        <ScrollReveal animation="up">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-8 bg-cyan-400" />

                <span className="font-mono text-[8px] tracking-[0.25em] text-cyan-400">
                  LIVE SECURITY TELEMETRY
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Security
                <span className="text-cyan-400">
                  {" "}
                  Operations
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Interactive cybersecurity telemetry
                visualization with continuously
                updating simulated system metrics.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] px-4 py-3">
              <span className="relative flex h-2.5 w-2.5">
                {mounted && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" />
                )}

                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              <div>
                <p className="font-mono text-[7px] tracking-[0.15em] text-slate-600">
                  SYSTEM STATUS
                </p>

                <p className="mt-1 font-mono text-[9px] text-emerald-400">
                  OPERATIONAL
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* =================================================
            MAIN DASHBOARD
        ================================================== */}

        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">

          {/* =================================================
              NETWORK VISUALIZER
          ================================================== */}

          <ScrollReveal
            animation="right"
            delay={100}
          >
            <div className="relative min-h-[480px] overflow-hidden rounded-2xl border border-white/7 bg-[#050b0e]/90 p-5">

              {/* Header */}
              <div className="relative z-20 flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/5 p-2">
                    <Network
                      size={15}
                      className="text-cyan-400"
                    />
                  </div>

                  <div>
                    <p className="font-mono text-[8px] tracking-[0.14em] text-slate-400">
                      NETWORK ACTIVITY
                    </p>

                    <p className="mt-1 font-mono text-[7px] text-slate-700">
                      GLOBAL NODE MONITOR
                    </p>
                  </div>
                </div>

                <div className="font-mono text-[8px] text-cyan-400">
                  {timestamp || "--:--:--"}
                </div>
              </div>

              {/* Network */}
              <div className="relative mt-5 h-[350px] overflow-hidden rounded-xl border border-cyan-400/[0.06] bg-[#020607]">

                {/* Grid */}
                <div className="cyber-grid absolute inset-0 opacity-70" />

                {/* Globe-like rings */}
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />

                <div
                  className="absolute left-1/2 top-1/2 h-52 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.07]"
                  style={{
                    transform:
                      "translate(-50%, -50%) rotateX(65deg)",
                  }}
                />

                <div
                  className="absolute left-1/2 top-1/2 h-72 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/[0.07]"
                  style={{
                    transform:
                      "translate(-50%, -50%) rotateY(65deg)",
                  }}
                />

                {/* Connection lines */}
                <div className="absolute left-[18%] top-1/2 h-px w-[64%] bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />

                <div className="absolute left-1/2 top-[18%] h-[64%] w-px bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent" />

                {/* Nodes */}
                {nodes.map((node) => (
                  <span
                    key={node.id}
                    className={`absolute h-1.5 w-1.5 rounded-full transition-all duration-700 ${
                      node.active
                        ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                        : "bg-slate-800"
                    }`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                    }}
                  />
                ))}

                {/* Center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute -inset-8 animate-ping rounded-full border border-cyan-400/10" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/5">
                    <Globe2
                      size={20}
                      className="text-cyan-400"
                    />
                  </div>
                </div>

                {/* Live packets */}
                {packetAnimation.map(
                  (packet) => (
                    <span
                      key={packet.id}
                      className="absolute h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                      style={{
                        left: `${packet.left}%`,
                        top: "10%",
                        animation: `dataStream ${packet.duration}s linear infinite`,
                        animationDelay: `${packet.delay}s`,
                      }}
                    />
                  )
                )}

                {/* Live label */}
                <div className="absolute bottom-4 left-4 rounded-lg border border-white/5 bg-black/60 px-3 py-2 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Radio
                      size={10}
                      className="text-emerald-400"
                    />

                    <span className="font-mono text-[7px] text-emerald-400">
                      STREAM ACTIVE
                    </span>
                  </div>
                </div>

                {/* Node count */}
                <div className="absolute bottom-4 right-4 rounded-lg border border-white/5 bg-black/60 px-3 py-2 backdrop-blur-md">
                  <span className="font-mono text-[7px] text-slate-600">
                    ACTIVE NODES{" "}
                  </span>

                  <span className="font-mono text-[8px] text-cyan-400">
                    {activeNodes}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* =================================================
              METRICS
          ================================================== */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">

            <ScrollReveal
              animation="left"
              delay={150}
            >
              <MetricCard
                icon={
                  <ShieldCheck
                    size={17}
                  />
                }
                label="THREAT LEVEL"
                value={threatLevel}
                description="Current simulated risk state"
                status={
                  threatLevel === "LOW"
                    ? "secure"
                    : "warning"
                }
              />
            </ScrollReveal>

            <ScrollReveal
              animation="left"
              delay={250}
            >
              <MetricCard
                icon={
                  <Zap size={17} />
                }
                label="PACKETS PROCESSED"
                value={packets.toLocaleString()}
                description="Continuously updating telemetry"
                status="secure"
              />
            </ScrollReveal>

            <ScrollReveal
              animation="left"
              delay={350}
            >
              <MetricCard
                icon={
                  <Activity
                    size={17}
                  />
                }
                label="REQUESTS"
                value={requests.toLocaleString()}
                description="Simulated network requests"
                status="secure"
              />
            </ScrollReveal>

            <ScrollReveal
              animation="left"
              delay={450}
            >
              <MetricCard
                icon={
                  <LockKeyhole
                    size={17}
                  />
                }
                label="ENCRYPTION"
                value="AES-256"
                description="Security protocol visualization"
                status="secure"
              />
            </ScrollReveal>
          </div>
        </div>

        {/* =================================================
            SYSTEM RESOURCES
        ================================================== */}

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          <ScrollReveal
            animation="up"
            delay={100}
          >
            <ResourceCard
              icon={<Cpu size={16} />}
              label="CPU LOAD"
              value={cpu}
              suffix="%"
            />
          </ScrollReveal>

          <ScrollReveal
            animation="up"
            delay={200}
          >
            <ResourceCard
              icon={
                <Database size={16} />
              }
              label="MEMORY"
              value={memory}
              suffix="%"
            />
          </ScrollReveal>

          <ScrollReveal
            animation="up"
            delay={300}
          >
            <ResourceCard
              icon={<Wifi size={16} />}
              label="NETWORK"
              value={network}
              suffix="%"
            />
          </ScrollReveal>
        </div>

        {/* =================================================
            FOOTNOTE
        ================================================== */}

        <ScrollReveal
          animation="fade"
          delay={300}
        >
          <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[7px] leading-5 text-slate-700">
              SECURITY TELEMETRY // INTERACTIVE
              VISUALIZATION
            </p>

            <div className="flex items-center gap-2">
              <Signal
                size={11}
                className="text-emerald-400"
              />

              <span className="font-mono text-[7px] text-emerald-400">
                CONNECTION STABLE
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon,
  label,
  value,
  description,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  status: "secure" | "warning";
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/7 bg-[#050b0e]/90 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/15">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-400/[0.03] blur-2xl transition-all duration-500 group-hover:bg-cyan-400/[0.07]" />

      <div className="relative flex items-start justify-between">
        <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 p-2 text-cyan-400">
          {icon}
        </div>

        <span
          className={`flex items-center gap-1.5 font-mono text-[7px] ${
            status === "secure"
              ? "text-emerald-400"
              : "text-yellow-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "secure"
                ? "bg-emerald-400"
                : "bg-yellow-400"
            }`}
          />

          LIVE
        </span>
      </div>

      <p className="relative mt-5 font-mono text-[7px] tracking-[0.16em] text-slate-600">
        {label}
      </p>

      <p className="relative mt-1 text-2xl font-bold text-slate-200">
        {value}
      </p>

      <p className="relative mt-2 text-[9px] leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   RESOURCE CARD
========================================================= */

function ResourceCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
}) {
  return (
    <div className="rounded-2xl border border-white/7 bg-[#050b0e]/90 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">
            {icon}
          </span>

          <span className="font-mono text-[8px] tracking-[0.15em] text-slate-600">
            {label}
          </span>
        </div>

        <span className="font-mono text-[9px] text-cyan-400">
          {value}
          {suffix}
        </span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-1000"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}