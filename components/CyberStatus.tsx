"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Activity,
  Lock,
  Wifi,
  Server,
  CheckCircle,
} from "lucide-react";

const statuses = [
  "THREAT MONITORING",
  "NETWORK DEFENSE",
  "SECURITY ANALYSIS",
  "SYSTEM PROTECTION",
];

export default function CyberStatus() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [threatLevel, setThreatLevel] = useState(8);
  const [nodes, setNodes] = useState(24);
  const [latency, setLatency] = useState(18);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % statuses.length);
      setThreatLevel(Math.floor(4 + Math.random() * 12));
      setNodes(Math.floor(21 + Math.random() * 8));
      setLatency(Math.floor(12 + Math.random() * 18));
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#050a0d]/80 p-5 backdrop-blur-xl">
      {/* Animated scan */}
      <div className="pointer-events-none absolute left-0 top-0 h-px w-full animate-[scan_4s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5">
            <Shield
              size={19}
              className="text-cyan-400"
            />

            <span className="absolute inset-0 animate-ping rounded-xl border border-cyan-400/10" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-200">
              Cybersecurity Status
            </p>

            <p className="mt-1 font-mono text-[8px] tracking-[0.15em] text-slate-600">
              REAL-TIME SECURITY MONITOR
            </p>
          </div>
        </div>

        {/* Live */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>

          <span className="font-mono text-[8px] text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      {/* Current operation */}
      <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-4">
        <div className="flex items-center gap-3">
          <Activity
            size={15}
            className="animate-pulse text-cyan-400"
          />

          <div>
            <p className="font-mono text-[8px] text-slate-600">
              CURRENT_OPERATION
            </p>

            <p className="mt-1 text-xs text-cyan-300">
              {statuses[statusIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatusMetric
          icon={<Shield size={14} />}
          label="THREATS"
          value={`${threatLevel}`}
        />

        <StatusMetric
          icon={<Server size={14} />}
          label="NODES"
          value={`${nodes}`}
        />

        <StatusMetric
          icon={<Wifi size={14} />}
          label="LATENCY"
          value={`${latency}ms`}
        />
      </div>

      {/* Security modules */}
      <div className="mt-4 space-y-2">
        <SecurityRow
          icon={<Lock size={13} />}
          label="ENCRYPTION"
          value="ACTIVE"
        />

        <SecurityRow
          icon={<Shield size={13} />}
          label="FIREWALL"
          value="PROTECTED"
        />

        <SecurityRow
          icon={<CheckCircle size={13} />}
          label="SYSTEM"
          value="SECURE"
        />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="font-mono text-[8px] text-slate-700">
          SECURITY_LEVEL
        </span>

        <span className="font-mono text-[8px] text-emerald-400">
          LOW RISK
        </span>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function StatusMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="text-cyan-400">
        {icon}
      </div>

      <p className="mt-3 font-mono text-[7px] text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-200">
        {value}
      </p>
    </div>
  );
}

function SecurityRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.015] px-3 py-2.5">
      <span className="text-cyan-400">
        {icon}
      </span>

      <span className="font-mono text-[8px] text-slate-600">
        {label}
      </span>

      <span className="ml-auto flex items-center gap-1.5 font-mono text-[8px] text-emerald-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        {value}
      </span>
    </div>
  );
}