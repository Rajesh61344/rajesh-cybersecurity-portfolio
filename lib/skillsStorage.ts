export type SkillItem = {
  id: string;
  name: string;
  level: number;
  category: string;
  description?: string;
};

export const SKILLS_STORAGE_KEY = "portfolio_skills";

export const defaultSkills: SkillItem[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    level: 90,
    category: "Security",
    description:
      "Security fundamentals, threat detection and defensive security.",
  },
  {
    id: "network-security",
    name: "Network Security",
    level: 85,
    category: "Security",
    description:
      "Network monitoring, security concepts and traffic analysis.",
  },
  {
    id: "python",
    name: "Python",
    level: 88,
    category: "Programming",
    description:
      "Python scripting, automation and security-focused development.",
  },
  {
    id: "malware-analysis",
    name: "Malware Analysis",
    level: 80,
    category: "Security",
    description:
      "Basic malware detection and analysis techniques.",
  },
  {
    id: "vulnerability-analysis",
    name: "Vulnerability Analysis",
    level: 82,
    category: "Security",
    description:
      "Identifying and understanding security vulnerabilities.",
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment",
    level: 78,
    category: "Security",
    description:
      "Cyber risk identification and security assessment.",
  },
];

export function getSkills(): SkillItem[] {
  if (typeof window === "undefined") {
    return defaultSkills;
  }

  try {
    const stored = localStorage.getItem(
      SKILLS_STORAGE_KEY
    );

    if (!stored) {
      localStorage.setItem(
        SKILLS_STORAGE_KEY,
        JSON.stringify(defaultSkills)
      );

      return defaultSkills;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return defaultSkills;
    }

    return parsed;
  } catch {
    return defaultSkills;
  }
}

export function saveSkills(
  skills: SkillItem[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    SKILLS_STORAGE_KEY,
    JSON.stringify(skills)
  );

  /*
   * Same-tab update.
   * storage event alone does not fire in the same tab.
   */
  window.dispatchEvent(
    new CustomEvent("skills-updated", {
      detail: skills,
    })
  );
}

export function resetSkills() {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    SKILLS_STORAGE_KEY,
    JSON.stringify(defaultSkills)
  );

  window.dispatchEvent(
    new CustomEvent("skills-updated", {
      detail: defaultSkills,
    })
  );
}