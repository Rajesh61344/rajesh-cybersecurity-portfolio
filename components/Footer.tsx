"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ChevronUp,
  Code2,
  Cpu,
  Globe2,
  Heart,
  LockKeyhole,
  Mail,
  MapPin,
  Radar,
  ShieldCheck,
  Terminal,
  Wifi,
  Zap,
} from "lucide-react";

export default function Footer() {
  const [online, setOnline] = useState(true);
  const [time, setTime] = useState("");
  const [systemLoad, setSystemLoad] = useState(72);
  const [packets, setPackets] = useState(1248);

  useEffect(() => {
    const update = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setSystemLoad(
        Math.floor(68 + Math.random() * 20)
      );

      setPackets((prev) => prev + Math.floor(Math.random() * 8));
    };

    update();

    const interval = window.setInterval(update, 1000);

    const statusInterval = window.setInterval(() => {
      setOnline((prev) => !prev);

      window.setTimeout(() => {
        setOnline(true);
      }, 500);
    }, 12000);

    return () => {
      window.clearInterval(interval);
      window.clearInterval(statusInterval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-cyan-400/[0.08] bg-[#010405]">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="footer-grid absolute inset-0" />

        <div className="absolute left-[8%] top-[20%] h-72 w-72 rounded-full bg-cyan-400/[0.025] blur-[130px]" />

        <div className="absolute bottom-[5%] right-[5%] h-80 w-80 rounded-full bg-blue-500/[0.025] blur-[140px]" />

        {/* Scan line */}

        <div className="footer-scan absolute left-0 right-0" />

        {/* Floating particles */}

        <span className="footer-dot left-[12%] top-[25%]" />
        <span className="footer-dot left-[30%] top-[70%]" />
        <span className="footer-dot right-[20%] top-[30%]" />
        <span className="footer-dot right-[10%] bottom-[20%]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* =====================================================
            SYSTEM BAR
        ===================================================== */}

        <div className="border-b border-white/[0.05] py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left */}

            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.035]">
                <Radar
                  size={14}
                  className="text-cyan-300"
                />

                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              </div>

              <div>
                <p className="font-mono text-[6px] tracking-[0.16em] text-white/25">
                  PORTFOLIO SYSTEM
                </p>

                <p className="mt-1 font-mono text-[7px] font-bold tracking-[0.12em] text-cyan-300">
                  RAJESH_REDDY // SECURE_NODE
                </p>
              </div>
            </div>

            {/* Right */}

            <div className="flex flex-wrap items-center gap-4">
              <SystemItem
                icon={<Wifi size={10} />}
                label="NETWORK"
                value="STABLE"
              />

              <SystemItem
                icon={<Cpu size={10} />}
                label="LOAD"
                value={`${systemLoad}%`}
              />

              <SystemItem
                icon={<Activity size={10} />}
                label="STATUS"
                value={online ? "ONLINE" : "SYNC"}
              />

              <div className="font-mono text-[7px] tracking-[0.12em] text-white/30">
                {time}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN FOOTER
        ===================================================== */}

        <div className="grid gap-12 py-16 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
          {/* =================================================
              BRAND
          ================================================== */}

          <div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.035] shadow-[0_0_30px_rgba(34,211,238,0.05)]">
                <ShieldCheck
                  size={22}
                  strokeWidth={1.4}
                  className="text-cyan-300"
                />

                <span className="absolute -inset-1 rounded-2xl border border-cyan-400/[0.06] animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-black tracking-tight text-white">
                  Rajesh Reddy
                </h3>

                <p className="mt-1 font-mono text-[7px] font-bold tracking-[0.16em] text-cyan-300">
                  JUNIOR CYBERSECURITY ANALYST
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-xs leading-7 text-white/40">
              Building secure systems, analyzing threats and
              developing practical cybersecurity solutions with
              Python, security tools and data-driven analysis.
            </p>

            {/* Terminal */}

            <div className="mt-6 max-w-md overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
              <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-3">
                <Terminal
                  size={11}
                  className="text-cyan-300"
                />

                <span className="font-mono text-[6px] tracking-[0.14em] text-white/25">
                  SYSTEM_TERMINAL
                </span>

                <div className="ml-auto flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
                </div>
              </div>

              <div className="px-4 py-4 font-mono text-[7px] leading-6">
                <p className="text-white/25">
                  <span className="text-cyan-300">
                    $
                  </span>{" "}
                  initialize_portfolio
                </p>

                <p className="text-emerald-400/70">
                  ✓ security modules loaded
                </p>

                <p className="text-emerald-400/70">
                  ✓ portfolio interface online
                </p>

                <p className="text-cyan-300/70">
                  ✓ monitoring active
                  <span className="ml-1 animate-pulse">
                    _
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div>
            <FooterHeading
              icon={<Code2 size={11} />}
              title="NAVIGATION"
            />

            <div className="mt-5 space-y-3">
              <FooterLink
                label="Home"
                href="#home"
              />

              <FooterLink
                label="About"
                href="#about"
              />

              <FooterLink
                label="Skills"
                href="#skills"
              />

              <FooterLink
                label="Experience"
                href="#experience"
              />

              <FooterLink
                label="Projects"
                href="#projects"
              />

              <FooterLink
                label="Resume"
                href="#resume"
              />

              <FooterLink
                label="Contact"
                href="#contact"
              />
            </div>
          </div>

          {/* =================================================
              SECURITY
          ================================================== */}

          <div>
            <FooterHeading
              icon={<LockKeyhole size={11} />}
              title="SECURITY"
            />

            <div className="mt-5 space-y-4">
              <SecurityItem
                label="THREAT DETECTION"
                value="ACTIVE"
              />

              <SecurityItem
                label="NETWORK MONITOR"
                value="ONLINE"
              />

              <SecurityItem
                label="RISK ANALYSIS"
                value="READY"
              />

              <SecurityItem
                label="SYSTEM STATUS"
                value="SECURE"
              />
            </div>
          </div>

          {/* =================================================
              CONTACT
          ================================================== */}

          <div>
            <FooterHeading
              icon={<Terminal size={11} />}
              title="CONNECT"
            />

            <div className="mt-5 space-y-3">
              <a
                href="mailto:brajeshreddy90@gmail.com"
                className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]"
              >
                <Mail
                  size={13}
                  className="text-cyan-300/70"
                />

                <span className="min-w-0 truncate font-mono text-[7px] text-white/45 transition-colors group-hover:text-cyan-200">
                  brajeshreddy90@gmail.com
                </span>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3">
                <MapPin
                  size={13}
                  className="text-cyan-300/70"
                />

                <span className="font-mono text-[7px] text-white/45">
                  INDIA
                </span>
              </div>

              {/* Social buttons */}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <SocialButton
                  label="GitHub"
                  href="https://github.com/Rajesh61344"
                />

                <SocialButton
                  label="LinkedIn"
                  href="https://www.linkedin.com/in/rajesh-reddy-53198b30b"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            LIVE SECURITY STRIP
        ===================================================== */}

        <div className="mb-8 overflow-hidden rounded-2xl border border-cyan-400/[0.08] bg-cyan-400/[0.015]">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/[0.025]">
                <Activity
                  size={13}
                  className="text-emerald-400"
                />

                <span className="absolute -inset-1 animate-ping rounded-lg border border-emerald-400/[0.05]" />
              </div>

              <div>
                <p className="font-mono text-[6px] tracking-[0.15em] text-white/25">
                  LIVE SECURITY TELEMETRY
                </p>

                <p className="mt-1 font-mono text-[7px] font-bold text-emerald-400">
                  ALL SYSTEMS OPERATIONAL
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <LiveMetric
                label="PACKETS"
                value={packets.toLocaleString()}
              />

              <LiveMetric
                label="THREATS"
                value="00"
              />

              <LiveMetric
                label="UPTIME"
                value="99.9%"
              />

              <div className="flex items-center gap-2">
                <Zap
                  size={11}
                  className="text-cyan-300"
                />

                <span className="font-mono text-[7px] text-cyan-300">
                  REAL-TIME
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="border-t border-white/[0.05] py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <p className="font-mono text-[7px] text-white/25">
                © {new Date().getFullYear()} RAJESH REDDY
              </p>

              <span className="hidden h-3 w-px bg-white/10 sm:block" />

              <p className="flex items-center gap-1.5 font-mono text-[7px] text-white/20">
                BUILT WITH
                <Heart
                  size={9}
                  className="fill-cyan-300/40 text-cyan-300/50"
                />
                FOR CYBERSECURITY
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe2
                  size={10}
                  className="text-cyan-300/50"
                />

                <span className="font-mono text-[6px] tracking-[0.12em] text-white/20">
                  SECURE_WEB_NODE
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-cyan-400/[0.04]"
              >
                <ChevronUp
                  size={15}
                  className="text-white/40 transition-colors group-hover:text-cyan-300"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style jsx>{`
        .footer-grid {
          background-image:
            linear-gradient(
              rgba(34, 211, 238, 0.014) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34, 211, 238, 0.014) 1px,
              transparent 1px
            );

          background-size: 52px 52px;

          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 82%
          );
        }

        .footer-scan {
          height: 1px;
          top: 0;

          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.22),
            transparent
          );

          box-shadow: 0 0 16px
            rgba(34, 211, 238, 0.15);

          animation: footerScan 8s linear infinite;
        }

        .footer-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;

          background: rgba(103, 232, 249, 0.55);

          box-shadow:
            0 0 8px rgba(34, 211, 238, 0.7),
            0 0 20px rgba(34, 211, 238, 0.25);

          animation: footerFloat 5s ease-in-out infinite;
        }

        @keyframes footerScan {
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

        @keyframes footerFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.25;
          }

          50% {
            transform: translate3d(0, -20px, 0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer-scan,
          .footer-dot {
            animation: none !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* =========================================================
   SYSTEM ITEM
========================================================= */

function SystemItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-cyan-300/50">
        {icon}
      </span>

      <div>
        <p className="font-mono text-[5px] tracking-[0.1em] text-white/20">
          {label}
        </p>

        <p className="font-mono text-[6px] font-bold text-emerald-400/70">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER HEADING
========================================================= */

function FooterHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-cyan-300/70">
        {icon}
      </span>

      <span className="font-mono text-[7px] font-bold tracking-[0.16em] text-cyan-300">
        {title}
      </span>

      <span className="h-px w-8 bg-cyan-300/20" />
    </div>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex w-fit items-center gap-2 font-mono text-[8px] text-white/35 transition-all duration-300 hover:translate-x-1 hover:text-cyan-300"
    >
      <span className="h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-3" />

      {label}

      <ArrowUpRight
        size={9}
        className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    </a>
  );
}

/* =========================================================
   SECURITY ITEM
========================================================= */

function SecurityItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[6px] tracking-[0.08em] text-white/25">
        {label}
      </span>

      <span className="flex items-center gap-1.5 font-mono text-[6px] font-bold text-emerald-400/70">
        <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />

        {value}
      </span>
    </div>
  );
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialButton({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.015] px-3 py-2.5 font-mono text-[7px] font-bold text-white/40 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-cyan-400/[0.035] hover:text-cyan-300"
    >
      {label}

      <ArrowUpRight
        size={9}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

/* =========================================================
   LIVE METRIC
========================================================= */

function LiveMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="font-mono text-[5px] tracking-[0.1em] text-white/20">
        {label}
      </p>

      <p className="mt-1 font-mono text-[8px] font-bold text-cyan-300">
        {value}
      </p>
    </div>
  );
}