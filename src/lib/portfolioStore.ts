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
  name: string;
  greeting: string;
  nameFontSize: number;
  taglineFontSize: number;
  tagline: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  avatarUrl: string;
  phone?: string;
  careerGoals?: string;
  education?: string;
};

export type ExtracurricularRecord = {
  id: string;
  text: string;
  fileUrl?: string;
  filePath?: string;
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

export type EducationBeadRecord = {
  id: string;
  heading: string;
  content: string;
  color: string;
  parentId?: string | null;
};

export const defaultProjects: ProjectRecord[] = [];

export const defaultProfile: ProfileContent = {
  name: "",
  greeting: "",
  nameFontSize: 5,
  taglineFontSize: 3,
  tagline: "",
  bio: "",
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  resumeUrl: "",
  avatarUrl: "",
  phone: "",
  careerGoals: "",
  education: "",
};

export const defaultExtracurriculars: ExtracurricularRecord[] = [];

export const defaultInterests: InterestRecord[] = [];

export const defaultSkills: SkillRecord[] = [];

export const defaultCertificates: CertificateRecord[] = [];
const DEFAULT_ADMIN_TRIGGER = "dk160106";
const DEFAULT_TERMINAL_PASSWORD = "admin";

export const defaultEducationBeads: EducationBeadRecord[] = [];

const PROJECTS_KEY = "portfolio.projects.v1";
const CERTS_KEY = "portfolio.certificates.v1";
const PROFILE_KEY = "portfolio.profile.v1";
const EXTRACURRICULARS_KEY = "portfolio.extracurriculars.v1";
const INTERESTS_KEY = "portfolio.interests.v1";
const SKILLS_KEY = "portfolio.skills.v1";
const ADMIN_TRIGGER_KEY = "portfolio.adminTrigger.v1";
const TERMINAL_PASSWORD_KEY = "portfolio.terminalPassword.v1";
const EDUCATION_BEADS_KEY = "portfolio.educationBeads.v1";
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
      fileUrl: record.fileUrl || "",
      filePath: record.filePath || "",
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

const normalizeEducationBeads = (items: unknown[]): EducationBeadRecord[] => {
  if (!items.length) return [];
  const normalized: EducationBeadRecord[] = [];

  for (const item of items) {
    if (!item || typeof item !== "object") return [];
    const record = item as Partial<EducationBeadRecord>;
    if (typeof record.heading !== "string") return [];
    normalized.push({
      id: record.id || record.heading.toLowerCase().replace(/\s+/g, "-"),
      heading: record.heading,
      content: record.content || "",
      color: record.color || "text-cyber-cyan",
      parentId: record.parentId || null,
    });
  }

  return normalized;
};

const normalizeProfile = (value: unknown): ProfileContent | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<ProfileContent>;
  return {
    name: typeof record.name === "string" ? record.name : defaultProfile.name,
    greeting: typeof record.greeting === "string" ? record.greeting : defaultProfile.greeting,
    nameFontSize: typeof record.nameFontSize === "number" ? record.nameFontSize : defaultProfile.nameFontSize,
    taglineFontSize: typeof record.taglineFontSize === "number" ? record.taglineFontSize : defaultProfile.taglineFontSize,
    tagline: typeof record.tagline === "string" ? record.tagline : defaultProfile.tagline,
    bio: typeof record.bio === "string" ? record.bio : defaultProfile.bio,
    email: typeof record.email === "string" ? record.email : "",
    githubUrl: typeof record.githubUrl === "string" ? record.githubUrl : "",
    linkedinUrl: typeof record.linkedinUrl === "string" ? record.linkedinUrl : "",
    resumeUrl: typeof record.resumeUrl === "string" ? record.resumeUrl : "",
    avatarUrl: typeof record.avatarUrl === "string" ? record.avatarUrl : "",
    phone: typeof record.phone === "string" ? record.phone : defaultProfile.phone,
    careerGoals: typeof record.careerGoals === "string" ? record.careerGoals : defaultProfile.careerGoals,
    education: typeof record.education === "string" ? record.education : defaultProfile.education,
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

export const syncToDatabase = (action: string, data: any): void => {
  if (typeof window === "undefined") return;
  fetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error(`❌ DB sync failed [${action}]:`, errData.error || res.status);
      } else {
        console.log(`✅ DB synced [${action}]`);
      }
    })
    .catch((err) => {
      console.error(`❌ DB sync network error [${action}]:`, err.message);
    });
};

// Awaitable version for admin panel saves — shows alert on failure
export const saveToDB = async (action: string, data: any): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, data }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error || `Server error ${res.status}`;
      alert(`⚠️ Save failed: ${errMsg}`);
      return false;
    }
    return true;
  } catch (err: any) {
    alert(`⚠️ Network error saving to database: ${err.message}`);
    return false;
  }
};

export const setStoredProjects = (projects: ProjectRecord[], skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_projects", projects);
};

export const getStoredCertificates = (): CertificateRecord[] => {
  if (typeof window === "undefined") return [];
  const parsed = readArray<unknown>(localStorage.getItem(CERTS_KEY), []);
  return normalizeCertificates(parsed);
};

export const setStoredCertificates = (certs: CertificateRecord[], skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CERTS_KEY, JSON.stringify(certs));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_certificates", certs);
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

export const setStoredAdminTrigger = (trigger: string, skipSync = false) => {
  if (typeof window === "undefined") return;
  const trimmed = trigger.trim();
  if (!trimmed) return;
  localStorage.setItem(ADMIN_TRIGGER_KEY, JSON.stringify(trimmed));
  emitPortfolioUpdate();
};

export const getStoredTerminalPassword = (): string => {
  if (typeof window === "undefined") return DEFAULT_TERMINAL_PASSWORD;
  const raw = localStorage.getItem(TERMINAL_PASSWORD_KEY);
  if (!raw) return DEFAULT_TERMINAL_PASSWORD;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string" && parsed.trim()) {
      return parsed.trim();
    }
  } catch {
    if (raw.trim()) return raw.trim();
  }
  return DEFAULT_TERMINAL_PASSWORD;
};

export const setStoredTerminalPassword = (password: string) => {
  if (typeof window === "undefined") return;
  const trimmed = password.trim();
  if (!trimmed) return;
  localStorage.setItem(TERMINAL_PASSWORD_KEY, JSON.stringify(trimmed));
  emitPortfolioUpdate();
};

export const getStoredProfile = (): ProfileContent =>
  readStoredObject<ProfileContent>(PROFILE_KEY, defaultProfile, normalizeProfile);

export const setStoredProfile = (profile: ProfileContent, skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_profile", profile);
};

export const getStoredExtracurriculars = (): ExtracurricularRecord[] =>
  readStoredList(EXTRACURRICULARS_KEY, defaultExtracurriculars, normalizeExtracurriculars).items;

export const setStoredExtracurriculars = (items: ExtracurricularRecord[], skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXTRACURRICULARS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_extracurriculars", items);
};

export const getStoredInterests = (): InterestRecord[] =>
  readStoredList(INTERESTS_KEY, defaultInterests, normalizeInterests).items;

export const setStoredInterests = (items: InterestRecord[], skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_interests", items);
};

export const getStoredSkills = (): { items: SkillRecord[]; hasStored: boolean } =>
  readStoredList(SKILLS_KEY, defaultSkills, normalizeSkills);

export const setStoredSkills = (items: SkillRecord[], skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SKILLS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_skills", items);
};

export const getStoredEducationBeads = (): EducationBeadRecord[] =>
  readStoredList(EDUCATION_BEADS_KEY, defaultEducationBeads, normalizeEducationBeads).items;

export const setStoredEducationBeads = (items: EducationBeadRecord[], skipSync = false) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(EDUCATION_BEADS_KEY, JSON.stringify(items));
  emitPortfolioUpdate();
  if (!skipSync) syncToDatabase("save_education_beads", items);
};
