
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BrainCircuit,
  Code2,
  Cpu,
  Database,
  Globe,
  LockKeyhole,
  Network,
  Radar,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";

type Skill = {
  id: number;
  name: string;
  level: number;
  category: string;
};

const defaultSkills: Skill[] = [
  {
    id: 1,
    name: "Cybersecurity",
    level: 90,
    category: "Security",
  },
  {
    id: 2,
    name: "Python",
    level: 88,
    category: "Programming",
  },
  {
    id: 3,
    name: "Network Security",
    level: 85,
    category: "Security",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Security: <ShieldCheck size={16} />,
  Cybersecurity: <ShieldCheck size={16} />,
  Programming: <Code2 size={16} />,
  Development: <Terminal size={16} />,
  Networking: <Network size={16} />,
  Database: <Database size={16} />,
  Cloud: <Globe size={16} />,
  AI: <BrainCircuit size={16} />,
  Hardware: <Cpu size={16} />,
};

export default function Skills() {
  const [skills, setSkills] =
    useState<Skill[]>(defaultSkills);

  const [visible, setVisible] =
    useState(false);

  const [animatedValues, setAnimatedValues] =
    useState<Record<number, number>>({});

  const [loading, setLoading] =
    useState(true);

  /*
   * =========================================================
   * LOAD SKILLS FROM POSTGRESQL API
   * =========================================================
   */

  const loadSkills = async () => {
    try {
      const response = await fetch(
        "/api/skills",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch skills"
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSkills(data);
      } else {
        setSkills(defaultSkills);
      }
    } catch (error) {
      console.error(
        "Failed to load skills from database:",
        error
      );

      /*
       * If API/database is temporarily unavailable,
       * keep portfolio usable with default data.
       */
      setSkills(defaultSkills);
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    loadSkills();

    const section =
      document.getElementById("skills");

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
   * ADMIN / DATABASE LIVE UPDATE
   * =========================================================
   */

  useEffect(() => {
    const handleSkillsUpdate = () => {
      loadSkills();
      setAnimatedValues({});
    };

    window.addEventListener(
      "skills-updated",
      handleSkillsUpdate
    );

    window.addEventListener(
      "portfolio-data-updated",
      handleSkillsUpdate
    );

    return () => {
      window.removeEventListener(
        "skills-updated",
        handleSkillsUpdate
      );

      window.removeEventListener(
        "portfolio-data-updated",
        handleSkillsUpdate
      );
    };
  }, []);

  /*
   * =========================================================
   * LIVE NUMBER COUNTER
   * =========================================================
   */

  useEffect(() => {
    if (
      !visible ||
      skills.length === 0
    ) {
      return;
    }

    const timers: number[] = [];

    skills.forEach((skill) => {
      const target = Math.min(
        Math.max(skill.level, 0),
        100
      );

      if (target <= 0) {
        setAnimatedValues(
          (previous) => ({
            ...previous,
            [skill.id]: 0,
          })
        );

        return;
      }

      let current = 0;

      const duration = 700;

      const stepTime = Math.max(
        10,
        Math.floor(
          duration / target
        )
      );

      const timer =
        window.setInterval(() => {
          current += 2;

          if (current >= target) {
            current = target;

            window.clearInterval(
              timer
            );
          }

          setAnimatedValues(
            (previous) => ({
              ...previous,
              [skill.id]: current,
            })
          );
        }, stepTime);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) =>
        window.clearInterval(timer)
      );
    };
  }, [visible, skills]);

  /*
   * =========================================================
   * CATEGORY ICON
   * =========================================================
   */

  const getIcon = (
    category: string
  ) => {
    return (
      categoryIcons[category] ?? (
        <Zap size={16} />
      )
    );
  };

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-y border-white/[0.04] bg-[#010405] py-28"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="skills-grid absolute inset-0" />

        <div className="absolute left-[5%] top-[15%] h-96 w-96 rounded-full bg-cyan-400/[0.025] blur-[150px]" />

        <div className="absolute bottom-[5%] right-[5%] h-96 w-96 rounded-full bg-blue-500/[0.025] blur-[150px]" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-400/[0.03] to-transparent" />

        <div className="skill-particle left-[10%] top-[25%]" />
        <div className="skill-particle left-[25%] top-[65%]" />
        <div className="skill-particle right-[15%] top-[30%]" />
        <div className="skill-particle right-[25%] bottom-[20%]" />
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
            <Radar
              size={12}
              className="text-cyan-300"
            />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              SKILLS // LIVE SYSTEM
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
                Technical{" "}
                <span className="text-cyan-300">
                  Skills
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                Cybersecurity-focused technical
                capabilities across security,
                programming, networking and
                security analysis.
              </p>
            </div>

            {/* LIVE STATUS */}

            <div className="flex w-fit items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </span>

              <div>
                <p className="font-mono text-[6px] tracking-[0.16em] text-white/30">
                  SKILL DATABASE
                </p>

                <p className="mt-1 font-mono text-[8px] font-bold tracking-[0.12em] text-emerald-400">
                  {loading
                    ? "CONNECTING..."
                    : `LIVE // ${skills.length} SKILLS`}
                </p>
              </div>

              <Activity
                size={14}
                className="text-emerald-400/70"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            SKILLS GRID
        ================================================== */}

        {skills.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {skills.map(
              (skill, index) => {
                const value =
                  animatedValues[
                    skill.id
                  ] ?? 0;

                return (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    value={value}
                    index={index}
                    visible={visible}
                    icon={getIcon(
                      skill.category
                    )}
                  />
                );
              }
            )}
          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          skills.length === 0 && (
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.018] p-12 text-center backdrop-blur-xl">
              <LockKeyhole
                size={28}
                className="mx-auto text-cyan-300/60"
              />

              <p className="mt-4 font-mono text-xs text-white/40">
                NO SKILLS AVAILABLE
              </p>

              <p className="mt-2 text-xs text-white/25">
                Add skills from the admin panel.
              </p>
            </div>
          )}

        {/* =================================================
            LIVE SYSTEM FOOTER
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
                <Terminal
                  size={14}
                  className="text-cyan-300"
                />
              </div>

              <div>
                <p className="font-mono text-[7px] font-bold tracking-[0.14em] text-cyan-300">
                  LIVE SKILL MONITOR
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
        .skills-grid {
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

        .skill-particle {
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
            skillParticle 5s
            ease-in-out infinite;
        }

        @keyframes skillParticle {
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
          .skill-particle {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   SKILL CARD
========================================================= */

function SkillCard({
  skill,
  value,
  index,
  visible,
  icon,
}: {
  skill: Skill;
  value: number;
  index: number;
  visible: boolean;
  icon: React.ReactNode;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.018] p-6 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-cyan-400/20 hover:shadow-[0_25px_80px_rgba(34,211,238,0.06)] sm:p-7 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 90}ms`,
      }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/[0.025] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.06]" />

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>

          <div>
            <p className="font-mono text-[6px] font-bold tracking-[0.14em] text-cyan-300/60">
              {skill.category}
            </p>

            <h3 className="mt-1 text-sm font-bold text-white transition-colors group-hover:text-cyan-200">
              {skill.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end">
            <span className="font-mono text-2xl font-black text-cyan-300 tabular-nums drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
              {value}
            </span>

            <span className="ml-0.5 font-mono text-xs text-cyan-300/60">
              %
            </span>
          </div>

          <span className="font-mono text-[5px] tracking-[0.12em] text-white/20">
            PROFICIENCY
          </span>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-[width] duration-100"
            style={{
              width: `${value}%`,
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute top-0 h-1.5 w-10 bg-white/50 blur-sm opacity-40"
          style={{
            left: `${Math.max(
              value - 8,
              0
            )}%`,
          }}
        />
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />

          <span className="font-mono text-[6px] tracking-[0.1em] text-emerald-400/60">
            ACTIVE
          </span>
        </div>

        <span className="font-mono text-[6px] tracking-[0.1em] text-white/20">
          SKILL_0
          {index + 1}
        </span>
      </div>

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-500 group-hover:w-2/3" />
    </article>
  );
}