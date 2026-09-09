
"use client";

import { useEffect, useState } from "react";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Certification = {
  id: number;
  name: string;
  issuer: string;
  year: string;
};

const defaultCertifications: Certification[] = [
  {
    id: 1,
    name: "Cybersecurity Certification",
    issuer: "Professional Certification",
    year: "2025",
  },
];

export default function Certifications() {
  const [certifications, setCertifications] =
    useState<Certification[]>(
      defaultCertifications
    );

  const [visible, setVisible] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  /*
   * =========================================================
   * LOAD CERTIFICATIONS FROM POSTGRESQL
   * =========================================================
   */

  const loadCertifications = async () => {
    try {
      const response = await fetch(
        "/api/certifications",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch certifications"
        );
      }

      const data =
        await response.json();

      if (Array.isArray(data)) {
        setCertifications(data);
      } else {
        setCertifications(
          defaultCertifications
        );
      }
    } catch (error) {
      console.error(
        "Failed to load certifications from database:",
        error
      );

      /*
       * Keep portfolio usable if
       * database/API is temporarily unavailable.
       */
      setCertifications(
        defaultCertifications
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * INITIAL LOAD + INTERSECTION OBSERVER
   * =========================================================
   */

  useEffect(() => {
    loadCertifications();

    const section =
      document.getElementById(
        "certifications"
      );

    if (!section) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        },
        {
          threshold: 0.15,
        }
      );

    observer.observe(section);

    return () =>
      observer.disconnect();
  }, []);

  /*
   * =========================================================
   * LIVE DATABASE UPDATE
   * =========================================================
   */

  useEffect(() => {
    const handleCertificationUpdate =
      () => {
        loadCertifications();
      };

    window.addEventListener(
      "certifications-updated",
      handleCertificationUpdate
    );

    window.addEventListener(
      "portfolio-data-updated",
      handleCertificationUpdate
    );

    return () => {
      window.removeEventListener(
        "certifications-updated",
        handleCertificationUpdate
      );

      window.removeEventListener(
        "portfolio-data-updated",
        handleCertificationUpdate
      );
    };
  }, []);

  return (
    <section
      id="certifications"
      className="relative overflow-hidden border-y border-white/[0.04] bg-[#010405] py-28"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="cert-grid absolute inset-0" />

        <div className="absolute left-[8%] top-[15%] h-96 w-96 rounded-full bg-cyan-400/[0.025] blur-[150px]" />

        <div className="absolute bottom-[10%] right-[5%] h-96 w-96 rounded-full bg-blue-500/[0.025] blur-[150px]" />

        <div className="cert-particle left-[12%] top-[28%]" />
        <div className="cert-particle left-[35%] top-[65%]" />
        <div className="cert-particle right-[18%] top-[25%]" />
        <div className="cert-particle right-[30%] bottom-[20%]" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={`mb-16 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2">
            <Award
              size={12}
              className="text-cyan-300"
            />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              CERTIFICATIONS // VERIFIED
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
                Professional{" "}
                <span className="text-cyan-300">
                  Certifications
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                Industry-focused certifications
                demonstrating continuous learning
                and cybersecurity expertise.
              </p>
            </div>

            {/* DATABASE STATUS */}

            <div className="flex w-fit items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </span>

              <div>
                <p className="font-mono text-[6px] tracking-[0.16em] text-white/30">
                  CERTIFICATION DATABASE
                </p>

                <p className="mt-1 font-mono text-[8px] font-bold tracking-[0.12em] text-emerald-400">
                  {loading
                    ? "CONNECTING..."
                    : `LIVE // ${certifications.length} CERTIFICATIONS`}
                </p>
              </div>

              <BadgeCheck
                size={14}
                className="text-emerald-400/70"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            CERTIFICATION GRID
        ================================================== */}

        {certifications.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {certifications.map(
              (certification, index) => (
                <CertificationCard
                  key={certification.id}
                  certification={
                    certification
                  }
                  index={index}
                  visible={visible}
                />
              )
            )}
          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          certifications.length === 0 && (
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.018] p-12 text-center backdrop-blur-xl">
              <ShieldCheck
                size={30}
                className="mx-auto text-cyan-300/60"
              />

              <p className="mt-4 font-mono text-xs text-white/40">
                NO CERTIFICATIONS AVAILABLE
              </p>

              <p className="mt-2 text-xs text-white/25">
                Add certifications from the
                admin panel.
              </p>
            </div>
          )}

        {/* =================================================
            DATABASE FOOTER
        ================================================== */}

        <div
          className={`mt-10 transition-all duration-1000 delay-300 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03]">
                <Sparkles
                  size={14}
                  className="text-cyan-300"
                />
              </div>

              <div>
                <p className="font-mono text-[7px] font-bold tracking-[0.14em] text-cyan-300">
                  CERTIFICATION MONITOR
                </p>

                <p className="mt-1 font-mono text-[6px] tracking-[0.1em] text-white/25">
                  POSTGRESQL DATABASE SYNCHRONIZED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="font-mono text-[6px] tracking-[0.12em] text-emerald-400/70">
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style jsx>{`
        .cert-grid {
          background-image:
            linear-gradient(
              rgba(34, 211, 238, 0.015) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34, 211, 238, 0.015) 1px,
              transparent 1px
            );

          background-size: 52px 52px;

          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 82%
          );
        }

        .cert-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(
            103,
            232,
            249,
            0.6
          );

          box-shadow:
            0 0 12px
            rgba(34, 211, 238, 0.7);

          animation:
            certParticle 5s
            ease-in-out infinite;
        }

        @keyframes certParticle {
          0%,
          100% {
            transform:
              translate3d(0, 0, 0);
            opacity: 0.2;
          }

          50% {
            transform:
              translate3d(0, -20px, 0);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cert-particle {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   CERTIFICATION CARD
========================================================= */

function CertificationCard({
  certification,
  index,
  visible,
}: {
  certification: Certification;
  index: number;
  visible: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.018] p-6 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-cyan-400/20 hover:shadow-[0_25px_80px_rgba(34,211,238,0.06)] sm:p-7 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.06]" />

      {/* Scan line */}

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header */}

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Award size={20} />
          </div>

          <div>
            <p className="font-mono text-[6px] font-bold tracking-[0.14em] text-cyan-300/60">
              VERIFIED CERTIFICATION
            </p>

            <h3 className="mt-1 text-sm font-bold leading-5 text-white transition-colors group-hover:text-cyan-200">
              {certification.name}
            </h3>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.025] px-2.5 py-1.5">
          <BadgeCheck
            size={12}
            className="text-emerald-400"
          />

          <span className="font-mono text-[6px] font-bold tracking-[0.1em] text-emerald-400">
            VERIFIED
          </span>
        </div>
      </div>

      {/* Details */}

      <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={13}
              className="text-cyan-300/70"
            />

            <span className="font-mono text-[6px] font-bold tracking-[0.12em] text-white/25">
              ISSUER
            </span>
          </div>

          <p className="mt-2 text-xs font-semibold text-white/70">
            {certification.issuer}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.05] bg-black/20 p-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={13}
              className="text-cyan-300/70"
            />

            <span className="font-mono text-[6px] font-bold tracking-[0.12em] text-white/25">
              YEAR
            </span>
          </div>

          <p className="mt-2 text-xs font-semibold text-white/70">
            {certification.year}
          </p>
        </div>
      </div>

      {/* Footer */}

      <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.05] pt-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          <span className="font-mono text-[6px] tracking-[0.1em] text-emerald-400/60">
            ACTIVE CREDENTIAL
          </span>
        </div>

        <span className="flex items-center gap-1.5 font-mono text-[6px] tracking-[0.1em] text-white/20">
          CERT_
          {String(index + 1).padStart(
            2,
            "0"
          )}

          <ExternalLink size={9} />
        </span>
      </div>

      {/* Bottom hover line */}

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-500 group-hover:w-2/3" />
    </article>
  );
}