"use client";

import { useEffect, useState } from "react";

export default function LiveTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );

      setDate(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-[9990] hidden sm:block">
      <div className="relative overflow-hidden rounded-xl border border-cyan-300/15 bg-[#020708]/80 px-4 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.08)]">
        
        {/* animated glow */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </span>

          <div>
            <p className="font-mono text-[7px] font-bold tracking-[0.2em] text-cyan-300/50">
              LOCAL TIME
            </p>

            <p className="mt-0.5 font-mono text-sm font-bold tracking-wider text-cyan-200">
              {time || "--:--:--"}
            </p>

            <p className="font-mono text-[7px] tracking-[0.12em] text-white/30">
              {date || "INITIALIZING..."} · IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}