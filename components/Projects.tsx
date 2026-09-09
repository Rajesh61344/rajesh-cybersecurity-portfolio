"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  ExternalLink,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from "lucide-react";

type ProjectIconType = "phishing" | "malware" | "risk";

type ProjectStatus = "active" | "research";

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  statusType: ProjectStatus;
  technologies: string[];
  progress: number;
  icon: ProjectIconType;
  github?: string | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =========================================================
   * LOAD PROJECTS FROM POSTGRESQL
   * =========================================================
   */

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/projects", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
      setError("Unable to load projects");
      setProjects([]);
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
    loadProjects();
  }, []);

  /*
   * =========================================================
   * SCROLL REVEAL
   * =========================================================
   */

  useEffect(() => {
    const section = document.getElementById("projects");

    if (!section) return;

    const observer = new IntersectionObserver(
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

  /*
   * =========================================================
   * ADMIN LIVE UPDATE
   * =========================================================
   */

  useEffect(() => {
    const handleProjectsUpdate = () => {
      loadProjects();
    };

    window.addEventListener(
      "projects-updated",
      handleProjectsUpdate
    );

    return () => {
      window.removeEventListener(
        "projects-updated",
        handleProjectsUpdate
      );
    };
  }, []);

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#010405] py-28"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="projects-grid absolute inset-0" />

        <div className="absolute left-[5%] top-[18%] h-80 w-80 rounded-full bg-cyan-400/[0.025] blur-[130px]" />

        <div className="absolute bottom-[5%] right-[5%] h-96 w-96 rounded-full bg-blue-500/[0.02] blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.012] blur-[120px]" />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div
          className={`mb-14 transition-all duration-1000 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.035] px-4 py-2 shadow-[0_0_25px_rgba(34,211,238,0.03)]">
            <Radar
              size={13}
              className="text-cyan-300"
            />

            <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-cyan-300">
              SECURITY PROJECTS // LAB
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                Security
                <span className="text-cyan-300">
                  {" "}
                  Projects
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                Practical cybersecurity projects focused on
                threat detection, malware analysis, automation,
                machine learning and cyber risk assessment.
              </p>
            </div>

            {/* LIVE STATUS */}

            <div className="hidden items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-4 py-3 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
              </span>

              <span className="font-mono text-[7px] font-bold tracking-[0.15em] text-emerald-400">
                LAB ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/[0.02] p-12 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />

            <p className="font-mono text-[8px] font-bold tracking-[0.15em] text-cyan-300">
              LOADING PROJECT DATABASE...
            </p>
          </div>
        )}

        {/* ===================================================
            ERROR
        ==================================================== */}

        {!loading && error && (
          <div className="rounded-3xl border border-red-400/10 bg-red-400/[0.02] p-12 text-center">
            <ShieldAlert
              size={28}
              className="mx-auto text-red-300/60"
            />

            <p className="mt-4 font-mono text-[8px] font-bold tracking-[0.15em] text-red-300">
              PROJECT DATABASE ERROR
            </p>

            <p className="mt-2 text-xs text-white/30">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProjects}
              className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.04] px-4 py-2 font-mono text-[7px] font-bold tracking-[0.12em] text-red-300 transition hover:bg-red-400/[0.08]"
            >
              RETRY
            </button>
          </div>
        )}

        {/* ===================================================
            PROJECT GRID
        ==================================================== */}

        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                visible={visible}
              />
            ))}
          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {!loading && !error && projects.length === 0 && (
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.018] p-12 text-center backdrop-blur-xl">
            <Terminal
              size={28}
              className="mx-auto text-cyan-300/50"
            />

            <p className="mt-4 font-mono text-[8px] font-bold tracking-[0.15em] text-white/40">
              NO PROJECTS FOUND
            </p>

            <p className="mt-2 text-xs text-white/25">
              Add projects from the admin dashboard.
            </p>
          </div>
        )}

        {/* ===================================================
            BOTTOM STATUS
        ==================================================== */}

        {!loading && !error && projects.length > 0 && (
          <div
            className={`mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 backdrop-blur-xl transition-all duration-1000 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{
              transitionDelay: "650ms",
            }}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />

                  <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <div>
                  <p className="font-mono text-[7px] font-bold tracking-[0.15em] text-emerald-400">
                    PROJECT LAB STATUS
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    Security modules monitored and continuously
                    improved.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-[7px] tracking-[0.14em] text-white/25">
                  {String(projects.length).padStart(2, "0")} MODULES
                </span>

                <span className="h-1 w-1 rounded-full bg-emerald-400" />

                <span className="font-mono text-[7px] tracking-[0.14em] text-emerald-400">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          GRID CSS
      ====================================================== */}

      <style jsx>{`
        .projects-grid {
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
   PROJECT CARD
========================================================= */

function ProjectCard({
  project,
  index,
  visible,
}: {
  project: Project;
  index: number;
  visible: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-cyan-400/25 hover:bg-cyan-400/[0.025] hover:shadow-[0_25px_80px_rgba(34,211,238,0.07)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-14 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 140}ms`,
      }}
    >
      {/* Card glow */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-400/[0.025] blur-3xl transition-all duration-500 group-hover:bg-cyan-400/[0.08]" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-500/[0.015] blur-3xl" />

      {/* TOP */}

      <div className="relative flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] text-cyan-300 transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-300/30 group-hover:bg-cyan-400/[0.08] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.1)]">
          <ProjectIcon type={project.icon} />
        </div>

        <span
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[6px] font-bold tracking-[0.12em] ${
            project.statusType === "research"
              ? "border-yellow-400/15 bg-yellow-400/[0.03] text-yellow-300"
              : "border-emerald-400/15 bg-emerald-400/[0.03] text-emerald-400"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-40" />

            <span className="relative h-1.5 w-1.5 rounded-full bg-current" />
          </span>

          {project.status}
        </span>
      </div>

      {/* CATEGORY */}

      <p className="relative mt-6 font-mono text-[7px] font-bold tracking-[0.16em] text-cyan-300/70">
        {project.category}
      </p>

      {/* TITLE */}

      <h3 className="relative mt-2 min-h-[58px] text-xl font-black leading-tight text-white transition-colors duration-300 group-hover:text-cyan-200">
        {project.title}
      </h3>

      {/* DESCRIPTION */}

      <p className="relative mt-3 min-h-[96px] text-xs leading-6 text-white/50">
        {project.description}
      </p>

      {/* TECHNOLOGIES */}

      <div className="relative mt-5 flex min-h-[52px] flex-wrap content-start gap-2">
        {project.technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[6px] font-bold tracking-wide text-white/45 transition-all duration-300 group-hover:border-cyan-400/15 group-hover:text-white/70"
          >
            {technology}
          </span>
        ))}
      </div>

      {/* SECURITY PROGRESS */}

      <div className="relative mt-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[6px] font-bold tracking-[0.12em] text-white/25">
            SECURITY MODULE
          </span>

          <span className="font-mono text-[7px] font-bold text-cyan-300">
            {project.progress}%
          </span>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-[1400ms]"
            style={{
              width: visible
                ? `${project.progress}%`
                : "0%",
              transitionDelay: `${index * 180 + 500}ms`,
            }}
          />
        </div>
      </div>

      {/* FOOTER */}

      <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div className="flex items-center gap-2">
          <Terminal
            size={12}
            className="text-white/25"
          />

          <span className="font-mono text-[6px] tracking-[0.1em] text-white/25">
            MODULE_0{index + 1}
          </span>
        </div>

        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} GitHub`}
            className="group/link inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.01] px-3 py-2 transition-all duration-300 hover:border-cyan-400/25 hover:bg-cyan-400/[0.04]"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-md border border-white/[0.12] font-mono text-[6px] font-black text-white/45 transition-colors group-hover/link:border-cyan-400/30 group-hover/link:text-cyan-300">
              GH
            </span>

            <span className="font-mono text-[6px] font-bold text-white/45 transition-colors group-hover/link:text-white">
              VIEW
            </span>

            <ExternalLink
              size={10}
              className="text-white/25 transition-colors group-hover/link:text-cyan-300"
            />
          </a>
        ) : (
          <span className="font-mono text-[6px] text-white/20">
            PRIVATE
          </span>
        )}
      </div>

      {/* Bottom hover line */}

      <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-500 group-hover:w-2/3" />
    </article>
  );
}

/* =========================================================
   PROJECT ICON
========================================================= */

function ProjectIcon({
  type,
}: {
  type: ProjectIconType;
}) {
  switch (type) {
    case "phishing":
      return <ShieldAlert size={19} />;

    case "malware":
      return <ShieldCheck size={19} />;

    case "risk":
      return <BrainCircuit size={19} />;

    default:
      return <Terminal size={19} />;
  }
}