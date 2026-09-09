"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CheckCircle2,
  LogOut,
  ShieldAlert,
  X,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SecurityDashboard from "@/components/SecurityDashboard";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

/* ======================================================
   LIVE TIME
====================================================== */

function LiveTime() {
  const [time, setTime] = useState("--:--:-- --");

  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());

      setTime(currentTime);
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      aria-label="Current India Standard Time"
      className="fixed right-4 top-4 z-[9990] rounded-xl border border-cyan-300/20 bg-[#020708]/90 px-3 py-2 shadow-[0_0_25px_rgba(34,211,238,0.12)] backdrop-blur-xl sm:right-6 sm:top-6"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        </span>

        <span className="font-mono text-[8px] font-bold tracking-[0.18em] text-white/40">
          IST
        </span>

        <span className="font-mono text-[9px] font-bold tracking-[0.08em] text-cyan-300">
          {time}
        </span>
      </div>
    </div>
  );
}

/* ======================================================
   ADMIN CONTROL CENTER
====================================================== */

function Admin() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Security system online",
      message: "Portfolio security monitoring is active.",
      time: "Just now",
      type: "success",
      unread: true,
    },
    {
      id: 2,
      title: "Portfolio status",
      message: "All portfolio services are running normally.",
      time: "2 min ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Admin access protected",
      message: "Administrative controls are protected.",
      time: "5 min ago",
      type: "security",
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  /* ======================================================
     LOGOUT
  ====================================================== */

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => {
        // Continue logout if API is unavailable.
      });

      const storageKeys = [
        "admin",
        "adminUser",
        "adminSession",
        "adminToken",
        "authToken",
        "token",
      ];

      storageKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch {
          // Ignore storage errors.
        }
      });

      window.location.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.replace("/admin/login");
    }
  };

  /* ======================================================
     NOTIFICATIONS
  ====================================================== */

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );
  };

  const removeNotification = (id: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  return (
    <section
      id="admin"
      className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6"
    >
      <div className="relative overflow-visible rounded-2xl border border-cyan-300/10 bg-white/[0.015] p-5 backdrop-blur-xl">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT */}

          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </span>

              <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-cyan-300/70">
                ADMIN SYSTEM
              </span>
            </div>

            <h2 className="mt-2 text-lg font-bold text-white">
              Portfolio Control Center
            </h2>

            <p className="mt-1 text-xs text-white/35">
              System status and portfolio administration
            </p>
          </div>

          {/* ==================================================
              CONTROLS
          ================================================== */}

          <div className="relative flex items-center gap-2">
            {/* ==================================================
                NOTIFICATION BUTTON
            ================================================== */}

            <div className="relative">
              <button
                type="button"
                aria-label="Open notifications"
                aria-expanded={notificationsOpen}
                onClick={() =>
                  setNotificationsOpen((value) => !value)
                }
                className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.035] text-cyan-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-300/[0.08] hover:shadow-[0_10px_35px_rgba(34,211,238,0.18)] active:translate-y-0"
              >
                {/* 3D DEPTH */}

                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 translate-y-[4px] rounded-xl border border-cyan-300/10 bg-cyan-300/[0.025] transition-transform duration-300 group-hover:translate-y-[6px]"
                />

                {/* GLOW */}

                <span
                  aria-hidden="true"
                  className="absolute inset-1 rounded-lg bg-cyan-300/[0.025] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* BELL */}

                <Bell
                  size={17}
                  strokeWidth={1.7}
                  className={[
                    "relative z-10 transition-all duration-300",
                    unreadCount > 0
                      ? "animate-[bellShake_2.8s_ease-in-out_infinite]"
                      : "",
                    "group-hover:scale-110",
                    "group-hover:drop-shadow-[0_0_8px_rgba(103,232,249,0.9)]",
                  ].join(" ")}
                />

                {/* RED BADGE */}

                {unreadCount > 0 && (
                  <>
                    <span className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-red-400 opacity-70" />

                    <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border border-[#010405] bg-red-400 px-1 font-mono text-[7px] font-black text-black shadow-[0_0_12px_rgba(248,113,113,0.65)]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {/* ==================================================
                  NOTIFICATION PANEL
              ================================================== */}

              {notificationsOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-[100] w-[min(90vw,360px)] origin-top-right animate-[notificationIn_180ms_ease-out]">
                  {/* 3D SHADOW */}

                  <div className="absolute inset-0 translate-y-2 rounded-2xl bg-cyan-400/[0.04] blur-xl" />

                  <div className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#03090b]/95 shadow-[0_20px_70px_rgba(0,0,0,0.65),0_0_35px_rgba(34,211,238,0.08)] backdrop-blur-2xl">
                    {/* TOP LIGHT */}

                    <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-cyan-300/60 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />

                    {/* HEADER */}

                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300 opacity-60" />

                            <span className="relative h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                          </span>

                          <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-white/80">
                            NOTIFICATIONS
                          </span>
                        </div>

                        <p className="mt-1 font-mono text-[7px] tracking-[0.12em] text-white/25">
                          SECURITY EVENT CENTER
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={() =>
                          setNotificationsOpen(false)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-white/30 transition hover:border-red-400/20 hover:bg-red-400/[0.05] hover:text-red-300"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* LIST */}

                    <div className="max-h-[330px] overflow-y-auto p-2">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <CheckCircle2
                            size={24}
                            className="mx-auto text-emerald-400/60"
                          />

                          <p className="mt-3 font-mono text-[9px] font-bold tracking-[0.15em] text-white/40">
                            ALL CLEAR
                          </p>

                          <p className="mt-1 text-[10px] text-white/20">
                            No active notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const Icon =
                            notification.type === "security"
                              ? ShieldAlert
                              : notification.type === "success"
                                ? CheckCircle2
                                : Bell;

                          return (
                            <div
                              key={notification.id}
                              onClick={() =>
                                markAsRead(notification.id)
                              }
                              className={[
                                "group relative mb-1 flex cursor-pointer gap-3 rounded-xl border p-3",
                                "transition-all duration-200",
                                notification.unread
                                  ? "border-cyan-300/10 bg-cyan-300/[0.035]"
                                  : "border-transparent bg-transparent",
                                "hover:border-cyan-300/15 hover:bg-white/[0.025]",
                              ].join(" ")}
                            >
                              {/* ICON */}

                              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.035] shadow-[0_5px_20px_rgba(34,211,238,0.06)]">
                                <Icon
                                  size={15}
                                  className={
                                    notification.type === "security"
                                      ? "text-amber-300"
                                      : notification.type === "success"
                                        ? "text-emerald-300"
                                        : "text-cyan-300"
                                  }
                                />
                              </div>

                              {/* CONTENT */}

                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-[10px] font-bold text-white/75">
                                    {notification.title}
                                  </p>

                                  {notification.unread && (
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                                  )}
                                </div>

                                <p className="mt-1 text-[9px] leading-relaxed text-white/30">
                                  {notification.message}
                                </p>

                                <p className="mt-2 font-mono text-[7px] tracking-[0.1em] text-white/20">
                                  {notification.time}
                                </p>
                              </div>

                              {/* REMOVE */}

                              <button
                                type="button"
                                aria-label="Remove notification"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  removeNotification(
                                    notification.id
                                  );
                                }}
                                className="absolute right-2 top-2 hidden h-5 w-5 items-center justify-center rounded-md text-white/20 transition hover:bg-red-400/[0.06] hover:text-red-300 group-hover:flex"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* FOOTER */}

                    {notifications.length > 0 && (
                      <div className="border-t border-white/[0.06] px-3 py-2">
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="w-full rounded-lg border border-white/[0.06] bg-white/[0.015] py-2 font-mono text-[7px] font-bold tracking-[0.15em] text-white/30 transition hover:border-cyan-300/15 hover:bg-cyan-300/[0.03] hover:text-cyan-300"
                        >
                          MARK ALL AS READ
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================
                OPEN ADMIN
            ================================================== */}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="group relative overflow-hidden rounded-lg border border-cyan-300/20 bg-cyan-300/[0.04] px-4 py-2 font-mono text-[9px] font-bold tracking-[0.16em] text-cyan-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/[0.08] hover:shadow-[0_8px_25px_rgba(34,211,238,0.12)]"
            >
              <span className="relative z-10">
                {open ? "CLOSE ADMIN" : "OPEN ADMIN"}
              </span>

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            {/* ==================================================
                LOGOUT
            ================================================== */}

            <button
              type="button"
              onClick={logout}
              aria-label="Logout"
              title="Logout"
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/15 bg-red-400/[0.025] text-red-300/70 transition-all duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:bg-red-400/[0.07] hover:text-red-300 hover:shadow-[0_10px_35px_rgba(248,113,113,0.12)] active:translate-y-0"
            >
              {/* 3D DEPTH */}

              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 translate-y-[4px] rounded-xl border border-red-400/10 bg-red-400/[0.02] transition-transform duration-300 group-hover:translate-y-[6px]"
              />

              <LogOut
                size={16}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
              />
            </button>
          </div>
        </div>

        {/* ======================================================
            ADMIN STATUS CARDS
        ====================================================== */}

        {open && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {/* SYSTEM */}

            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/20 hover:shadow-[0_10px_35px_rgba(52,211,153,0.07)]">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-400/[0.025] blur-2xl" />

              <p className="relative font-mono text-[8px] tracking-[0.18em] text-white/30">
                SYSTEM
              </p>

              <div className="relative mt-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-50" />

                  <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                </span>

                <p className="text-sm font-bold text-emerald-400">
                  ONLINE
                </p>
              </div>
            </div>

            {/* PORTFOLIO */}

            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_10px_35px_rgba(34,211,238,0.07)]">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-cyan-400/[0.025] blur-2xl" />

              <p className="relative font-mono text-[8px] tracking-[0.18em] text-white/30">
                PORTFOLIO
              </p>

              <p className="relative mt-2 text-sm font-bold text-cyan-300">
                ACTIVE
              </p>
            </div>

            {/* SECURITY */}

            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_10px_35px_rgba(34,211,238,0.07)]">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-blue-400/[0.025] blur-2xl" />

              <p className="relative font-mono text-[8px] tracking-[0.18em] text-white/30">
                SECURITY
              </p>

              <div className="relative mt-2 flex items-center gap-2">
                <ShieldAlert
                  size={14}
                  className="text-cyan-300"
                />

                <p className="text-sm font-bold text-cyan-300">
                  PROTECTED
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================
          ADMIN ANIMATIONS
      ====================================================== */}

      <style jsx>{`
        @keyframes bellShake {
          0%,
          84%,
          100% {
            transform: rotate(0deg);
          }

          87% {
            transform: rotate(10deg);
          }

          90% {
            transform: rotate(-10deg);
          }

          93% {
            transform: rotate(7deg);
          }

          96% {
            transform: rotate(-5deg);
          }
        }

        @keyframes notificationIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96) rotateX(-5deg);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotateX(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ======================================================
   PORTFOLIO LOADER
====================================================== */

function PortfolioLoader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");

  const welcomeText =
    "Welcome to Rajesh Reddy's Portfolio";

  /* TYPING ANIMATION */

  useEffect(() => {
    let index = 0;

    const typingInterval = window.setInterval(() => {
      if (index < welcomeText.length) {
        index += 1;

        setTypedText(
          welcomeText.slice(0, index)
        );
      } else {
        window.clearInterval(typingInterval);
      }
    }, 55);

    return () => {
      window.clearInterval(typingInterval);
    };
  }, []);

  /* LOADING */

  useEffect(() => {
    let current = 0;
    let completeTimeout: number | undefined;

    const interval = window.setInterval(() => {
      current += Math.floor(Math.random() * 7) + 3;

      if (current >= 100) {
        current = 100;

        window.clearInterval(interval);

        completeTimeout = window.setTimeout(() => {
          onComplete();
        }, 500);
      }

      setProgress(current);
    }, 90);

    return () => {
      window.clearInterval(interval);

      if (completeTimeout) {
        window.clearTimeout(completeTimeout);
      }
    };
  }, [onComplete]);

  const dotProgress = progress / 100;

  const dotX = 8 + 344 * dotProgress;

  const dotY =
    30 - 12 * Math.sin(dotProgress * Math.PI);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#010405]">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.035] blur-[120px]" />

        <div className="absolute left-[10%] top-[20%] h-[180px] w-[180px] rounded-full bg-blue-500/[0.025] blur-[100px]" />

        <div className="absolute bottom-[15%] right-[10%] h-[200px] w-[200px] rounded-full bg-cyan-400/[0.025] blur-[100px]" />
      </div>

      {/* GRID */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* MAIN */}

      <div className="relative z-10 w-[min(92vw,620px)] text-center">
        {/* 3D CORE */}

        <div className="relative mx-auto h-48 w-48 [perspective:800px]">
          <div className="absolute inset-0 rounded-full bg-cyan-300/[0.025] blur-2xl" />

          {/* ORBIT 1 */}

          <div
            className="absolute inset-2 rounded-full border border-cyan-300/20"
            style={{
              transform:
                "rotateX(68deg) rotateZ(15deg)",
              boxShadow:
                "0 0 25px rgba(34,211,238,0.12), inset 0 0 25px rgba(34,211,238,0.04)",
              animation:
                "loaderOrbitOne 4s linear infinite",
            }}
          >
            <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,1)]" />
          </div>

          {/* ORBIT 2 */}

          <div
            className="absolute inset-5 rounded-full border border-blue-400/20"
            style={{
              transform:
                "rotateY(68deg) rotateZ(-20deg)",
              boxShadow:
                "0 0 25px rgba(59,130,246,0.10), inset 0 0 20px rgba(59,130,246,0.04)",
              animation:
                "loaderOrbitTwo 5s linear infinite",
            }}
          >
            <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(96,165,250,1)]" />
          </div>

          {/* ORBIT 3 */}

          <div
            className="absolute inset-8 rounded-full border border-cyan-200/15"
            style={{
              transform:
                "rotateX(65deg) rotateY(35deg)",
              animation:
                "loaderOrbitThree 3.5s linear infinite reverse",
            }}
          >
            <span className="absolute right-[15%] top-[8%] h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,1)]" />
          </div>

          {/* CORE */}

          <div
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/[0.035] shadow-[0_0_40px_rgba(34,211,238,0.14),inset_0_0_30px_rgba(34,211,238,0.05)]"
            style={{
              transformStyle: "preserve-3d",
              animation:
                "loaderCore 3s ease-in-out infinite",
            }}
          >
            <div
              className="absolute h-14 w-14 rounded-xl border border-cyan-300/30 bg-cyan-300/[0.025]"
              style={{
                transform:
                  "translateZ(18px)",
                boxShadow:
                  "0 0 25px rgba(34,211,238,0.12)",
              }}
            />

            <span className="relative z-10 text-2xl font-black tracking-tight text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.9)]">
              RR
            </span>
          </div>

          {/* CORNERS */}

          <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan-300/30" />

          <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan-300/30" />

          <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan-300/30" />

          <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan-300/30" />
        </div>

        {/* TEXT */}

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

        {/* STATUS */}

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

        {/* CURVED LOADING */}

        <div className="relative mx-auto mt-6 h-10 w-[min(80vw,360px)]">
          <svg
            viewBox="0 0 360 40"
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M 8 30 Q 90 2 180 20 T 352 10"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
              pathLength="100"
            />

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
                transition:
                  "stroke-dashoffset 120ms linear",
              }}
            />

            <circle
              cx={dotX}
              cy={dotY}
              r="3"
              fill="rgb(103,232,249)"
              style={{
                filter:
                  "drop-shadow(0 0 8px rgba(34,211,238,1))",
                transition:
                  "cx 120ms linear, cy 120ms linear",
              }}
            />
          </svg>

          <div className="absolute left-[10%] right-[10%] top-8 h-4 rounded-full bg-cyan-300/[0.04] blur-xl" />
        </div>

        <p className="mt-2 font-mono text-[6px] tracking-[0.16em] text-white/20">
          {progress < 100
            ? "ESTABLISHING SECURE CONNECTION..."
            : "SECURE CONNECTION ESTABLISHED"}
        </p>
      </div>

      {/* FOOTER */}

      <div className="absolute bottom-7 left-0 right-0 text-center">
        <span className="font-mono text-[5px] tracking-[0.3em] text-white/15">
          RAJESH_REDDY // SECURE_NODE // 2026
        </span>
      </div>

      {/* ANIMATIONS */}

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
            transform:
              rotateX(65deg)
              rotateY(35deg)
              rotateZ(0deg);
          }

          100% {
            transform:
              rotateX(65deg)
              rotateY(35deg)
              rotateZ(360deg);
          }
        }

        @keyframes loaderCore {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              rotateX(0deg)
              rotateY(0deg)
              scale(1);
          }

          50% {
            transform:
              translate(-50%, -50%)
              rotateX(12deg)
              rotateY(18deg)
              scale(1.06);
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

/* ======================================================
   SCROLL PROGRESS
====================================================== */

function ScrollProgress() {
  useEffect(() => {
    const progress = document.getElementById(
      "global-scroll-progress"
    );

    if (!progress) return;

    let ticking = false;

    const updateProgress = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;

        const documentHeight =
          document.documentElement.scrollHeight -
          window.innerHeight;

        if (documentHeight <= 0) {
          progress.style.width = "0%";
          ticking = false;
          return;
        }

        const percentage =
          (scrollTop / documentHeight) * 100;

        const safePercentage = Math.min(
          Math.max(percentage, 0),
          100
        );

        progress.style.width = `${safePercentage}%`;

        ticking = false;
      });
    };

    updateProgress();

    window.addEventListener(
      "scroll",
      updateProgress,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateProgress
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateProgress
      );

      window.removeEventListener(
        "resize",
        updateProgress
      );
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9998] h-[2px] w-full"
    >
      <div
        id="global-scroll-progress"
        className="h-full w-0 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-[width] duration-75 ease-linear"
      />
    </div>
  );
}

/* ======================================================
   CURSOR GLOW
====================================================== */

function CursorGlow() {
  useEffect(() => {
    const glow = document.getElementById(
      "global-cursor-glow"
    );

    if (!glow) return;

    let animationFrame = 0;

    const handleMove = (event: MouseEvent) => {
      if (animationFrame) return;

      animationFrame = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(
          ${event.clientX - 120}px,
          ${event.clientY - 120}px,
          0
        )`;

        animationFrame = 0;
      });
    };

    window.addEventListener(
      "mousemove",
      handleMove,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div
      id="global-cursor-glow"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9997] hidden h-[240px] w-[240px] rounded-full bg-cyan-300/[0.025] blur-[80px] transition-transform duration-300 ease-out lg:block"
    />
  );
}

/* ======================================================
   HOME
====================================================== */

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPageLoaded(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      setPageLoaded(true);
    }
  }, [loading]);

  /* ======================================================
     SMOOTH ANCHOR SCROLL
  ====================================================== */

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target =
        event.target as HTMLElement | null;

      if (!target) return;

      const link = target.closest(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;

      if (!link) return;

      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let section: Element | null = null;

      try {
        section = document.querySelector(href);
      } catch {
        return;
      }

      if (!section) return;

      event.preventDefault();

      const navbarOffset = 90;

      const targetPosition =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarOffset;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });

      window.history.replaceState(
        null,
        "",
        href
      );
    };

    document.addEventListener(
      "click",
      handleAnchorClick
    );

    return () => {
      document.removeEventListener(
        "click",
        handleAnchorClick
      );
    };
  }, []);

  return (
    <Fragment>
      {/* ==================================================
          LOADER
      ================================================== */}

      {loading && (
        <PortfolioLoader
          onComplete={handleLoaderComplete}
        />
      )}

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className={[
          "relative min-h-screen overflow-x-hidden",
          "bg-[#010405] text-white",
          "transition-opacity duration-500 ease-out",
          pageLoaded
            ? "opacity-100"
            : "opacity-0",
        ].join(" ")}
      >
        {/* LIVE TIME */}

        <LiveTime />

        {/* ==================================================
            BACKGROUND
        ================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div className="absolute left-1/2 top-[-15%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-400/[0.025] blur-[150px]" />

          <div className="absolute left-[-10%] top-[35%] h-[350px] w-[350px] rounded-full bg-blue-500/[0.018] blur-[140px]" />

          <div className="absolute bottom-[15%] right-[-10%] h-[350px] w-[350px] rounded-full bg-cyan-400/[0.018] blur-[140px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div
          className={[
            "relative z-10",
            "transition-all duration-700 ease-out",
            pageLoaded
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0",
          ].join(" ")}
        >
          <Navbar />

          <Hero />

          <About />

          <SecurityDashboard />

          <Skills />

          <Projects />

          <Experience />

          <Education />

          <Certifications />

          <Resume />

          <Contact />

          <Admin />

          <Footer />
        </div>

        {/* EFFECTS */}

        <ScrollProgress />

        <CursorGlow />
      </main>

      {/* ======================================================
          GLOBAL STYLES
      ====================================================== */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #010405;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto !important;
          }

          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </Fragment>
  );
}