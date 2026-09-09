"use client";

import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
} from "lucide-react";

type EducationItem = {
  id: number;
  degree: string;
  institution: string;
  location: string | null;
  startYear: string | null;
  endYear: string | null;
  grade: string | null;
  description: string | null;
};

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH EDUCATION FROM ADMIN DATABASE
  ========================================================= */

  useEffect(() => {
    async function loadEducation() {
      try {
        setLoading(true);

        const response = await fetch("/api/education", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch education");
        }

        const data = await response.json();

        setEducation(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Education fetch error:",
          error
        );

        setEducation([]);
      } finally {
        setLoading(false);
      }
    }

    loadEducation();
  }, []);

  /* =========================================================
     SECTION ANIMATION
  ========================================================= */

  useEffect(() => {
    const section =
      document.getElementById("education");

    if (!section) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.12,
        }
      );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {
    return (
      <section
        id="education"
        className="relative overflow-hidden bg-[#010405] py-28"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/[0.05]" />

          <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/[0.04]" />

          <div className="mt-14 h-72 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.02]" />
        </div>
      </section>
    );
  }

  return (
    <section
      id="education"
      className="relative overflow-hidden bg-[#010405] py-28"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="education-grid absolute inset-0" />

        <div className="absolute left-[8%] top-1/4 h-80 w-80 rounded-full bg-cyan-400/[0.025] blur-[130px]" />

        <div className="absolute bottom-[10%] right-[8%] h-80 w-80 rounded-full bg-blue-500/[0.02] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className={`mb-14 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2">
            <GraduationCap
              size={13}
              className="text-cyan-300"
            />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              EDUCATION // ACADEMIC PROFILE
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            Education
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Academic foundation supporting my journey
            toward a career in cybersecurity and
            information security.
          </p>
        </div>

        {/* ===================================================
            NO DATA
        =================================================== */}

        {education.length === 0 ? (
          <div
            className={`rounded-3xl border border-white/[0.07] bg-white/[0.02] p-10 text-center transition-all duration-1000 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <GraduationCap
              size={32}
              className="mx-auto text-cyan-300/50"
            />

            <p className="mt-4 font-mono text-xs tracking-[0.15em] text-white/35">
              NO EDUCATION RECORDS AVAILABLE
            </p>

            <p className="mt-2 text-sm text-white/25">
              Add education from the admin panel.
            </p>
          </div>
        ) : (
          /* =================================================
             EDUCATION TIMELINE
          ================================================= */

          <div className="relative">

            {/* Timeline line */}

            <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400/40 via-cyan-400/10 to-transparent md:block" />

            {education.map((item, index) => {

              const duration =
                item.startYear || item.endYear
                  ? `${item.startYear || "—"} - ${
                      item.endYear || "Present"
                    }`
                  : "ACADEMIC PERIOD";

              return (
                <div
                  key={item.id}
                  className={`relative mb-8 last:mb-0 transition-all duration-1000 ${
                    visible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${
                      index * 180
                    }ms`,
                  }}
                >

                  {/* Timeline node */}

                  <div className="absolute left-0 top-8 hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-[#010405] text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.08)] md:flex">
                    <GraduationCap size={17} />
                  </div>

                  {/* Card */}

                  <div className="md:ml-16">
                    <article className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-cyan-400/[0.02] hover:shadow-[0_25px_70px_rgba(34,211,238,0.06)] sm:p-9">

                      {/* Glow */}

                      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.07]" />

                      <div className="relative">

                        {/* =================================================
                            TOP
                        ================================================= */}

                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                          <div>

                            <div className="mb-3 flex items-center gap-2">
                              <BookOpen
                                size={13}
                                className="text-cyan-300"
                              />

                              <span className="font-mono text-[7px] font-bold tracking-[0.18em] text-cyan-300/70">
                                ACADEMIC QUALIFICATION
                              </span>
                            </div>

                            <h3 className="text-2xl font-black text-white transition-colors duration-300 group-hover:text-cyan-200 sm:text-3xl">
                              {item.degree}
                            </h3>

                            <p className="mt-3 text-base font-semibold text-white/75">
                              {item.institution}
                            </p>

                          </div>

                          {/* Status */}

                          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.03] px-3 py-1.5 font-mono text-[6px] font-bold tracking-[0.12em] text-emerald-400">

                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>

                            {item.endYear
                              ? "COMPLETED"
                              : "CURRENT"}

                          </span>

                        </div>

                        {/* =================================================
                            META
                        ================================================= */}

                        <div className="mt-7 flex flex-wrap gap-3">

                          <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">

                            <CalendarDays
                              size={13}
                              className="text-cyan-300"
                            />

                            <span className="font-mono text-[7px] text-white/45">
                              {duration}
                            </span>

                          </div>

                          {item.location && (
                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">

                              <MapPin
                                size={13}
                                className="text-cyan-300"
                              />

                              <span className="font-mono text-[7px] text-white/45">
                                {item.location}
                              </span>

                            </div>
                          )}

                          {item.grade && (
                            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2">

                              <Award
                                size={13}
                                className="text-cyan-300"
                              />

                              <span className="font-mono text-[7px] text-white/45">
                                {item.grade}
                              </span>

                            </div>
                          )}

                        </div>

                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        {item.description && (
                          <p className="mt-7 max-w-3xl text-sm leading-7 text-white/55">
                            {item.description}
                          </p>
                        )}

                        {/* =================================================
                            ACADEMIC FOCUS
                        ================================================= */}

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">

                          <AcademicCard
                            icon={<Award size={15} />}
                            label="FOCUS"
                            value="Cybersecurity"
                          />

                          <AcademicCard
                            icon={<BookOpen size={15} />}
                            label="DOMAIN"
                            value="Computer Science"
                          />

                          <AcademicCard
                            icon={<GraduationCap size={15} />}
                            label="STATUS"
                            value={
                              item.endYear
                                ? "Graduate"
                                : "In Progress"
                            }
                          />

                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">

                          <span className="font-mono text-[6px] tracking-[0.14em] text-white/25">
                            ACADEMIC_RECORD //{" "}
                            {String(
                              index + 1
                            ).padStart(3, "0")}
                          </span>

                          <span className="font-mono text-[6px] tracking-[0.14em] text-cyan-300/60">
                            VERIFIED PROFILE
                          </span>

                        </div>

                      </div>

                      {/* Bottom line */}

                      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-all duration-500 group-hover:w-2/3" />

                    </article>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================
            BOTTOM STATUS
        =================================================== */}

        {education.length > 0 && (
          <div
            className={`mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-6 transition-all duration-1000 sm:flex-row sm:items-center sm:justify-between ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }`}
            style={{
              transitionDelay: `${
                education.length * 180 + 200
              }ms`,
            }}
          >

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />

              <span className="font-mono text-[7px] tracking-[0.14em] text-white/30">
                EDUCATION // CYBERSECURITY PATH
              </span>

            </div>

            <span className="font-mono text-[7px] tracking-[0.14em] text-cyan-300/60">
              CONTINUOUS LEARNING
            </span>

          </div>
        )}

      </div>

      {/* =====================================================
          GRID STYLE
      ===================================================== */}

      <style jsx>{`
        .education-grid {
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

          background-size: 48px 48px;

          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 80%
          );
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   ACADEMIC CARD
========================================================= */

function AcademicCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="group/item rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition-all duration-300 hover:border-cyan-400/20 hover:bg-cyan-400/[0.025]">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] text-cyan-300 transition-transform duration-300 group-hover/item:scale-105">
          {icon}
        </div>

        <div>

          <p className="font-mono text-[6px] font-bold tracking-[0.14em] text-white/25">
            {label}
          </p>

          <p className="mt-1 text-xs font-semibold text-white/70">
            {value}
          </p>

        </div>

      </div>
    </div>
  );
}