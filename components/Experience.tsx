"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Code2,
  LockKeyhole,
  Radar,
  ShieldCheck,
  Terminal,
} from "lucide-react";

type ExperienceItem = {
  company: string;
  role: string;
  type: string;
  duration: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  icon: "security" | "development";
  status: "completed" | "active";
};

const experiences: ExperienceItem[] = [
  {
    company: "Cybersecurity Internship",
    role: "Cybersecurity Intern",
    type: "INTERNSHIP",
    duration: "2025",
    location: "Remote",
    description:
      "Hands-on cybersecurity experience focused on security analysis, threat detection, vulnerability assessment, network security and practical defensive security concepts.",
    responsibilities: [
      "Performed security analysis and identified potential threats and vulnerabilities.",
      "Worked with cybersecurity concepts including network security and vulnerability assessment.",
      "Analyzed security scenarios and documented potential security risks.",
      "Developed practical understanding of defensive cybersecurity techniques.",
    ],
    technologies: [
      "Cybersecurity",
      "Threat Detection",
      "Network Security",
      "Vulnerability Analysis",
    ],
    icon: "security",
    status: "completed",
  },
  {
    company: "Python Development Internship",
    role: "Python Developer Intern",
    type: "INTERNSHIP",
    duration: "2025",
    location: "Remote",
    description:
      "Worked on Python-based development tasks with a focus on programming fundamentals, automation, debugging and practical problem solving.",
    responsibilities: [
      "Developed Python-based solutions for assigned technical tasks.",
      "Applied programming logic and debugging techniques to solve problems.",
      "Used Python scripting for automation and repetitive technical tasks.",
      "Improved understanding of software development workflows and version control.",
    ],
    technologies: [
      "Python",
      "Automation",
      "Problem Solving",
      "Git",
    ],
    icon: "development",
    status: "completed",
  },
];

export default function Experience() {
  const [visible, setVisible] = useState(false);
  const [activeExperience, setActiveExperience] =
    useState<number | null>(null);

  useEffect(() => {
    const section = document.getElementById("experience");

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      className="relative overflow-hidden border-y border-white/[0.04] bg-[#010405] py-28"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="experience-grid absolute inset-0" />

        <div className="absolute left-[5%] top-[15%] h-80 w-80 rounded-full bg-cyan-400/[0.025] blur-[130px]" />

        <div className="absolute bottom-[5%] right-[5%] h-80 w-80 rounded-full bg-blue-500/[0.02] blur-[130px]" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-400/[0.05] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
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
              EXPERIENCE // SECURITY CAREER
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
                Professional{" "}
                <span className="text-cyan-300">
                  Experience
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
                Practical experience across cybersecurity,
                Python development, security analysis and
                technical problem solving.
              </p>
            </div>

            {/* Career Status */}
            <div className="flex w-fit items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-4 py-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <div>
                <p className="font-mono text-[6px] tracking-[0.16em] text-white/30">
                  CAREER STATUS
                </p>

                <p className="mt-1 font-mono text-[8px] font-bold tracking-[0.12em] text-emerald-400">
                  SECURITY FOCUSED
                </p>
              </div>

              <ShieldCheck
                size={13}
                className="text-emerald-400/70"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop timeline */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent md:block" />

          {/* Mobile timeline */}
          <div className="absolute bottom-0 left-[20px] top-0 w-px bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent md:hidden" />

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={`${experience.company}-${experience.role}`}
                experience={experience}
                index={index}
                visible={visible}
                active={activeExperience === index}
                onEnter={() =>
                  setActiveExperience(index)
                }
                onLeave={() =>
                  setActiveExperience(null)
                }
              />
            ))}
          </div>
        </div>

        {/* Career Objective */}
        <div
          className={`mt-14 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: "500ms",
          }}
        >
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.018] p-6 backdrop-blur-xl sm:p-7">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">
                  <LockKeyhole
                    size={18}
                    className="text-cyan-300"
                  />
                </div>

                <div>
                  <p className="font-mono text-[7px] font-bold tracking-[0.16em] text-cyan-300">
                    CAREER OBJECTIVE
                  </p>

                  <p className="mt-2 max-w-2xl text-xs leading-6 text-white/50">
                    Building a career as a Junior Cybersecurity
                    Analyst with a focus on threat detection,
                    security monitoring, vulnerability analysis
                    and defensive security operations.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] px-4 py-3">
                <Terminal
                  size={12}
                  className="text-cyan-300"
                />

                <span className="font-mono text-[7px] font-bold tracking-[0.12em] text-cyan-300">
                  SECURITY // READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .experience-grid {
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
      `}</style>
    </section>
  );
}

/* =========================================================
   EXPERIENCE CARD
========================================================= */

function ExperienceCard({
  experience,
  index,
  visible,
  active,
  onEnter,
  onLeave,
}: {
  experience: ExperienceItem;
  index: number;
  visible: boolean;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative grid md:grid-cols-2">
      {/* Timeline Node */}
      <div className="absolute left-[20px] top-8 z-20 -translate-x-1/2 md:left-1/2">
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border bg-[#020607] transition-all duration-500 ${
            active
              ? "border-cyan-300/40 shadow-[0_0_35px_rgba(34,211,238,0.18)]"
              : "border-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.07)]"
          }`}
        >
          <span
            className={`absolute inset-1 rounded-full border transition-all duration-500 ${
              active
                ? "border-cyan-300/40"
                : "border-cyan-400/10"
            }`}
          />

          {experience.icon === "security" ? (
            <ShieldCheck
              size={15}
              className="relative text-cyan-300"
            />
          ) : (
            <Code2
              size={15}
              className="relative text-cyan-300"
            />
          )}

          {visible && (
            <span className="absolute -inset-1 animate-ping rounded-full border border-cyan-400/10" />
          )}
        </div>
      </div>

      {/* Empty Side */}
      <div
        className={`hidden md:block ${
          isLeft ? "md:col-start-2" : "md:col-start-1"
        }`}
      />

      {/* Card */}
      <div
        className={`pl-12 ${
          isLeft
            ? "md:col-start-1 md:row-start-1 md:pr-14 md:pl-0"
            : "md:col-start-2 md:row-start-1 md:pl-14"
        }`}
      >
        <article
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className={`group relative overflow-hidden rounded-3xl border bg-white/[0.018] p-6 backdrop-blur-xl transition-all duration-700 sm:p-7 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          } ${
            active
              ? "-translate-y-2 border-cyan-400/30 shadow-[0_25px_80px_rgba(34,211,238,0.08)]"
              : "border-white/[0.08] hover:-translate-y-1 hover:border-cyan-400/20"
          }`}
          style={{
            transitionDelay: `${index * 180}ms`,
          }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-cyan-400/[0.025] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.06]" />

          {/* Top line */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Header */}
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300 transition-transform duration-500 group-hover:scale-105">
                {experience.icon === "security" ? (
                  <ShieldCheck size={20} />
                ) : (
                  <Code2 size={20} />
                )}
              </div>

              <div>
                <p className="font-mono text-[7px] font-bold tracking-[0.16em] text-cyan-300/70">
                  {experience.type}
                </p>

                <h3 className="mt-1 text-xl font-black text-white transition-colors duration-300 group-hover:text-cyan-200">
                  {experience.role}
                </h3>

                <p className="mt-1 text-sm font-semibold text-white/60">
                  {experience.company}
                </p>
              </div>
            </div>

            {/* Status */}
            <span className="flex w-fit items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.025] px-3 py-1.5 font-mono text-[6px] font-bold tracking-[0.12em] text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              COMPLETED
            </span>
          </div>

          {/* Meta */}
          <div className="relative mt-6 flex flex-wrap gap-3">
            <MetaItem
              icon={<CalendarDays size={11} />}
              value={experience.duration}
            />

            <MetaItem
              icon={<BriefcaseBusiness size={11} />}
              value={experience.type}
            />

            <MetaItem
              icon={<Radar size={11} />}
              value={experience.location}
            />
          </div>

          {/* Description */}
          <p className="relative mt-6 text-xs leading-6 text-white/50">
            {experience.description}
          </p>

          {/* Responsibilities */}
          <div className="relative mt-6">
            <div className="mb-4 flex items-center gap-2">
              <Terminal
                size={12}
                className="text-cyan-300/70"
              />

              <span className="font-mono text-[7px] font-bold tracking-[0.14em] text-white/30">
                KEY ACTIVITIES
              </span>
            </div>

            <div className="space-y-3">
              {experience.responsibilities.map(
                (responsibility) => (
                  <div
                    key={responsibility}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={13}
                      className="mt-0.5 shrink-0 text-cyan-300/70"
                    />

                    <p className="text-[11px] leading-5 text-white/50">
                      {responsibility}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Technologies */}
          <div className="relative mt-6 border-t border-white/[0.06] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <Code2
                size={11}
                className="text-cyan-300/60"
              />

              <span className="font-mono text-[6px] font-bold tracking-[0.14em] text-white/25">
                TECHNOLOGIES
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {experience.technologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[6px] font-bold text-white/45 transition-all duration-300 group-hover:border-cyan-400/15 group-hover:text-cyan-200/70"
                  >
                    {technology}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={11}
                className="text-emerald-400/70"
              />

              <span className="font-mono text-[6px] tracking-[0.12em] text-emerald-400/70">
                SECURITY FOCUSED
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[6px] tracking-[0.12em] text-white/25 transition-colors group-hover:text-cyan-300/60">
              MODULE_0{index + 1}

              <ChevronRight size={10} />
            </div>
          </div>

          {/* Hover line */}
          <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-500 group-hover:w-2/3" />
        </article>
      </div>
    </div>
  );
}

/* =========================================================
   META ITEM
========================================================= */

function MetaItem({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[6px] tracking-[0.08em] text-white/35">
      <span className="text-cyan-300/60">
        {icon}
      </span>

      {value}
    </span>
  );
}