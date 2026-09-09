"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  Info,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Profile = {
  id: number;
  name: string;
  title: string;
  tagline: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  profileImage: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
  availability: string | null;
};

type About = {
  id: number;
  heading: string;
  description: string;
  highlights: string[];
};

type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
};

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  statusType: string;
  technologies: string[];
  progress: number;
  icon: string;
  github: string | null;
  liveUrl: string | null;
  image: string | null;
  featured: boolean;
};

type Experience = {
  id: number;
  role: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  technologies: string[];
};

type Education = {
  id: number;
  degree: string;
  institution: string;
  location: string | null;
  startYear: string | null;
  endYear: string | null;
  grade: string | null;
  description: string | null;
};

type Certification = {
  id: number;
  name: string;
  issuer: string;
  year: string;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
};

type Resume = {
  id: number;
  title: string;
  fileUrl: string;
  downloadUrl: string | null;
};

type Tab =
  | "overview"
  | "profile"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "resume";

type NotificationType = "success" | "error" | "info";

type AdminNotification = {
  type: NotificationType;
  title: string;
  message: string;
};

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  date: Date;
};

/* =========================================================
   API HELPER
========================================================= */

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const contentType =
    response.headers.get("content-type") || "";

  const rawText = await response.text();

  let data: unknown = null;

  if (rawText.trim()) {
    if (contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `API ${url} returned invalid JSON.`
        );
      }
    } else {
      throw new Error(
        `API ${url} returned a non-JSON response (${response.status}). Check the API route.`
      );
    }
  }

  if (!response.ok) {
    let errorMessage =
      `Request failed: ${response.status}`;

    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      errorMessage = data.error;
    }

    throw new Error(errorMessage);
  }

  return data as T;
}

/* =========================================================
   HELPERS
========================================================= */

function cleanString(
  value: string | null | undefined
) {
  return value?.trim() || null;
}

function stringArray(
  value: string
): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeResumeResponse(
  value: unknown
): Resume[] {
  if (value == null) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      isResume(item)
        ? [item]
        : normalizeResumeResponse(item)
    );
  }

  if (typeof value !== "object") {
    return [];
  }

  if (isResume(value)) {
    return [value];
  }

  const record = value as Record<string, unknown>;

  if ("resume" in record) {
    return normalizeResumeResponse(record.resume);
  }

  if ("data" in record) {
    return normalizeResumeResponse(record.data);
  }

  return [];
}

function isResume(
  value: unknown
): value is Resume {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "number" &&
    typeof record.title === "string" &&
    typeof record.fileUrl === "string"
  );
}

/* =========================================================
   MAIN ADMIN PAGE
========================================================= */

export default function AdminPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("overview");

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [about, setAbout] =
    useState<About | null>(null);

  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [experiences, setExperiences] =
    useState<Experience[]>([]);

  const [education, setEducation] =
    useState<Education[]>([]);

  const [certifications, setCertifications] =
    useState<Certification[]>([]);

  const [resumes, setResumes] =
    useState<Resume[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [notification, setNotification] =
    useState<AdminNotification | null>(null);

  const [logoutNotification, setLogoutNotification] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState("");

  const [currentDate, setCurrentDate] =
    useState("");

  /* =======================================================
     NOTIFICATION
  ======================================================= */

  function showNotification(
    type: NotificationType,
    title: string,
    message: string
  ) {
    setNotification({
      type,
      title,
      message,
    });

    window.setTimeout(() => {
      setNotification(null);
    }, 3500);
  }

  /* =======================================================
     LOAD DATA
  ======================================================= */

  async function loadData() {
    try {
      setLoading(true);

      const results =
        await Promise.allSettled([
          apiRequest<Profile | null>(
            "/api/profile"
          ),
          apiRequest<About | null>(
            "/api/about"
          ),
          apiRequest<Skill[]>(
            "/api/skills"
          ),
          apiRequest<Project[]>(
            "/api/projects"
          ),
          apiRequest<Experience[]>(
            "/api/experience"
          ),
          apiRequest<Education[]>(
            "/api/education"
          ),
          apiRequest<Certification[]>(
            "/api/certifications"
          ),
          apiRequest<unknown>(
            "/api/resume"
          ),
        ]);

      const [
        profileResult,
        aboutResult,
        skillsResult,
        projectsResult,
        experienceResult,
        educationResult,
        certificationsResult,
        resumeResult,
      ] = results;

      if (
        profileResult.status ===
        "fulfilled"
      ) {
        setProfile(
          profileResult.value
        );
      }

      if (
        aboutResult.status ===
        "fulfilled"
      ) {
        setAbout(
          aboutResult.value
        );
      }

      if (
        skillsResult.status ===
        "fulfilled"
      ) {
        setSkills(
          Array.isArray(
            skillsResult.value
          )
            ? [...skillsResult.value].sort(
                (a, b) => b.id - a.id
              )
            : []
        );
      }

      if (
        projectsResult.status ===
        "fulfilled"
      ) {
        setProjects(
          Array.isArray(
            projectsResult.value
          )
            ? [...projectsResult.value].sort(
                (a, b) => b.id - a.id
              )
            : []
        );
      }

      if (
        experienceResult.status ===
        "fulfilled"
      ) {
        setExperiences(
          Array.isArray(
            experienceResult.value
          )
            ? [...experienceResult.value].sort(
                (a, b) => b.id - a.id
              )
            : []
        );
      }

      if (
        educationResult.status ===
        "fulfilled"
      ) {
        setEducation(
          Array.isArray(
            educationResult.value
          )
            ? [...educationResult.value].sort(
                (a, b) => b.id - a.id
              )
            : []
        );
      }

      if (
        certificationsResult.status ===
        "fulfilled"
      ) {
        setCertifications(
          Array.isArray(
            certificationsResult.value
          )
            ? [
                ...certificationsResult.value,
              ].sort(
                (a, b) => b.id - a.id
              )
            : []
        );
      }

      if (
        resumeResult.status ===
        "fulfilled"
      ) {
        setResumes(
          normalizeResumeResponse(
            resumeResult.value
          )
        );
      }

      const failed =
        results.filter(
          (result) =>
            result.status ===
            "rejected"
        );

      if (failed.length > 0) {
        console.warn(
          "Some admin APIs failed:",
          failed
        );
      }
    } catch (error) {
      console.error(
        "Admin load error:",
        error
      );

      showNotification(
        "error",
        "LOAD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to load portfolio data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     CLOCK
  ======================================================= */

  useEffect(() => {
    function updateClock() {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }
        )
      );

      setCurrentDate(
        now.toLocaleDateString(
          "en-IN",
          {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      );
    }

    updateClock();

    const interval =
      window.setInterval(
        updateClock,
        1000
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, []);

  /* =======================================================
     ADD SKILL
  ======================================================= */

  async function addSkill() {
    try {
      setSaving(true);

      const skill =
        await apiRequest<Skill>(
          "/api/skills",
          {
            method: "POST",
            body: JSON.stringify({
              name: "New Skill",
              category: "Security",
              level: 80,
            }),
          }
        );

      setSkills((items) => [
        skill,
        ...items,
      ]);

      setActiveTab("skills");

      showNotification(
        "success",
        "SKILL ADDED",
        "Skill added successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "ADD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to add skill."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     ADD PROJECT
  ======================================================= */

  async function addProject() {
    try {
      setSaving(true);

      const project =
        await apiRequest<Project>(
          "/api/projects",
          {
            method: "POST",
            body: JSON.stringify({
              title:
                "New Cybersecurity Project",
              description:
                "Cybersecurity project description.",
              category:
                "Cybersecurity",
              status: "Completed",
              statusType: "success",
              technologies: [
                "Python",
                "Cybersecurity",
              ],
              progress: 100,
              icon: "ShieldCheck",
              github: "",
              liveUrl: "",
              image: "",
              featured: false,
            }),
          }
        );

      setProjects((items) => [
        project,
        ...items,
      ]);

      setActiveTab("projects");

      showNotification(
        "success",
        "PROJECT ADDED",
        "Project added successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "ADD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to add project."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     ADD EXPERIENCE
  ======================================================= */

  async function addExperience() {
    try {
      setSaving(true);

      const experience =
        await apiRequest<Experience>(
          "/api/experience",
          {
            method: "POST",
            body: JSON.stringify({
              role:
                "Junior Cybersecurity Analyst",
              company:
                "Company Name",
              location: "India",
              startDate: "2026",
              endDate: null,
              current: true,
              description:
                "Cybersecurity experience description.",
              technologies: [
                "Python",
                "Cybersecurity",
              ],
            }),
          }
        );

      setExperiences((items) => [
        experience,
        ...items,
      ]);

      setActiveTab("experience");

      showNotification(
        "success",
        "EXPERIENCE ADDED",
        "Experience added successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "ADD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to add experience."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     ADD EDUCATION
  ======================================================= */

  async function addEducation() {
    try {
      setSaving(true);

      const item =
        await apiRequest<Education>(
          "/api/education",
          {
            method: "POST",
            body: JSON.stringify({
              degree: "B.Tech",
              institution:
                "University / College",
              location: "India",
              startYear: "",
              endYear: "",
              grade: "",
              description: "",
            }),
          }
        );

      setEducation((items) => [
        item,
        ...items,
      ]);

      setActiveTab("education");

      showNotification(
        "success",
        "EDUCATION ADDED",
        "Education added successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "ADD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to add education."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     ADD CERTIFICATION
  ======================================================= */

  async function addCertification() {
    try {
      setSaving(true);

      const item =
        await apiRequest<Certification>(
          "/api/certifications",
          {
            method: "POST",
            body: JSON.stringify({
              name:
                "New Certification",
              issuer:
                "Certification Provider",
              year: String(
                new Date().getFullYear()
              ),
              credentialId: "",
              credentialUrl: "",
              description: "",
            }),
          }
        );

      setCertifications((items) => [
        item,
        ...items,
      ]);

      setActiveTab(
        "certifications"
      );

      showNotification(
        "success",
        "CERTIFICATION ADDED",
        "Certification added successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "ADD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to add certification."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     ADD RESUME
  ======================================================= */

  async function addResume() {
    try {
      setSaving(true);

      const title =
        window.prompt(
          "Enter resume title:",
          "Rajesh Reddy - Resume"
        );

      if (!title?.trim()) {
        showNotification(
          "error",
          "RESUME ERROR",
          "Resume title is required."
        );
        return;
      }

      const fileUrl =
        window.prompt(
          "Enter resume file URL:",
          "/resume.pdf"
        );

      if (!fileUrl?.trim()) {
        showNotification(
          "error",
          "RESUME ERROR",
          "Resume file URL is required."
        );
        return;
      }

      const resume =
        await apiRequest<Resume>(
          "/api/resume",
          {
            method: "POST",
            body: JSON.stringify({
              title: title.trim(),
              fileUrl:
                fileUrl.trim(),
              downloadUrl:
                fileUrl.trim(),
            }),
          }
        );

      setResumes((items) => [
        resume,
        ...items,
      ]);

      setActiveTab("resume");

      showNotification(
        "success",
        "RESUME ADDED",
        "Resume added successfully."
      );
    } catch (error) {
      console.error(
        "Add resume error:",
        error
      );

      showNotification(
        "error",
        "ADD ERROR",
        error instanceof Error
          ? error.message
          : "Failed to add resume."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     DELETE RESUME
  ======================================================= */

  async function deleteResume(
    id: number
  ) {
    if (
      !window.confirm(
        "Delete this resume?"
      )
    ) {
      return;
    }

    try {
      setSaving(true);

      await apiRequest(
        "/api/resume",
        {
          method: "DELETE",
          body: JSON.stringify({
            id,
          }),
        }
      );

      setResumes((items) =>
        items.filter(
          (item) => item.id !== id
        )
      );

      showNotification(
        "success",
        "RESUME DELETED",
        "Resume deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      showNotification(
        "error",
        "DELETE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to delete resume."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     DELETE GENERIC
  ======================================================= */

  async function deleteRecord(
    endpoint: string,
    id: number,
    label: string,
    onSuccess: () => void
  ) {
    if (
      !window.confirm(
        `Delete this ${label}?`
      )
    ) {
      return;
    }

    try {
      setSaving(true);

      await apiRequest(
        `${endpoint}/${id}`,
        {
          method: "DELETE",
        }
      );

      onSuccess();

      showNotification(
        "success",
        `${label.toUpperCase()} DELETED`,
        `${label} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `Delete ${label} error:`,
        error
      );

      showNotification(
        "error",
        "DELETE ERROR",
        error instanceof Error
          ? error.message
          : `Failed to delete ${label}.`
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  async function saveProfile(
    value: Profile
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<Profile>(
          "/api/profile",
          {
            method: "PUT",
            body: JSON.stringify({
              id: value.id,
              name: value.name,
              title: value.title,
              tagline:
                cleanString(
                  value.tagline
                ),
              description:
                cleanString(
                  value.description
                ),
              email:
                cleanString(
                  value.email
                ),
              phone:
                cleanString(
                  value.phone
                ),
              location:
                cleanString(
                  value.location
                ),
              profileImage:
                cleanString(
                  value.profileImage
                ),
              github:
                cleanString(
                  value.github
                ),
              linkedin:
                cleanString(
                  value.linkedin
                ),
              resumeUrl:
                cleanString(
                  value.resumeUrl
                ),
              availability:
                cleanString(
                  value.availability
                ),
            }),
          }
        );

      setProfile(updated);

      showNotification(
        "success",
        "PROFILE UPDATED",
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     CREATE PROFILE
  ======================================================= */

  async function createProfile(
    value: Profile
  ) {
    try {
      setSaving(true);

      const created =
        await apiRequest<Profile>(
          "/api/profile",
          {
            method: "POST",
            body: JSON.stringify({
              name: value.name,
              title: value.title,
              tagline:
                cleanString(
                  value.tagline
                ),
              description:
                cleanString(
                  value.description
                ),
              email:
                cleanString(
                  value.email
                ),
              phone:
                cleanString(
                  value.phone
                ),
              location:
                cleanString(
                  value.location
                ),
              profileImage:
                cleanString(
                  value.profileImage
                ),
              github:
                cleanString(
                  value.github
                ),
              linkedin:
                cleanString(
                  value.linkedin
                ),
              resumeUrl:
                cleanString(
                  value.resumeUrl
                ),
              availability:
                cleanString(
                  value.availability
                ),
            }),
          }
        );

      setProfile(created);

      showNotification(
        "success",
        "PROFILE CREATED",
        "Profile created successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "CREATE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to create profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE ABOUT
  ======================================================= */

  async function saveAbout(
    value: About
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<About>(
          "/api/about",
          {
            method: "PUT",
            body: JSON.stringify({
              id: value.id,
              heading:
                value.heading,
              description:
                value.description,
              highlights:
                value.highlights,
            }),
          }
        );

      setAbout(updated);

      showNotification(
        "success",
        "ABOUT UPDATED",
        "About section updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update About."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     CREATE ABOUT
  ======================================================= */

  async function createAbout(
    value: About
  ) {
    try {
      setSaving(true);

      const created =
        await apiRequest<About>(
          "/api/about",
          {
            method: "POST",
            body: JSON.stringify({
              heading:
                value.heading,
              description:
                value.description,
              highlights:
                value.highlights,
            }),
          }
        );

      setAbout(created);

      showNotification(
        "success",
        "ABOUT CREATED",
        "About section created successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "CREATE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to create About."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE SKILL
  ======================================================= */

  async function saveSkill(
    value: Skill
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<Skill>(
          `/api/skills/${value.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: value.name,
              category:
                value.category,
              level: Number(
                value.level
              ),
            }),
          }
        );

      setSkills((items) =>
        items.map((item) =>
          item.id === updated.id
            ? updated
            : item
        )
      );

      showNotification(
        "success",
        "SKILL UPDATED",
        "Skill updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update skill."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE PROJECT
  ======================================================= */

  async function saveProject(
    value: Project
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<Project>(
          `/api/projects/${value.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              title: value.title,
              description:
                value.description,
              category:
                value.category,
              status:
                value.status,
              statusType:
                value.statusType,
              technologies:
                value.technologies,
              progress: Number(
                value.progress
              ),
              icon: value.icon,
              github:
                cleanString(
                  value.github
                ),
              liveUrl:
                cleanString(
                  value.liveUrl
                ),
              image:
                cleanString(
                  value.image
                ),
              featured:
                Boolean(
                  value.featured
                ),
            }),
          }
        );

      setProjects((items) => [
        updated,
        ...items.filter(
          (item) =>
            item.id !== updated.id
        ),
      ]);

      showNotification(
        "success",
        "PROJECT UPDATED",
        "Project updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update project."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE EXPERIENCE
  ======================================================= */

  async function saveExperience(
    value: Experience
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<Experience>(
          `/api/experience/${value.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              role: value.role,
              company:
                value.company,
              location:
                cleanString(
                  value.location
                ),
              startDate:
                value.startDate,
              endDate:
                value.current
                  ? null
                  : cleanString(
                      value.endDate
                    ),
              current:
                Boolean(
                  value.current
                ),
              description:
                value.description,
              technologies:
                value.technologies,
            }),
          }
        );

      setExperiences((items) => [
        updated,
        ...items.filter(
          (item) =>
            item.id !== updated.id
        ),
      ]);

      showNotification(
        "success",
        "EXPERIENCE UPDATED",
        "Experience updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update experience."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE EDUCATION
  ======================================================= */

  async function saveEducation(
    value: Education
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<Education>(
          `/api/education/${value.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              degree:
                value.degree,
              institution:
                value.institution,
              location:
                cleanString(
                  value.location
                ),
              startYear:
                cleanString(
                  value.startYear
                ),
              endYear:
                cleanString(
                  value.endYear
                ),
              grade:
                cleanString(
                  value.grade
                ),
              description:
                cleanString(
                  value.description
                ),
            }),
          }
        );

      setEducation((items) => [
        updated,
        ...items.filter(
          (item) =>
            item.id !== updated.id
        ),
      ]);

      showNotification(
        "success",
        "EDUCATION UPDATED",
        "Education updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update education."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE CERTIFICATION
  ======================================================= */

  async function saveCertification(
    value: Certification
  ) {
    try {
      setSaving(true);

      const updated =
        await apiRequest<Certification>(
          `/api/certifications/${value.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: value.name,
              issuer:
                value.issuer,
              year: value.year,
              credentialId:
                cleanString(
                  value.credentialId
                ),
              credentialUrl:
                cleanString(
                  value.credentialUrl
                ),
              description:
                cleanString(
                  value.description
                ),
            }),
          }
        );

      setCertifications(
        (items) => [
          updated,
          ...items.filter(
            (item) =>
              item.id !==
              updated.id
          ),
        ]
      );

      showNotification(
        "success",
        "CERTIFICATION UPDATED",
        "Certification updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update certification."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SAVE RESUME
  ======================================================= */

  async function saveResume(
    value: Resume
  ) {
    try {
      setSaving(true);

      const title =
        value.title.trim();

      const fileUrl =
        value.fileUrl.trim();

      if (!title) {
        throw new Error(
          "Resume title is required."
        );
      }

      if (!fileUrl) {
        throw new Error(
          "Resume file URL is required."
        );
      }

      const updated =
        await apiRequest<Resume>(
          "/api/resume",
          {
            method: "PUT",
            body: JSON.stringify({
              id: value.id,
              title,
              fileUrl,
              downloadUrl:
                cleanString(
                  value.downloadUrl
                ),
            }),
          }
        );

      setResumes((items) => [
        updated,
        ...items.filter(
          (item) =>
            item.id !== updated.id
        ),
      ]);

      showNotification(
        "success",
        "RESUME UPDATED",
        "Resume updated successfully."
      );
    } catch (error) {
      console.error(error);

      showNotification(
        "error",
        "SAVE ERROR",
        error instanceof Error
          ? error.message
          : "Failed to update resume."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout() {
    try {
      await fetch(
        "/api/admin/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    setLogoutNotification(true);

    window.setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  }

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(
    () => [
      {
        label: "Skills",
        value: skills.length,
        icon: Code2,
        tab: "skills" as Tab,
      },
      {
        label: "Projects",
        value: projects.length,
        icon: FolderKanban,
        tab: "projects" as Tab,
      },
      {
        label: "Experience",
        value: experiences.length,
        icon: BriefcaseBusiness,
        tab: "experience" as Tab,
      },
      {
        label: "Education",
        value: education.length,
        icon: GraduationCap,
        tab: "education" as Tab,
      },
      {
        label: "Certifications",
        value: certifications.length,
        icon: Award,
        tab: "certifications" as Tab,
      },
      {
        label: "Resumes",
        value: resumes.length,
        icon: FileText,
        tab: "resume" as Tab,
      },
    ],
    [
      skills.length,
      projects.length,
      experiences.length,
      education.length,
      certifications.length,
      resumes.length,
    ]
  );

  /* =======================================================
     RECENT ACTIVITY
  ======================================================= */

  const recentActivity =
    useMemo<ActivityItem[]>(
      () => {
        const items: ActivityItem[] = [];

        skills.forEach((item) => {
          items.push({
            id: `skill-${item.id}`,
            type: "Skill",
            title: item.name,
            subtitle: item.category,
            date: new Date(),
          });
        });

        projects.forEach((item) => {
          items.push({
            id: `project-${item.id}`,
            type: "Project",
            title: item.title,
            subtitle: item.category,
            date: new Date(),
          });
        });

        experiences.forEach(
          (item) => {
            items.push({
              id: `experience-${item.id}`,
              type: "Experience",
              title: item.role,
              subtitle: item.company,
              date: new Date(),
            });
          }
        );

        education.forEach((item) => {
          items.push({
            id: `education-${item.id}`,
            type: "Education",
            title: item.degree,
            subtitle:
              item.institution,
            date: new Date(),
          });
        });

        certifications.forEach(
          (item) => {
            items.push({
              id: `certification-${item.id}`,
              type: "Certification",
              title: item.name,
              subtitle: item.issuer,
              date: new Date(),
            });
          }
        );

        resumes.forEach((item) => {
          items.push({
            id: `resume-${item.id}`,
            type: "Resume",
            title: item.title,
            subtitle: item.fileUrl,
            date: new Date(),
          });
        });

        if (profile) {
          items.push({
            id: `profile-${profile.id}`,
            type: "Profile",
            title: profile.name,
            subtitle: profile.title,
            date: new Date(),
          });
        }

        if (about) {
          items.push({
            id: `about-${about.id}`,
            type: "About",
            title: about.heading,
            subtitle:
              "About section",
            date: new Date(),
          });
        }

        return items.slice(0, 50);
      },
      [
        skills,
        projects,
        experiences,
        education,
        certifications,
        resumes,
        profile,
        about,
      ]
    );

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navItems: {
    id: Tab;
    label: string;
    icon: ReactNode;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Activity size={17} />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User size={17} />,
    },
    {
      id: "about",
      label: "About",
      icon: <Info size={17} />,
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Code2 size={17} />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: (
        <FolderKanban size={17} />
      ),
    },
    {
      id: "experience",
      label: "Experience",
      icon: (
        <BriefcaseBusiness
          size={17}
        />
      ),
    },
    {
      id: "education",
      label: "Education",
      icon: (
        <GraduationCap size={17} />
      ),
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: <Award size={17} />,
    },
    {
      id: "resume",
      label: "Resume",
      icon: <FileText size={17} />,
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-3xl" />
        <div className="absolute right-[8%] top-[30%] h-96 w-96 rounded-full bg-blue-500/[0.04] blur-3xl" />
        <div className="absolute bottom-[5%] left-[35%] h-80 w-80 rounded-full bg-purple-500/[0.03] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize:
              "45px 45px",
          }}
        />
      </div>

      {/* ===================================================
          TOAST
      =================================================== */}

      {notification && (
        <div
          className={`fixed right-5 top-5 z-[100] w-[min(420px,calc(100vw-40px))] animate-[slideIn_.35s_ease-out] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
            notification.type ===
            "success"
              ? "border-emerald-400/20 bg-emerald-950/80"
              : notification.type ===
                "error"
              ? "border-red-400/20 bg-red-950/80"
              : "border-cyan-400/20 bg-cyan-950/80"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                notification.type ===
                "success"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : notification.type ===
                    "error"
                  ? "bg-red-400/10 text-red-300"
                  : "bg-cyan-400/10 text-cyan-300"
              }`}
            >
              {notification.type ===
              "success" ? (
                <CheckCircle2
                  size={18}
                />
              ) : (
                <Info size={18} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold tracking-[0.18em] text-white/45">
                {notification.title}
              </p>

              <p className="mt-1 text-sm font-medium text-white/90">
                {notification.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotification(null)
              }
              className="text-white/30 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          LOGOUT TOAST
      =================================================== */}

      {logoutNotification && (
        <div className="fixed inset-x-0 top-6 z-[110] flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-[#08130f]/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <CheckCircle2
                size={18}
              />
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-emerald-300/60">
                LOGOUT
              </p>

              <p className="text-sm font-medium text-white">
                Logout successful. See you again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          LAYOUT
      =================================================== */}

      <div className="relative mx-auto flex min-h-screen max-w-[1700px]">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.06] bg-black/20 lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <div className="border-b border-white/[0.06] px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
                  <ShieldCheck
                    size={20}
                  />
                </div>

                <div>
                  <p className="text-sm font-bold tracking-wide">
                    CYBER ADMIN
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-[0.16em] text-white/30">
                    PORTFOLIO MANAGEMENT DASHBOARD
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
              <p className="px-3 pb-2 pt-3 text-[9px] font-bold tracking-[0.2em] text-white/25">
                CONTROL CENTER
              </p>

              <div className="space-y-1">
                {navItems.map(
                  (item) => {
                    const active =
                      activeTab ===
                      item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setActiveTab(
                            item.id
                          )
                        }
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "border border-cyan-400/10 bg-cyan-400/[0.07] text-cyan-200"
                            : "border border-transparent text-white/45 hover:bg-white/[0.035] hover:text-white/80"
                        }`}
                      >
                        <span
                          className={
                            active
                              ? "text-cyan-300"
                              : "text-white/30 group-hover:text-white/60"
                          }
                        >
                          {item.icon}
                        </span>

                        <span className="flex-1">
                          {item.label}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </nav>

            <div className="border-t border-white/[0.06] p-4">
              <div className="mb-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                <p className="text-[9px] tracking-[0.18em] text-white/25">
                  SYSTEM STATUS
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-300/80">
                    Database Connected
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-3 py-2.5 text-sm text-red-300/70 transition hover:border-red-400/20 hover:bg-red-400/[0.07] hover:text-red-200"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="min-w-0 flex-1">
          {/* =================================================
              HEADER
          ================================================= */}

          <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05070a]/85 backdrop-blur-xl">
            <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan-300/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  ADMINISTRATOR
                </div>

                <h1 className="mt-1 text-lg font-semibold sm:text-xl">
                  {navItems.find(
                    (item) =>
                      item.id ===
                      activeTab
                  )?.label ||
                    "Overview"}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="font-mono text-sm text-white/80">
                    {currentTime}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/30">
                    {currentDate}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    loadData()
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-white/40 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-cyan-300 disabled:opacity-40"
                  title="Refresh"
                >
                  <RefreshCw
                    size={15}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-white/40 transition hover:border-red-400/20 hover:bg-red-400/[0.04] hover:text-red-300"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="overflow-x-auto border-t border-white/[0.04] px-4 py-2 lg:hidden">
              <div className="flex min-w-max gap-1">
                {navItems.map(
                  (item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(
                          item.id
                        )
                      }
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                        activeTab ===
                        item.id
                          ? "bg-cyan-400/10 text-cyan-200"
                          : "text-white/40"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1450px] p-5 sm:p-7">
            {loading ? (
              <LoadingState />
            ) : (
              <>
                {/* =================================================
                    OVERVIEW
                ================================================= */}

                {activeTab ===
                  "overview" && (
                  <OverviewSection
                    profile={profile}
                    about={about}
                    stats={stats}
                    recentActivity={
                      recentActivity
                    }
                    onNavigate={
                      setActiveTab
                    }
                    onAddSkill={
                      addSkill
                    }
                    onAddProject={
                      addProject
                    }
                    onAddExperience={
                      addExperience
                    }
                    onAddEducation={
                      addEducation
                    }
                    onAddCertification={
                      addCertification
                    }
                    onAddResume={
                      addResume
                    }
                    saving={saving}
                  />
                )}

                {/* =================================================
                    PROFILE
                ================================================= */}

                {activeTab ===
                  "profile" && (
                  <ProfileSection
                    profile={profile}
                    saving={saving}
                    onSave={
                      saveProfile
                    }
                    onCreate={
                      createProfile
                    }
                  />
                )}

                {/* =================================================
                    ABOUT
                ================================================= */}

                {activeTab ===
                  "about" && (
                  <AboutSection
                    about={about}
                    saving={saving}
                    onSave={
                      saveAbout
                    }
                    onCreate={
                      createAbout
                    }
                  />
                )}

                {/* =================================================
                    SKILLS
                ================================================= */}

                {activeTab ===
                  "skills" && (
                  <SkillsSection
                    skills={skills}
                    saving={saving}
                    onAdd={addSkill}
                    onSave={
                      saveSkill
                    }
                    onDelete={(
                      id
                    ) =>
                      deleteRecord(
                        "/api/skills",
                        id,
                        "skill",
                        () =>
                          setSkills(
                            (
                              items
                            ) =>
                              items.filter(
                                (
                                  item
                                ) =>
                                  item.id !==
                                  id
                              )
                          )
                      )
                    }
                  />
                )}

                {/* =================================================
                    PROJECTS
                ================================================= */}

                {activeTab ===
                  "projects" && (
                  <ProjectsSection
                    projects={projects}
                    saving={saving}
                    onAdd={
                      addProject
                    }
                    onSave={
                      saveProject
                    }
                    onDelete={(
                      id
                    ) =>
                      deleteRecord(
                        "/api/projects",
                        id,
                        "project",
                        () =>
                          setProjects(
                            (
                              items
                            ) =>
                              items.filter(
                                (
                                  item
                                ) =>
                                  item.id !==
                                  id
                              )
                          )
                      )
                    }
                  />
                )}

                {/* =================================================
                    EXPERIENCE
                ================================================= */}

                {activeTab ===
                  "experience" && (
                  <ExperienceSection
                    experiences={
                      experiences
                    }
                    saving={saving}
                    onAdd={
                      addExperience
                    }
                    onSave={
                      saveExperience
                    }
                    onDelete={(
                      id
                    ) =>
                      deleteRecord(
                        "/api/experience",
                        id,
                        "experience",
                        () =>
                          setExperiences(
                            (
                              items
                            ) =>
                              items.filter(
                                (
                                  item
                                ) =>
                                  item.id !==
                                  id
                              )
                          )
                      )
                    }
                  />
                )}

                {/* =================================================
                    EDUCATION
                ================================================= */}

                {activeTab ===
                  "education" && (
                  <EducationSection
                    education={
                      education
                    }
                    saving={saving}
                    onAdd={
                      addEducation
                    }
                    onSave={
                      saveEducation
                    }
                    onDelete={(
                      id
                    ) =>
                      deleteRecord(
                        "/api/education",
                        id,
                        "education",
                        () =>
                          setEducation(
                            (
                              items
                            ) =>
                              items.filter(
                                (
                                  item
                                ) =>
                                  item.id !==
                                  id
                              )
                          )
                      )
                    }
                  />
                )}

                {/* =================================================
                    CERTIFICATIONS
                ================================================= */}

                {activeTab ===
                  "certifications" && (
                  <CertificationSection
                    certifications={
                      certifications
                    }
                    saving={saving}
                    onAdd={
                      addCertification
                    }
                    onSave={
                      saveCertification
                    }
                    onDelete={(
                      id
                    ) =>
                      deleteRecord(
                        "/api/certifications",
                        id,
                        "certification",
                        () =>
                          setCertifications(
                            (
                              items
                            ) =>
                              items.filter(
                                (
                                  item
                                ) =>
                                  item.id !==
                                  id
                              )
                          )
                      )
                    }
                  />
                )}

                {/* =================================================
                    RESUME
                ================================================= */}

                {activeTab ===
                  "resume" && (
                  <ResumeSection
                    resumes={
                      resumes
                    }
                    saving={saving}
                    onAdd={
                      addResume
                    }
                    onSave={
                      saveResume
                    }
                    onDelete={
                      deleteResume
                    }
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04]">
          <RefreshCw
            size={22}
            className="animate-spin text-cyan-300"
          />
        </div>

        <p className="mt-4 text-sm font-medium text-white/70">
          Loading admin dashboard...
        </p>

        <p className="mt-1 text-xs text-white/25">
          Connecting to portfolio database
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-[10px] font-bold tracking-[0.22em] text-cyan-300/50">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function OverviewSection({
  profile,
  about,
  stats,
  recentActivity,
  onNavigate,
  onAddSkill,
  onAddProject,
  onAddExperience,
  onAddEducation,
  onAddCertification,
  onAddResume,
  saving,
}: {
  profile: Profile | null;
  about: About | null;
  stats: {
    label: string;
    value: number;
    icon: React.ComponentType<{
      size?: number;
    }>;
    tab: Tab;
  }[];
  recentActivity: ActivityItem[];
  onNavigate: (tab: Tab) => void;
  onAddSkill: () => void;
  onAddProject: () => void;
  onAddExperience: () => void;
  onAddEducation: () => void;
  onAddCertification: () => void;
  onAddResume: () => void;
  saving: boolean;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="CONTROL CENTER"
        title="Portfolio Overview"
        description="Manage your cybersecurity portfolio content, profile information, projects and career data from one place."
      />

      {/* Profile banner */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">
        <div className="relative p-6 sm:p-7">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/[0.04] blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05]">
              {profile?.profileImage ? (
                <img
                  src={
                    profile.profileImage
                  }
                  alt={
                    profile.name
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={28}
                  className="text-cyan-300/60"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.18em] text-cyan-300/45">
                ACTIVE PROFILE
              </p>

              <h3 className="mt-1 truncate text-2xl font-bold">
                {profile?.name ||
                  "Profile not configured"}
              </h3>

              <p className="mt-1 text-sm text-white/40">
                {profile?.title ||
                  "Add your professional title"}
              </p>

              {profile?.email && (
                <p className="mt-2 text-xs text-white/25">
                  {profile.email}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                onNavigate(
                  "profile"
                )
              }
              className="sm:ml-auto"
            >
              <span className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-2.5 text-sm text-cyan-200 transition hover:bg-cyan-400/[0.09]">
                <User size={15} />
                Manage Profile
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon =
            stat.icon;

          return (
            <button
              type="button"
              key={stat.label}
              onClick={() =>
                onNavigate(
                  stat.tab
                )
              }
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/10 hover:bg-white/[0.035]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035] text-white/40 transition group-hover:text-cyan-300">
                  <Icon size={17} />
                </div>

                <span className="text-[9px] tracking-[0.14em] text-white/20">
                  MANAGE
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-white/30">
                {stat.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* About status */}
      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-400/[0.07] text-purple-300/70">
            <Info size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.18em] text-white/25">
              ABOUT SECTION
            </p>

            <h3 className="mt-1 font-semibold">
              {about?.heading ||
                "About section not configured"}
            </h3>

            <p className="mt-1 line-clamp-2 text-sm text-white/30">
              {about?.description ||
                "Create your About section to display it on the public portfolio."}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate("about")
            }
            className="shrink-0 text-xs text-cyan-300/70 hover:text-cyan-200"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Quick actions + Recent uploads */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-[10px] font-bold tracking-[0.18em] text-white/25">
            QUICK ACTIONS
          </p>

          <div className="mt-4 grid gap-2">
            <QuickAction
              icon={<Code2 size={16} />}
              label="Add Skill"
              onClick={onAddSkill}
              disabled={saving}
            />

            <QuickAction
              icon={
                <FolderKanban size={16} />
              }
              label="Add Project"
              onClick={onAddProject}
              disabled={saving}
            />

            <QuickAction
              icon={
                <BriefcaseBusiness
                  size={16}
                />
              }
              label="Add Experience"
              onClick={onAddExperience}
              disabled={saving}
            />

            <QuickAction
              icon={
                <GraduationCap
                  size={16}
                />
              }
              label="Add Education"
              onClick={onAddEducation}
              disabled={saving}
            />

            <QuickAction
              icon={<Award size={16} />}
              label="Add Certification"
              onClick={
                onAddCertification
              }
              disabled={saving}
            />

            <QuickAction
              icon={<FileText size={16} />}
              label="Add Resume"
              onClick={onAddResume}
              disabled={saving}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-white/25">
                RECENT UPLOADS
              </p>
              <h3 className="mt-1 text-base font-semibold">
                Content activity
              </h3>
            </div>

            <Activity
              size={17}
              className="text-cyan-300/40"
            />
          </div>

          {recentActivity.length ===
          0 ? (
            <EmptyState
              title="No content yet"
              description="Start adding portfolio content."
            />
          ) : (
            <div className="mt-4 max-h-[500px] space-y-1 overflow-y-auto pr-1">
              {recentActivity.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.025]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.05] text-cyan-300/50">
                      <Database
                        size={14}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/70">
                        {item.title}
                      </p>
                      <p className="truncate text-[10px] text-white/25">
                        {item.type} ·{" "}
                        {item.subtitle}
                      </p>
                    </div>

                    <span className="shrink-0 text-[9px] uppercase tracking-wide text-white/20">
                      Added
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-3 text-left text-sm text-white/55 transition hover:border-cyan-400/10 hover:bg-cyan-400/[0.03] hover:text-cyan-200 disabled:opacity-40"
    >
      <span className="text-cyan-300/60">
        {icon}
      </span>
      {label}
      <Plus
        size={13}
        className="ml-auto text-white/20"
      />
    </button>
  );
}

/* =========================================================
   PROFILE SECTION
========================================================= */

function ProfileSection({
  profile,
  saving,
  onSave,
  onCreate,
}: {
  profile: Profile | null;
  saving: boolean;
  onSave: (value: Profile) => void;
  onCreate: (value: Profile) => void;
}) {
  const [form, setForm] = useState<Profile>(
    profile || {
      id: 0,
      name: "Rajesh Reddy",
      title: "Junior Cybersecurity Analyst",
      tagline: "Cybersecurity enthusiast focused on defensive security.",
      description:
        "Passionate about cybersecurity, Python security development and security analysis.",
      email: "brajeshreddy90@gmail.com",
      phone: "",
      location: "India",
      profileImage: "",
      github: "",
      linkedin: "",
      resumeUrl: "",
      availability: "Open to opportunities",
    }
  );

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function handleProfileImageUpload(file: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert("Profile image must be 5MB or smaller.");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "profile");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Failed to upload profile image.");
      }

      update("profileImage", data.url);
    } catch (error) {
      console.error("Profile image upload error:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  function removeProfileImage() {
    update("profileImage", "");
  }

  return (
    <div>
      <SectionHeader
        eyebrow="PROFILE MANAGEMENT"
        title="Profile"
        description="Update the personal and professional information used across your public cybersecurity portfolio."
        action={
          <SaveButton
            loading={saving}
            label={profile ? "Save Profile" : "Create Profile"}
            onClick={() => (profile ? onSave(form) : onCreate(form))}
          />
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        {/* Preview */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-[10px] font-bold tracking-[0.18em] text-white/25">
            PROFILE PREVIEW
          </p>

          <div className="mt-6 text-center">
            <div className="relative mx-auto h-40 w-40">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] shadow-[0_0_45px_rgba(34,211,238,0.08)]">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt={form.name || "Profile picture"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-cyan-300/40" />
                )}
              </div>

              <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-400/20 bg-[#071016]/95 px-3 py-2 text-[11px] font-semibold text-cyan-200 shadow-lg backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-cyan-400/[0.08]">
                  <Plus size={13} />
                  {uploadingImage ? "Uploading..." : "Change"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleProfileImageUpload(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>

                {form.profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-[#14090b]/95 px-3 py-2 text-[11px] font-semibold text-red-300 shadow-lg backdrop-blur-xl transition hover:border-red-300/40 hover:bg-red-400/[0.08] disabled:opacity-40"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <p className="mt-9 text-[10px] text-white/20">
              JPG, PNG, WEBP or GIF · Maximum 5MB
            </p>

            <h3 className="mt-4 text-xl font-bold">
              {form.name || "Your Name"}
            </h3>

            <p className="mt-1 text-sm text-cyan-300/60">
              {form.title || "Professional Title"}
            </p>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/30">
              {form.tagline || "Add a short professional tagline."}
            </p>

            {form.email && (
              <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-xs text-white/35">
                {form.email}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput
              label="Name"
              value={form.name}
              onChange={(value) => update("name", value)}
            />

            <AdminInput
              label="Professional Title"
              value={form.title}
              onChange={(value) => update("title", value)}
            />

            <AdminInput
              label="Email"
              value={form.email || ""}
              onChange={(value) => update("email", value)}
            />

            <AdminInput
              label="Phone"
              value={form.phone || ""}
              onChange={(value) => update("phone", value)}
            />

            <AdminInput
              label="Location"
              value={form.location || ""}
              onChange={(value) => update("location", value)}
            />

            <AdminInput
              label="Availability"
              value={form.availability || ""}
              onChange={(value) => update("availability", value)}
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-[10px] font-bold tracking-[0.16em] text-white/35">
                PROFILE IMAGE
              </label>
              <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:flex-row sm:items-center">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04]">
                  {form.profileImage ? (
                    <img
                      src={form.profileImage}
                      alt={form.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={22} className="text-cyan-300/30" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/75">
                    {form.profileImage ? "Profile image selected" : "No profile image selected"}
                  </p>
                  <p className="mt-1 break-all text-[11px] text-white/25">
                    {form.profileImage || "Upload an image using the button below."}
                  </p>
                </div>

                <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/[0.09]">
                  <Plus size={14} />
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleProfileImageUpload(file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
              <p className="mt-2 text-[10px] text-white/20">
                The uploaded image URL is saved to the Profile record when you click Save Profile.
              </p>
            </div>

            <div className="md:col-span-2">
              <AdminTextarea
                label="Tagline"
                value={form.tagline || ""}
                rows={2}
                onChange={(value) => update("tagline", value)}
              />
            </div>

            <div className="md:col-span-2">
              <AdminTextarea
                label="Description"
                value={form.description || ""}
                rows={5}
                onChange={(value) => update("description", value)}
              />
            </div>

            <AdminInput
              label="GitHub URL"
              value={form.github || ""}
              onChange={(value) => update("github", value)}
            />

            <AdminInput
              label="LinkedIn URL"
              value={form.linkedin || ""}
              onChange={(value) => update("linkedin", value)}
            />

            <AdminInput
              label="Resume URL"
              value={form.resumeUrl || ""}
              onChange={(value) => update("resumeUrl", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ABOUT SECTION
========================================================= */

function AboutSection({
  about,
  saving,
  onSave,
  onCreate,
}: {
  about: About | null;
  saving: boolean;
  onSave: (
    value: About
  ) => void;
  onCreate: (
    value: About
  ) => void;
}) {
  const [form, setForm] =
    useState<About>(
      about || {
        id: 0,
        heading:
          "About Me",
        description:
          "I am a Junior Cybersecurity Analyst passionate about security analysis, Python and defensive cybersecurity.",
        highlights: [
          "Cybersecurity",
          "Python",
          "Security Analysis",
        ],
      }
    );

  useEffect(() => {
    if (about) {
      setForm(about);
    }
  }, [about]);

  return (
    <div>
      <SectionHeader
        eyebrow="ABOUT MANAGEMENT"
        title="About Section"
        description="Manage the introduction, professional summary and highlights displayed on the portfolio."
        action={
          <SaveButton
            loading={saving}
            label={
              about
                ? "Save About"
                : "Create About"
            }
            onClick={() =>
              about
                ? onSave(form)
                : onCreate(form)
            }
          />
        }
      />

      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="grid gap-5">
          <AdminInput
            label="Heading"
            value={form.heading}
            onChange={(value) =>
              setForm({
                ...form,
                heading: value,
              })
            }
          />

          <AdminTextarea
            label="Description"
            value={form.description}
            rows={8}
            onChange={(value) =>
              setForm({
                ...form,
                description:
                  value,
              })
            }
          />

          <AdminTextarea
            label="Highlights"
            value={form.highlights.join(
              "\n"
            )}
            rows={7}
            placeholder={
              "Cybersecurity\nPython\nNetwork Security"
            }
            onChange={(value) =>
              setForm({
                ...form,
                highlights:
                  value
                    .split("\n")
                    .map(
                      (item) =>
                        item.trim()
                    )
                    .filter(
                      Boolean
                    ),
              })
            }
          />

          <p className="-mt-2 text-[10px] text-white/20">
            Add one highlight per line.
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKILLS
========================================================= */

function SkillsSection({
  skills,
  saving,
  onAdd,
  onSave,
  onDelete,
}: {
  skills: Skill[];
  saving: boolean;
  onAdd: () => void;
  onSave: (
    value: Skill
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="SKILLS MANAGEMENT"
        title="Skills"
        description="Manage cybersecurity, technical and professional skills displayed on the portfolio."
        action={
          <AddButton
            label="Add Skill"
            onClick={onAdd}
            disabled={saving}
          />
        }
      />

      {skills.length === 0 ? (
        <EmptyState
          title="No skills found"
          description="Add your first skill to start building the skills section."
          action={
            <AddButton
              label="Add Skill"
              onClick={onAdd}
              disabled={saving}
            />
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              saving={saving}
              onSave={onSave}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SkillCard({
  skill,
  saving,
  onSave,
  onDelete,
}: {
  skill: Skill;
  saving: boolean;
  onSave: (
    value: Skill
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const [form, setForm] =
    useState(skill);

  useEffect(() => {
    setForm(skill);
  }, [skill]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput
          label="Skill Name"
          value={form.name}
          onChange={(value) =>
            setForm({
              ...form,
              name: value,
            })
          }
        />

        <AdminInput
          label="Category"
          value={form.category}
          onChange={(value) =>
            setForm({
              ...form,
              category: value,
            })
          }
        />

        <div className="sm:col-span-2">
          <label className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-white/30">
            PROFICIENCY —{" "}
            {form.level}%
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={form.level}
            onChange={(event) =>
              setForm({
                ...form,
                level: Number(
                  event.target.value
                ),
              })
            }
            className="w-full accent-cyan-400"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <DeleteButton
          onClick={() =>
            onDelete(skill.id)
          }
          disabled={saving}
        />

        <SmallSaveButton
          loading={saving}
          onClick={() =>
            onSave(form)
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   PROJECTS
========================================================= */

function ProjectsSection({
  projects,
  saving,
  onAdd,
  onSave,
  onDelete,
}: {
  projects: Project[];
  saving: boolean;
  onAdd: () => void;
  onSave: (
    value: Project
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="PROJECT MANAGEMENT"
        title="Projects"
        description="Manage cybersecurity projects, technologies, progress, links and featured project status."
        action={
          <AddButton
            label="Add Project"
            onClick={onAdd}
            disabled={saving}
          />
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Add your first cybersecurity project."
          action={
            <AddButton
              label="Add Project"
              onClick={onAdd}
              disabled={saving}
            />
          }
        />
      ) : (
        <div className="space-y-4">
          {projects.map(
            (project) => (
              <ProjectCard
                key={project.id}
                project={project}
                saving={saving}
                onSave={onSave}
                onDelete={
                  onDelete
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  saving,
  onSave,
  onDelete,
}: {
  project: Project;
  saving: boolean;
  onSave: (
    value: Project
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const [form, setForm] =
    useState(project);

  useEffect(() => {
    setForm(project);
  }, [project]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/[0.05] text-cyan-300/60">
          <FolderKanban
            size={18}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] tracking-[0.18em] text-white/20">
            PROJECT #{project.id}
          </p>
          <h3 className="mt-1 truncate font-semibold">
            {project.title}
          </h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput
          label="Title"
          value={form.title}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
        />

        <AdminInput
          label="Category"
          value={form.category}
          onChange={(value) =>
            setForm({
              ...form,
              category: value,
            })
          }
        />

        <AdminInput
          label="Status"
          value={form.status}
          onChange={(value) =>
            setForm({
              ...form,
              status: value,
            })
          }
        />

        <AdminInput
          label="Status Type"
          value={
            form.statusType
          }
          onChange={(value) =>
            setForm({
              ...form,
              statusType: value,
            })
          }
        />

        <AdminInput
          label="Technologies"
          value={form.technologies.join(
            ", "
          )}
          onChange={(value) =>
            setForm({
              ...form,
              technologies:
                stringArray(
                  value
                ),
            })
          }
        />

        <AdminInput
          label="Icon"
          value={form.icon}
          onChange={(value) =>
            setForm({
              ...form,
              icon: value,
            })
          }
        />

        <AdminInput
          label="GitHub URL"
          value={
            form.github || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              github: value,
            })
          }
        />

        <AdminInput
          label="Live URL"
          value={
            form.liveUrl || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              liveUrl: value,
            })
          }
        />

        <AdminInput
          label="Image URL"
          value={
            form.image || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              image: value,
            })
          }
        />

        <div>
          <label className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-white/30">
            PROGRESS —{" "}
            {form.progress}%
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={form.progress}
            onChange={(event) =>
              setForm({
                ...form,
                progress:
                  Number(
                    event.target.value
                  ),
              })
            }
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-3">
          <input
            id={`featured-${project.id}`}
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              setForm({
                ...form,
                featured:
                  event.target
                    .checked,
              })
            }
            className="h-4 w-4 accent-cyan-400"
          />

          <label
            htmlFor={`featured-${project.id}`}
            className="text-sm text-white/55"
          >
            Featured project
          </label>
        </div>

        <div className="md:col-span-2">
          <AdminTextarea
            label="Description"
            value={
              form.description
            }
            rows={5}
            onChange={(value) =>
              setForm({
                ...form,
                description:
                  value,
              })
            }
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <DeleteButton
          onClick={() =>
            onDelete(project.id)
          }
          disabled={saving}
        />

        <SmallSaveButton
          loading={saving}
          onClick={() =>
            onSave(form)
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   EXPERIENCE
========================================================= */

function ExperienceSection({
  experiences,
  saving,
  onAdd,
  onSave,
  onDelete,
}: {
  experiences: Experience[];
  saving: boolean;
  onAdd: () => void;
  onSave: (
    value: Experience
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="EXPERIENCE MANAGEMENT"
        title="Experience"
        description="Manage your professional experience, responsibilities, dates and technologies."
        action={
          <AddButton
            label="Add Experience"
            onClick={onAdd}
            disabled={saving}
          />
        }
      />

      {experiences.length ===
      0 ? (
        <EmptyState
          title="No experience found"
          description="Add your professional experience."
          action={
            <AddButton
              label="Add Experience"
              onClick={onAdd}
              disabled={saving}
            />
          }
        />
      ) : (
        <div className="space-y-4">
          {experiences.map(
            (experience) => (
              <ExperienceCard
                key={
                  experience.id
                }
                experience={
                  experience
                }
                saving={saving}
                onSave={
                  onSave
                }
                onDelete={
                  onDelete
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function ExperienceCard({
  experience,
  saving,
  onSave,
  onDelete,
}: {
  experience: Experience;
  saving: boolean;
  onSave: (
    value: Experience
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const [form, setForm] =
    useState(experience);

  useEffect(() => {
    setForm(experience);
  }, [experience]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput
          label="Role"
          value={form.role}
          onChange={(value) =>
            setForm({
              ...form,
              role: value,
            })
          }
        />

        <AdminInput
          label="Company"
          value={form.company}
          onChange={(value) =>
            setForm({
              ...form,
              company: value,
            })
          }
        />

        <AdminInput
          label="Location"
          value={
            form.location || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              location: value,
            })
          }
        />

        <AdminInput
          label="Start Date"
          value={form.startDate}
          onChange={(value) =>
            setForm({
              ...form,
              startDate: value,
            })
          }
        />

        <AdminInput
          label="End Date"
          value={
            form.endDate || ""
          }
          disabled={form.current}
          onChange={(value) =>
            setForm({
              ...form,
              endDate: value,
            })
          }
        />

        <AdminInput
          label="Technologies"
          value={form.technologies.join(
            ", "
          )}
          onChange={(value) =>
            setForm({
              ...form,
              technologies:
                stringArray(
                  value
                ),
            })
          }
        />

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3 py-3">
          <input
            type="checkbox"
            checked={form.current}
            onChange={(event) =>
              setForm({
                ...form,
                current:
                  event.target
                    .checked,
              })
            }
            className="h-4 w-4 accent-cyan-400"
          />

          <span className="text-sm text-white/55">
            Currently working here
          </span>
        </div>

        <div className="md:col-span-2">
          <AdminTextarea
            label="Description"
            value={
              form.description
            }
            rows={6}
            onChange={(value) =>
              setForm({
                ...form,
                description:
                  value,
              })
            }
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <DeleteButton
          onClick={() =>
            onDelete(
              experience.id
            )
          }
          disabled={saving}
        />

        <SmallSaveButton
          loading={saving}
          onClick={() =>
            onSave(form)
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   EDUCATION
========================================================= */

function EducationSection({
  education,
  saving,
  onAdd,
  onSave,
  onDelete,
}: {
  education: Education[];
  saving: boolean;
  onAdd: () => void;
  onSave: (
    value: Education
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="EDUCATION MANAGEMENT"
        title="Education"
        description="Manage your academic background, institution, grades and education descriptions."
        action={
          <AddButton
            label="Add Education"
            onClick={onAdd}
            disabled={saving}
          />
        }
      />

      {education.length ===
      0 ? (
        <EmptyState
          title="No education found"
          description="Add your academic information."
          action={
            <AddButton
              label="Add Education"
              onClick={onAdd}
              disabled={saving}
            />
          }
        />
      ) : (
        <div className="space-y-4">
          {education.map(
            (item) => (
              <EducationCard
                key={item.id}
                education={item}
                saving={saving}
                onSave={
                  onSave
                }
                onDelete={
                  onDelete
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function EducationCard({
  education,
  saving,
  onSave,
  onDelete,
}: {
  education: Education;
  saving: boolean;
  onSave: (
    value: Education
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const [form, setForm] =
    useState(education);

  useEffect(() => {
    setForm(education);
  }, [education]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput
          label="Degree"
          value={form.degree}
          onChange={(value) =>
            setForm({
              ...form,
              degree: value,
            })
          }
        />

        <AdminInput
          label="Institution"
          value={
            form.institution
          }
          onChange={(value) =>
            setForm({
              ...form,
              institution:
                value,
            })
          }
        />

        <AdminInput
          label="Location"
          value={
            form.location || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              location: value,
            })
          }
        />

        <AdminInput
          label="Start Year"
          value={
            form.startYear || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              startYear: value,
            })
          }
        />

        <AdminInput
          label="End Year"
          value={
            form.endYear || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              endYear: value,
            })
          }
        />

        <AdminInput
          label="Grade"
          value={
            form.grade || ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              grade: value,
            })
          }
        />

        <div className="md:col-span-2">
          <AdminTextarea
            label="Description"
            value={
              form.description ||
              ""
            }
            rows={5}
            onChange={(value) =>
              setForm({
                ...form,
                description:
                  value,
              })
            }
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <DeleteButton
          onClick={() =>
            onDelete(
              education.id
            )
          }
          disabled={saving}
        />

        <SmallSaveButton
          loading={saving}
          onClick={() =>
            onSave(form)
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   CERTIFICATIONS
========================================================= */

function CertificationSection({
  certifications,
  saving,
  onAdd,
  onSave,
  onDelete,
}: {
  certifications: Certification[];
  saving: boolean;
  onAdd: () => void;
  onSave: (
    value: Certification
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="CERTIFICATION MANAGEMENT"
        title="Certifications"
        description="Manage certifications, issuing organizations, credential IDs and verification links."
        action={
          <AddButton
            label="Add Certification"
            onClick={onAdd}
            disabled={saving}
          />
        }
      />

      {certifications.length ===
      0 ? (
        <EmptyState
          title="No certifications found"
          description="Add your cybersecurity certifications."
          action={
            <AddButton
              label="Add Certification"
              onClick={onAdd}
              disabled={saving}
            />
          }
        />
      ) : (
        <div className="space-y-4">
          {certifications.map(
            (item) => (
              <CertificationCard
                key={item.id}
                certification={
                  item
                }
                saving={saving}
                onSave={
                  onSave
                }
                onDelete={
                  onDelete
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function CertificationCard({
  certification,
  saving,
  onSave,
  onDelete,
}: {
  certification: Certification;
  saving: boolean;
  onSave: (
    value: Certification
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const [form, setForm] =
    useState(
      certification
    );

  useEffect(() => {
    setForm(certification);
  }, [certification]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput
          label="Certification Name"
          value={form.name}
          onChange={(value) =>
            setForm({
              ...form,
              name: value,
            })
          }
        />

        <AdminInput
          label="Issuer"
          value={form.issuer}
          onChange={(value) =>
            setForm({
              ...form,
              issuer: value,
            })
          }
        />

        <AdminInput
          label="Year"
          value={form.year}
          onChange={(value) =>
            setForm({
              ...form,
              year: value,
            })
          }
        />

        <AdminInput
          label="Credential ID"
          value={
            form.credentialId ||
            ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              credentialId:
                value,
            })
          }
        />

        <AdminInput
          label="Credential URL"
          value={
            form.credentialUrl ||
            ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              credentialUrl:
                value,
            })
          }
        />

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] px-3">
          <Award
            size={17}
            className="text-cyan-300/50"
          />
          <span className="text-sm text-white/45">
            Verified credential
          </span>
        </div>

        <div className="md:col-span-2">
          <AdminTextarea
            label="Description"
            value={
              form.description ||
              ""
            }
            rows={5}
            onChange={(value) =>
              setForm({
                ...form,
                description:
                  value,
              })
            }
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <DeleteButton
          onClick={() =>
            onDelete(
              certification.id
            )
          }
          disabled={saving}
        />

        <SmallSaveButton
          loading={saving}
          onClick={() =>
            onSave(form)
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   RESUME
========================================================= */

function ResumeSection({
  resumes,
  saving,
  onAdd,
  onSave,
  onDelete,
}: {
  resumes: Resume[];
  saving: boolean;
  onAdd: () => void;
  onSave: (
    value: Resume
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  return (
    <div>
      <SectionHeader
        eyebrow="RESUME MANAGEMENT"
        title="Resume"
        description="Manage resume records and the file URLs used by the public portfolio."
        action={
          <AddButton
            label="Add Resume"
            onClick={onAdd}
            disabled={saving}
          />
        }
      />

      <div className="mb-5 rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
        <div className="flex items-start gap-3">
          <Info
            size={17}
            className="mt-0.5 shrink-0 text-amber-300/50"
          />

          <p className="text-xs leading-5 text-white/35">
            Resume records use a file URL. For local development,
            a path such as{" "}
            <span className="font-mono text-white/50">
              /uploads/resume.pdf
            </span>{" "}
            can be stored after your upload API saves the file.
          </p>
        </div>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          title="No resumes found"
          description="Add a resume record to make it available to the portfolio."
          action={
            <AddButton
              label="Add Resume"
              onClick={onAdd}
              disabled={saving}
            />
          }
        />
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              saving={saving}
              onSave={onSave}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResumeCard({
  resume,
  saving,
  onSave,
  onDelete,
}: {
  resume: Resume;
  saving: boolean;
  onSave: (
    value: Resume
  ) => void;
  onDelete: (
    id: number
  ) => void;
}) {
  const [form, setForm] =
    useState(resume);

  useEffect(() => {
    setForm(resume);
  }, [resume]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput
          label="Resume Title"
          value={form.title}
          onChange={(value) =>
            setForm({
              ...form,
              title: value,
            })
          }
        />

        <AdminInput
          label="File URL"
          value={form.fileUrl}
          onChange={(value) =>
            setForm({
              ...form,
              fileUrl: value,
            })
          }
        />

        <AdminInput
          label="Download URL"
          value={
            form.downloadUrl ||
            ""
          }
          onChange={(value) =>
            setForm({
              ...form,
              downloadUrl:
                value,
            })
          }
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-between gap-3">
        <a
          href={form.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] px-3 py-2 text-xs text-white/45 transition hover:border-cyan-400/15 hover:text-cyan-200"
        >
          <ExternalLink
            size={13}
          />
          Open Resume
        </a>

        <div className="flex gap-2">
          <DeleteButton
            onClick={() =>
              onDelete(resume.id)
            }
            disabled={saving}
          />

          <SmallSaveButton
            loading={saving}
            onClick={() =>
              onSave(form)
            }
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-white/30">
        {label}
      </span>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-full rounded-xl border border-white/[0.07] bg-black/20 px-3.5 text-sm text-white/80 outline-none transition placeholder:text-white/15 focus:border-cyan-400/25 focus:bg-cyan-400/[0.015] disabled:cursor-not-allowed disabled:opacity-30"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function AdminTextarea({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-white/30">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-y rounded-xl border border-white/[0.07] bg-black/20 px-3.5 py-3 text-sm leading-6 text-white/80 outline-none transition placeholder:text-white/15 focus:border-cyan-400/25 focus:bg-cyan-400/[0.015]"
      />
    </label>
  );
}

/* =========================================================
   BUTTONS
========================================================= */

function SaveButton({
  loading,
  label,
  onClick,
}: {
  loading: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.11] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Save size={15} />

      {loading
        ? "Saving..."
        : label}
    </button>
  );
}

function SmallSaveButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-3.5 py-2 text-xs text-cyan-200 transition hover:bg-cyan-400/[0.09] disabled:opacity-40"
    >
      <Save size={13} />

      {loading
        ? "Saving..."
        : "Save"}
    </button>
  );
}

function AddButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/[0.11] disabled:opacity-40"
    >
      <Plus size={15} />
      {label}
    </button>
  );
}

function DeleteButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.03] px-3.5 py-2 text-xs text-red-300/70 transition hover:border-red-400/20 hover:bg-red-400/[0.07] hover:text-red-200 disabled:opacity-40"
    >
      <Trash2 size={13} />
      Delete
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-white/25">
        <Database size={20} />
      </div>

      <h3 className="mt-4 font-semibold text-white/70">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-white/25">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}