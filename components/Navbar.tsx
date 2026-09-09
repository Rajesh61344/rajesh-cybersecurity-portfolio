"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ChevronDown,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Resume", id: "resume" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] =
    useState("home");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [visible, setVisible] =
    useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 30);

      if (currentScrollY < 80) {
        setVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) =>
        document.getElementById(item.id)
      )
      .filter(
        (
          section
        ): section is HTMLElement =>
          section !== null
      );

    if (!sections.length) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleSections =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (visibleSections[0]) {
            setActiveSection(
              visibleSections[0].target.id
            );
          }
        },
        {
          root: null,
          rootMargin:
            "-30% 0px -55% 0px",
          threshold: [0.05, 0.2, 0.4],
        }
      );

    sections.forEach((section) =>
      observer.observe(section)
    );

    return () => observer.disconnect();
  }, []);

  const handleNavigation = (
    id: string
  ) => {
    setMobileOpen(false);

    const section =
      document.getElementById(id);

    if (!section) return;

    const navbarOffset = 90;

    const targetPosition =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    setActiveSection(id);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}

      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
          visible
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <div
            className={`relative flex h-[68px] items-center justify-between rounded-2xl border px-3 transition-all duration-500 sm:px-4 ${
              scrolled
                ? "border-cyan-400/[0.14] bg-[#02080b]/80 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                : "border-white/[0.07] bg-[#020607]/65 backdrop-blur-xl"
            }`}
          >
            {/* =================================================
                GLOW
            ================================================== */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -left-20 top-0 h-full w-40 bg-cyan-400/[0.025] blur-3xl" />

              <div className="absolute -right-20 bottom-0 h-full w-40 bg-blue-500/[0.025] blur-3xl" />

              <div
                className={`navbar-scan absolute left-0 top-0 h-px w-1/3 ${
                  scrolled
                    ? "opacity-100"
                    : "opacity-50"
                }`}
              />
            </div>

            {/* =================================================
                LOGO
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                handleNavigation("home")
              }
              className="group relative z-10 flex items-center gap-3"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.035] transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-105 group-hover:border-cyan-300/30 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                <ShieldCheck
                  size={19}
                  strokeWidth={1.5}
                  className="text-cyan-300 transition-transform duration-500 group-hover:scale-110"
                />

                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(34,211,238,0.9)]" />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-black tracking-tight text-white">
                  Rajesh Reddy
                </p>

                <p className="mt-0.5 font-mono text-[6px] font-bold tracking-[0.15em] text-cyan-300/70">
                  CYBERSECURITY // NODE
                </p>
              </div>
            </button>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <div className="relative z-10 hidden items-center gap-1 lg:flex">
              {navItems.map(
                (item, index) => {
                  const active =
                    activeSection ===
                    item.id;

                  return (
                    <NavItem
                      key={item.id}
                      item={item}
                      index={index}
                      active={active}
                      onClick={() =>
                        handleNavigation(
                          item.id
                        )
                      }
                    />
                  );
                }
              )}
            </div>

            {/* =================================================
                SYSTEM STATUS
            ================================================== */}

            <div className="relative z-10 hidden items-center gap-3 xl:flex">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-3 py-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/50" />

                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>

                <span className="font-mono text-[6px] font-bold tracking-[0.12em] text-emerald-400">
                  ONLINE
                </span>

                <Activity
                  size={10}
                  className="text-emerald-400/60"
                />
              </div>
            </div>

            {/* =================================================
                MOBILE BUTTON
            ================================================== */}

            <button
              type="button"
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={mobileOpen}
              onClick={() =>
                setMobileOpen(
                  (current) => !current
                )
              }
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.02] text-white/60 transition-all duration-300 hover:border-cyan-400/20 hover:text-cyan-300 lg:hidden"
            >
              {mobileOpen ? (
                <X size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>
          </div>

          {/* =================================================
              MOBILE MENU
          ================================================== */}

          <div
            className={`overflow-hidden transition-all duration-500 lg:hidden ${
              mobileOpen
                ? "mt-2 max-h-[620px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-2xl border border-cyan-400/[0.10] bg-[#02080b]/95 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              {/* Mobile status */}

              <div className="mb-2 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>

                  <span className="font-mono text-[6px] tracking-[0.14em] text-emerald-400">
                    SYSTEM ONLINE
                  </span>
                </div>

                <span className="font-mono text-[6px] text-white/20">
                  MENU // 07
                </span>
              </div>

              <div className="space-y-1">
                {navItems.map(
                  (item, index) => {
                    const active =
                      activeSection ===
                      item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleNavigation(
                            item.id
                          )
                        }
                        className={`mobile-nav-item group relative flex w-full items-center justify-between overflow-hidden rounded-xl px-4 py-3.5 text-left transition-all duration-300 ${
                          active
                            ? "border border-cyan-400/15 bg-cyan-400/[0.045]"
                            : "border border-transparent hover:border-white/[0.06] hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`font-mono text-[6px] ${
                              active
                                ? "text-cyan-300/70"
                                : "text-white/20"
                            }`}
                          >
                            0{index + 1}
                          </span>

                          <span
                            className={`text-xs font-semibold ${
                              active
                                ? "text-cyan-200"
                                : "text-white/50 group-hover:text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                        </span>

                        <ChevronDown
                          size={12}
                          className={`-rotate-90 transition-all duration-300 ${
                            active
                              ? "translate-x-0 text-cyan-300 opacity-100"
                              : "translate-x-1 text-white/15 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />

                        {active && (
                          <span className="absolute bottom-0 left-4 right-4 h-px bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* =====================================================
          FLOATING BACKDROP EFFECT
      ===================================================== */}

      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-1/2 top-0 z-[90] h-24 w-[70%] -translate-x-1/2 bg-cyan-400/[0.025] blur-[70px] transition-opacity duration-500 ${
          scrolled
            ? "opacity-100"
            : "opacity-40"
        }`}
      />

      {/* =====================================================
          CSS
      ===================================================== */}

      <style jsx>{`
        .navbar-scan {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(34, 211, 238, 0.6),
            transparent
          );

          box-shadow:
            0 0 15px rgba(34, 211, 238, 0.35);

          animation: navbarScan 5s linear infinite;
        }

        @keyframes navbarScan {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(420%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar-scan {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({
  item,
  index,
  active,
  onClick,
}: {
  item: {
    label: string;
    id: string;
  };
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav-3d group relative rounded-xl px-3 py-2.5 transition-all duration-300 ${
        active
          ? "bg-cyan-400/[0.045]"
          : "hover:bg-white/[0.025]"
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`font-mono text-[5px] transition-colors ${
            active
              ? "text-cyan-300/70"
              : "text-white/15 group-hover:text-cyan-300/50"
          }`}
        >
          0{index + 1}
        </span>

        <span
          className={`font-mono text-[7px] font-bold tracking-[0.08em] transition-colors ${
            active
              ? "text-cyan-200"
              : "text-white/40 group-hover:text-white"
          }`}
        >
          {item.label.toUpperCase()}
        </span>
      </span>

      {/* Active line */}

      <span
        className={`absolute bottom-0 left-1/2 h-px -translate-x-1/2 bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-all duration-300 ${
          active
            ? "w-1/2"
            : "w-0 group-hover:w-1/3"
        }`}
      />

      {/* 3D glow */}

      <span
        className={`pointer-events-none absolute inset-0 -z-10 rounded-xl bg-cyan-300/[0.035] blur-md transition-opacity duration-300 ${
          active
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      />
    </button>
  );  
}