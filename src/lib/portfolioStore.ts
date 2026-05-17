export type ProjectRecord = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
};

export type ProfileContent = {
  tagline: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  avatarUrl: string;
  phone?: string;
};

export type ExtracurricularRecord = {
  id: string;
  text: string;
};

export type InterestRecord = {
  id: string;
  name: string;
  logoUrl: string;
  domain?: string;
};

export type SkillRecord = {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
};

export type CertificateRecord = {
  id: string;
  name: string;
  issuer: string;
  imageUrl?: string;
  fileUrl?: string;
  filePath?: string;
};

export const defaultProjects: ProjectRecord[] = [];

export const defaultProfile: ProfileContent = {
  tagline: "Cybersecurity | Cloud | AI | Secure Systems",
  bio: "Computer Science undergraduate with a keen interest in networking, cloud technologies, secure systems, and emerging AI technologies.",
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  resumeUrl: "",
  avatarUrl: "",
  phone: "+91 98765 43210",
};

export const defaultExtracurriculars: ExtracurricularRecord[] = [
  {
    id: "cyber-defense-hackathon-2024",
    text: "Participated in National Cyber Defense Hackathon 2024",
  },
  {
    id: "university-tech-club",
    text: "Core member of University Tech Club",
  },
  {
    id: "ai-zero-trust-article",
    text: "Published article on 'AI in Zero Trust Architecture'",
  },
  {
    id: "web3-awareness-seminars",
    text: "Volunteer for Web3 Awareness Seminars",
  },
];

export const defaultInterests: InterestRecord[] = [
  {
    id: "aws-cloud-security",
    name: "AWS Cloud Security",
    logoUrl: "https://logo.clearbit.com/aws.amazon.com",
    domain: "aws.amazon.com",
  },
  {
    id: "kubernetes-secops",
    name: "Kubernetes SecOps",
    logoUrl: "https://logo.clearbit.com/kubernetes.io",
    domain: "kubernetes.io",
  },
  {
    id: "docker-security",
    name: "Docker Security",
    logoUrl: "https://logo.clearbit.com/docker.com",
    domain: "docker.com",
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    logoUrl: "https://logo.clearbit.com/tensorflow.org",
    domain: "tensorflow.org",
  },
];

export const defaultSkills: SkillRecord[] = [
  // Security concepts
  { id: "info-sec", name: "Information security (secure systems)", category: "Security concepts", logoUrl: "" },
  { id: "crypto", name: "Cryptography", category: "Security concepts", logoUrl: "" },
  { id: "network-fund", name: "Network fundamentals", category: "Security concepts", logoUrl: "" },
  
  // Tools
  { id: "abuseipdb", name: "AbuseIPDB", category: "Tools", logoUrl: "" },
  { id: "alienvault", name: "AlienVault OTX", category: "Tools", logoUrl: "" },
  { id: "virustotal", name: "VirusTotal", category: "Tools", logoUrl: "" },
  { id: "wireshark", name: "Wireshark", category: "Tools", logoUrl: "" },
  { id: "nmap", name: "Nmap", category: "Tools", logoUrl: "" },
  { id: "git", name: "Git", category: "Tools", logoUrl: "" },
  { id: "vscode", name: "VS Code", category: "Tools", logoUrl: "" },
  { id: "figma", name: "Figma", category: "Tools", logoUrl: "" },
  
  // Programming/Web
  { id: "python", name: "Python", category: "Programming/Web", logoUrl: "" },
  { id: "c-lang", name: "C", category: "Programming/Web", logoUrl: "" },
  { id: "javascript", name: "JavaScript", category: "Programming/Web", logoUrl: "" },
  { id: "fastapi", name: "FastAPI", category: "Programming/Web", logoUrl: "" },
  { id: "nextjs", name: "Next.js", category: "Programming/Web", logoUrl: "" },
  { id: "sql", name: "SQL", category: "Programming/Web", logoUrl: "" },
  { id: "postgresql", name: "PostgreSQL", category: "Programming/Web", logoUrl: "" },
  { id: "tailwindcss", name: "Tailwind CSS", category: "Programming/Web", logoUrl: "" },
  
  // Emerging Tech
  { id: "blockchain", name: "Blockchain (Polygon)", category: "Emerging Tech", logoUrl: "" },
  { id: "smart-contracts", name: "Smart Contracts", category: "Emerging Tech", logoUrl: "" },
  { id: "ipfs", name: "IPFS", category: "Emerging Tech", logoUrl: "" },
  { id: "gen-ai", name: "Generative AI", category: "Emerging Tech", logoUrl: "" },
  { id: "ai-agents", name: "AI Agents", category: "Emerging Tech", logoUrl: "" },
];

export const defaultCertificates: CertificateRecord[] = [];
const DEFAULT_ADMIN_TRIGGER = "dk160106";

const PROJECTS_KEY = "portfolio.projects.v1";
const CERTS_KEY = "portfolio.certificates.v1";
const PROFILE_KEY = "portfolio.profile.v1";
const EXTRACURRICULARS_KEY = "portfolio.extracurriculars.v1";
const INTERESTS_KEY = "portfolio.interests.v1";
const SKILLS_KEY = "portfolio.skills.v1";
const ADMIN_TRIGGER_KEY = "portfolio.adminTrigger.v1";
export const PORTFOLIO_UPDATE_EVENT = "portfolio:updated";

const readArray = <T,>(raw: string | null, fallback: T[]): T[] => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

const emitPortfolioUpdate = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(PORTFOLIO_UPDATE_EVENT));
};

const readStoredObject = <T,>(key: string, fallback: T, normalize: (value: unknown) => T | null): T => {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return normalize(parsed) || fallback;
  } catch {
    return fallback;
  }
};

const readStoredList = <T,>(
  key: string,
  fallback: T[],
  normalize: (items: unknown[]) => T[]
): { items: T[]; hasStored: boolean } => {
  if (typeof window === "undefined") return { items: fallback, hasStored: false };
  const raw = localStorage.getItem(key);
  if (raw === null) return { items: fallback, hasStored: false };
  const parsed = readArray<unknown>(raw, []);
  return { items: normalize(parsed), hasStored: true };
};

const normalizeProjects = (items: unknown[]): ProjectRecord[] => {
  if (!items.length) return [];
  const normalized: ProjectRecord[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<ProjectRecord>;
    if (typeof record.title !== "string") return [];
    normalized.push({
      id: record.id || record.title.toLowerCase().replace(/\s+/g, "-"),
      title: record.title,
      description: record.description || "",
      tech: Array.isArray(record.tech) ? record.tech : [],
      githubUrl: record.githubUrl || "",
      liveUrl: record.liveUrl || "",
      imageUrl: record.imageUrl || "",
    });
  }

  return normalized;
};

const normalizeCertificates = (items: unknown[]): CertificateRecord[] => {
  if (!items.length) return [];
  const normalized: CertificateRecord[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<CertificateRecord>;
    if (typeof record.name !== "string") return [];
    normalized.push({
      id: record.id || record.name.toLowerCase().replace(/\s+/g, "-"),
      name: record.name,
      issuer: record.issuer || "Verified Vault",
      imageUrl: record.imageUrl || "",
      fileUrl: record.fileUrl || record.imageUrl || "",
      filePath: record.filePath || "",
    });
  }

  return normalized;
};

const normalizeExtracurriculars = (items: unknown[]): ExtracurricularRecord[] => {
  if (!items.length) return [];
  const normalized: ExtracurricularRecord[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<ExtracurricularRecord>;
    if (typeof record.text !== "string") return [];
    normalized.push({
      id: record.id || record.text.toLowerCase().replace(/\s+/g, "-"),
      text: record.text,
    });
  }

  return normalized;
};

const normalizeInterests = (items: unknown[]): InterestRecord[] => {
  if (!items.length) return [];
  const normalized: InterestRecord[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<InterestRecord>;
    if (typeof record.name !== "string") return [];
    normalized.push({
      id: record.id || record.name.toLowerCase().replace(/\s+/g, "-"),
      name: record.name,
      logoUrl: record.logoUrl || "",
      domain: record.domain || "",
    });
  }

  return normalized;
};

const normalizeSkills = (items: unknown[]): SkillRecord[] => {
  if (!items.length) return [];
  const normalized: SkillRecord[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<SkillRecord>;
    if (typeof record.name !== "string") return [];
    normalized.push({
      id: record.id || record.name.toLowerCase().replace(/\s+/g, "-"),
      name: record.name,
      category: record.category || "Programming/Web",
      logoUrl: record.logoUrl || "",
    });
  }

  return normalized;
};

const normalizeProfile = (value: unknown): ProfileContent | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<ProfileContent>;
  return {
    tagline: typeof record.tagline === "string" ? record.tagline : defaultProfile.tagline,
    bio: typeof record.bio === "string" ? record.bio : defaultProfile.bio,
    email: typeof record.email === "string" ? record.email : "",
    githubUrl: typeof record.githubUrl === "string" ? record.githubUrl : "",
    linkedinUrl: typeof record.linkedinUrl === "string" ? record.linkedinUrl : "",
    resumeUrl: typeof record.resumeUrl === "string" ? record.resumeUrl : "",
    avatarUrl: typeof record.avatarUrl === "string" ? record.avatarUrl : "",
    phone: typeof record.phone === "string" ? record.phone : defaultProfile.phone,
  };
};

export const getStoredProjects = (): ProjectRecord[] => {
  if (typeof window === "undefined") return defaultProjects;
  const raw = localStorage.getItem(PROJECTS_KEY);
  const parsed = readArray<unknown>(raw, []);
  if (!raw) return defaultProjects;
  const normalized = normalizeProjects(parsed);
  return normalized.length ? normalized : defaultProjects;
};

export const setStoredProjects = (projects: ProjectRecord[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  emitPortfolioUpdate();
};

export const getStoredCertificates = (): CertificateRecord[] => {
  if (typeof window === "undefined") return [];
  const parsed = readArray<unknown>(localStorage.getItem(CERTS_KEY), []);
  return normalizeCertificates(parsed);
};

export const setStoredCertificates = (certs: CertificateRecord[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CERTS_KEY, JSON.stringify(certs));
  emitPortfolioUpdate();
};

export const getStoredAdminTrigger = (): string => {
  if (typeof window === "undefined") return DEFAULT_ADMIN_TRIGGER;
  const raw = localStorage.getItem(ADMIN_TRIGGER_KEY);
  if (!raw) return DEFAULT_ADMIN_TRIGGER;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string" && parsed.trim()) {
      return parsed.trim();
    }
  } catch {
    if (raw.trim()) return raw.trim();
  }
  return DEFAULT_ADMIN_TRIGGER;
};

export const setStoredAdminTrigger = (trigger: string) => {
  if (typeof window === "undefined") return;
  const trimmed = trigger.trim();
  if (!trimmed) return;
  localStorage.setItem(ADMIN_TRIGGER_KEY, JSON.stringify(trimmed));
  emitPortfolioUpdate();
};

export const getStoredProfile = (): ProfileContent =>
  readStoredObject<ProfileContent>(PROFILE_KEY, defaultProfile, normalizeProfile);

export const setStoredProfile = (profile: ProfileContent) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  emitPortfolioUpdate();
};

export const getStoredExtracurriculars = (): ExtracurricularRecord[] =>
  readStoredList(EXTRACURRICULARS_KEY, defaultExtracurriculars, normalizeExtracurriculars).items;

export const setStoredExtracurriculars = (items: ExtracurricularRecord[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXTRACURRICULARS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
};

export const getStoredInterests = (): InterestRecord[] =>
  readStoredList(INTERESTS_KEY, defaultInterests, normalizeInterests).items;

export const setStoredInterests = (items: InterestRecord[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
};

export const getStoredSkills = (): { items: SkillRecord[]; hasStored: boolean } =>
  readStoredList(SKILLS_KEY, defaultSkills, normalizeSkills);

export const setStoredSkills = (items: SkillRecord[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SKILLS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
};
