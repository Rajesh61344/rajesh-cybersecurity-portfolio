export type CertificationItem = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credential?: string;
  description?: string;
};

export const CERTIFICATIONS_STORAGE_KEY =
  "portfolio_certifications";

export const defaultCertifications: CertificationItem[] = [
  {
    id: "cert-1",
    title: "Cybersecurity Certification",
    issuer: "Professional Certification",
    date: "2025",
    credential: "Verified",
    description:
      "Certification covering fundamental cybersecurity concepts and security practices.",
  },
  {
    id: "cert-2",
    title: "Python Programming",
    issuer: "Technical Certification",
    date: "2025",
    credential: "Verified",
    description:
      "Certification demonstrating Python programming and problem-solving skills.",
  },
];

export function getCertifications(): CertificationItem[] {
  if (typeof window === "undefined") {
    return defaultCertifications;
  }

  try {
    const stored = localStorage.getItem(
      CERTIFICATIONS_STORAGE_KEY
    );

    if (!stored) {
      localStorage.setItem(
        CERTIFICATIONS_STORAGE_KEY,
        JSON.stringify(defaultCertifications)
      );

      return defaultCertifications;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return defaultCertifications;
    }

    return parsed;
  } catch {
    return defaultCertifications;
  }
}

export function saveCertifications(
  certifications: CertificationItem[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    CERTIFICATIONS_STORAGE_KEY,
    JSON.stringify(certifications)
  );

  window.dispatchEvent(
    new CustomEvent(
      "certifications-updated",
      {
        detail: certifications,
      }
    )
  );
}

export function resetCertifications() {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    CERTIFICATIONS_STORAGE_KEY,
    JSON.stringify(
      defaultCertifications
    )
  );

  window.dispatchEvent(
    new CustomEvent(
      "certifications-updated",
      {
        detail: defaultCertifications,
      }
    )
  );
}