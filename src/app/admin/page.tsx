"use client";

import { useState, useEffect } from "react";
import { FolderGit2, FileBadge, User, Settings, Database, Server, Upload, Plus, Lock, GraduationCap, Compass, Cpu, FileText } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CertificateRecord,
  defaultSkills,
  ExtracurricularRecord,
  getStoredAdminTrigger,
  getStoredCertificates,
  getStoredExtracurriculars,
  getStoredInterests,
  getStoredProjects,
  getStoredProfile,
  getStoredSkills,
  getStoredTerminalPassword,
  getStoredEducationBeads,
  InterestRecord,
  ProjectRecord,
  setStoredCertificates,
  setStoredExtracurriculars,
  setStoredInterests,
  setStoredAdminTrigger,
  setStoredTerminalPassword,
  setStoredProjects,
  setStoredProfile,
  setStoredSkills,
  setStoredEducationBeads,
  SkillRecord,
  EducationBeadRecord,
  PORTFOLIO_UPDATE_EVENT,
  saveToDB,
} from "@/lib/portfolioStore";

const ADMIN_STARTUP = [
  "> INITIATING ADMIN OVERRIDE...",
  "[✓] Credentials verified",
  "[✓] Decrypting Project Vault",
  "[✓] Accessing Security Logs",
  "[✓] Bypassing Firewalls",
  "> ADMIN ACCESS GRANTED."
];

type ProjectDraft = ProjectRecord & { techInput: string };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState("");
  const [bootComplete, setBootComplete] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminTriggerInput, setAdminTriggerInput] = useState("");
  const [terminalPasswordInput, setTerminalPasswordInput] = useState("");

  // Profile State
  const [profileTagline, setProfileTagline] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileGithubUrl, setProfileGithubUrl] = useState("");
  const [profileLinkedinUrl, setProfileLinkedinUrl] = useState("");
  const [profileResumeUrl, setProfileResumeUrl] = useState("");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCareerGoals, setProfileCareerGoals] = useState("");
  const [profileEducation, setProfileEducation] = useState("");
  
  // Education Beads State
  const [educationBeadsList, setEducationBeadsList] = useState<EducationBeadRecord[]>([]);
  const [newBeadHeading, setNewBeadHeading] = useState("");
  const [newBeadContent, setNewBeadContent] = useState("");
  const [newBeadColor, setNewBeadColor] = useState("text-cyber-cyan");
  
  // Future Interests State
  const [interestInput, setInterestInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [interestsList, setInterestsList] = useState<InterestRecord[]>([]);

  // Skills State
  const [skillInput, setSkillInput] = useState("");
  const [skillCategoryInput, setSkillCategoryInput] = useState("Security concepts");
  const [skillLogoUrl, setSkillLogoUrl] = useState("");
  const [isUploadingSkillLogo, setIsUploadingSkillLogo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [skillsList, setSkillsList] = useState<SkillRecord[]>([]);

  // Extracurriculars State
  const [extracurricularInput, setExtracurricularInput] = useState("");
  const [extracurricularsList, setExtracurricularsList] = useState<ExtracurricularRecord[]>([]);
  const [extracurricularFileUrl, setExtracurricularFileUrl] = useState("");
  const [isUploadingExtraFile, setIsUploadingExtraFile] = useState(false);

  // Existing Projects and Certs State
  const [existingProjects, setExistingProjects] = useState<ProjectRecord[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectDraft, setEditingProjectDraft] = useState<ProjectDraft | null>(null);

  const [existingCerts, setExistingCerts] = useState<CertificateRecord[]>([]);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingCertDraft, setEditingCertDraft] = useState<CertificateRecord | null>(null);

  const [newProject, setNewProject] = useState<ProjectDraft>({
    id: "",
    title: "",
    description: "",
    tech: [],
    techInput: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
  });

  const [newCert, setNewCert] = useState<CertificateRecord>({
    id: "",
    name: "",
    issuer: "",
    imageUrl: "",
    fileUrl: "",
    filePath: "",
  });

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated via sessionStorage
    if (localStorage.getItem("isAdmin") !== "true") {
      router.push("/");
      return;
    }
    setIsAuthenticated(true);

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLineIndex < ADMIN_STARTUP.length) {
        const targetLine = ADMIN_STARTUP[currentLineIndex];
        
        if (currentCharIndex < targetLine.length) {
          setCurrentLineText(targetLine.substring(0, currentCharIndex + 1));
          currentCharIndex++;
        } else {
          setCompletedLines((prev) => [...prev, targetLine]);
          setCurrentLineText("");
          currentLineIndex++;
          currentCharIndex = 0;
        }
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 600);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setExistingProjects(getStoredProjects());
    setExistingCerts(getStoredCertificates());
    const profile = getStoredProfile();
    setProfileTagline(profile.tagline);
    setProfileBio(profile.bio);
    setProfileEmail(profile.email);
    setProfileGithubUrl(profile.githubUrl);
    setProfileLinkedinUrl(profile.linkedinUrl);
    setProfileResumeUrl(profile.resumeUrl);
    setProfileAvatarUrl(profile.avatarUrl);
    setProfilePhone(profile.phone || "");
    setProfileCareerGoals(profile.careerGoals || "");
    setProfileEducation(profile.education || "");
    setExtracurricularsList(getStoredExtracurriculars());
    setInterestsList(getStoredInterests());
    setSkillsList(getStoredSkills().items);
    setEducationBeadsList(getStoredEducationBeads());
    setAdminTriggerInput(getStoredAdminTrigger());
    setTerminalPasswordInput(getStoredTerminalPassword());
  }, []);

  // Re-sync form fields whenever DatabaseHydrator populates localStorage from Supabase
  useEffect(() => {
    const handler = () => {
      setExistingProjects(getStoredProjects());
      setExistingCerts(getStoredCertificates());
      const profile = getStoredProfile();
      setProfileTagline(profile.tagline);
      setProfileBio(profile.bio);
      setProfileEmail(profile.email);
      setProfileGithubUrl(profile.githubUrl);
      setProfileLinkedinUrl(profile.linkedinUrl);
      setProfileResumeUrl(profile.resumeUrl);
      setProfileAvatarUrl(profile.avatarUrl);
      setProfilePhone(profile.phone || "");
      setProfileCareerGoals(profile.careerGoals || "");
      setProfileEducation(profile.education || "");
      setExtracurricularsList(getStoredExtracurriculars());
      setInterestsList(getStoredInterests());
      setSkillsList(getStoredSkills().items);
      setEducationBeadsList(getStoredEducationBeads());
      setAdminTriggerInput(getStoredAdminTrigger());
      setTerminalPasswordInput(getStoredTerminalPassword());
    };
    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handler);
    return () => window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handler);
  }, []);

  const saveProfile = async () => {
    const profile = {
      tagline: profileTagline.trim(),
      bio: profileBio.trim(),
      email: profileEmail.trim(),
      githubUrl: profileGithubUrl.trim(),
      linkedinUrl: profileLinkedinUrl.trim(),
      resumeUrl: profileResumeUrl.trim(),
      avatarUrl: profileAvatarUrl.trim(),
      phone: profilePhone.trim(),
      careerGoals: profileCareerGoals.trim(),
      education: profileEducation.trim(),
    };
    // Save to localStorage
    localStorage.setItem("portfolio.profile.v1", JSON.stringify(profile));
    // Save to Supabase DB
    const ok = await saveToDB("save_profile", profile);
    if (ok) alert("✅ Profile saved successfully!");
  };

  const uploadFile = async (file: File, folder: "profile" | "projects" | "certs" | "skills") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const message = typeof payload.error === "string" ? payload.error : "Upload failed";
      throw new Error(message);
    }

    return response.json() as Promise<{ publicUrl: string; path: string }>;
  };

  const menuItems = [
    { id: "overview", label: "System Overview", icon: Server },
    { id: "profile", label: "Profile Content", icon: User },
    { id: "projects", label: "Projects Vault", icon: FolderGit2 },
    { id: "certificates", label: "Certificates", icon: FileBadge },
    { id: "extracurriculars", label: "Extracurriculars", icon: GraduationCap },
    { id: "interests", label: "Future Interests", icon: Compass },
    { id: "skills", label: "Skills Dashboard", icon: Cpu },
    { id: "settings", label: "Security", icon: Settings },
  ];

  if (!isAuthenticated) {
    return null; // Return empty until auth is verified and redirect happens
  }

  if (!bootComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center">
        <div className="absolute inset-0 pointer-events-none scanlines"></div>
        <div className="w-full max-w-2xl px-6">
          <div className="font-mono text-lg text-[#ff3366] space-y-2">
            {completedLines.map((line, i) => (
              <div key={i} className={line.startsWith(">") ? "font-bold mt-4" : "opacity-80 ml-4"}>
                {line}
              </div>
            ))}
            {completedLines.length < ADMIN_STARTUP.length && (
              <div className={ADMIN_STARTUP[completedLines.length]?.startsWith(">") ? "font-bold mt-4" : "opacity-80 ml-4"}>
                {currentLineText}
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-3 h-5 bg-[#ff3366] ml-1 align-middle"
                />
              </div>
            )}
            {completedLines.length === ADMIN_STARTUP.length && (
              <div className="mt-4">
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-3 h-5 bg-[#ff3366] ml-1 align-middle"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 relative z-10 pb-20">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-cyber-dark border border-cyber-gray rounded-lg p-4 sticky top-24">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left font-mono text-sm transition-colors ${
                  activeTab === item.id 
                    ? "bg-cyber-neon/20 text-cyber-neon border border-cyber-neon/50" 
                    : "text-cyber-text/70 hover:bg-cyber-gray hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-cyber-dark border border-cyber-gray rounded-lg p-8 min-h-[600px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-mono text-white mb-6 flex items-center gap-2">
                  <Database className="text-cyber-neon" />
                  SYSTEM STATUS
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-cyber-black border border-cyber-gray p-4 rounded border-l-4 border-l-cyber-neon relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyber-neon/5 group-hover:bg-cyber-neon/10 transition-colors"></div>
                    <div className="text-cyber-text/50 text-xs font-mono mb-1">TOTAL PROJECTS</div>
                    <div className="text-3xl font-bold text-white relative z-10">{existingProjects.length}</div>
                  </div>
                  <div className="bg-cyber-black border border-cyber-gray p-4 rounded border-l-4 border-l-cyber-purple relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyber-purple/5 group-hover:bg-cyber-purple/10 transition-colors"></div>
                    <div className="text-cyber-text/50 text-xs font-mono mb-1">CERTIFICATES</div>
                    <div className="text-3xl font-bold text-white relative z-10">{existingCerts.length}</div>
                  </div>
                  <div className="bg-cyber-black border border-cyber-gray p-4 rounded border-l-4 border-l-cyber-cyan relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyber-cyan/5 group-hover:bg-cyber-cyan/10 transition-colors"></div>
                    <div className="text-cyber-text/50 text-xs font-mono mb-1">ACTIVITIES</div>
                    <div className="text-3xl font-bold text-white relative z-10">{extracurricularsList.length}</div>
                  </div>
                  <div className="bg-cyber-black border border-cyber-gray p-4 rounded border-l-4 border-l-[#ff3366] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#ff3366]/5 group-hover:bg-[#ff3366]/10 transition-colors"></div>
                    <div className="text-cyber-text/50 text-xs font-mono mb-1">INTERESTS</div>
                    <div className="text-3xl font-bold text-white relative z-10">{interestsList.length}</div>
                  </div>
                </div>
              </div>

              <div className="border border-cyber-gray rounded p-4 bg-cyber-black font-mono text-sm text-cyber-text/80 space-y-2 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon/50 to-transparent opacity-50"></div>
                <p className="text-cyber-cyan font-bold">TERMINAL LOGS:</p>
                <p>[2026-05-17 07:00:00] SYSTEM INITIALIZED.</p>
                <p>[2026-05-17 07:05:22] ADMIN LOGIN DETECTED FROM 127.0.0.1.</p>
                <p>[2026-05-17 07:10:01] DB CONNECTION SUCCESSFUL.</p>
                <p className="animate-pulse">_</p>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                  <User className="text-[#ff3366]" />
                  PROFILE SETTINGS
                </h2>
              </div>
              
              <div className="bg-cyber-black border border-cyber-gray rounded-lg p-6 mb-8 relative">
                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2">UPDATE TAGLINE</h3>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    value={profileTagline}
                    onChange={(e) => setProfileTagline(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                  <button
                    onClick={saveProfile}
                    className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors"
                  >
                    SAVE TAGLINE
                  </button>
                </div>

                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2 mt-8">UPDATE BIO</h3>
                <div className="space-y-4">
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none h-32"
                  />
                  <button
                    onClick={saveProfile}
                    className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors"
                  >
                    SAVE BIO
                  </button>
                </div>

                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2 mt-8">UPDATE CAREER GOALS</h3>
                <div className="space-y-4">
                  <textarea
                    value={profileCareerGoals}
                    onChange={(e) => setProfileCareerGoals(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none h-24"
                    placeholder="Enter your career goals..."
                  />
                  <button
                    onClick={saveProfile}
                    className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors"
                  >
                    SAVE CAREER GOALS
                  </button>
                </div>

                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2 mt-8">UPDATE EDUCATION</h3>
                <div className="space-y-4">
                  <textarea
                    value={profileEducation}
                    onChange={(e) => setProfileEducation(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none h-24"
                    placeholder="Enter your education details..."
                  />
                  <button
                    onClick={saveProfile}
                    className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors"
                  >
                    SAVE EDUCATION
                  </button>
                </div>

                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2 mt-8">EDUCATION TIMELINE BEADS</h3>
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Bead Heading (e.g. 2024 - B.Tech)"
                      value={newBeadHeading}
                      onChange={(e) => setNewBeadHeading(e.target.value)}
                      className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                    />
                    <select
                      value={newBeadColor}
                      onChange={(e) => setNewBeadColor(e.target.value)}
                      className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                    >
                      <option value="text-cyber-cyan">Cyan</option>
                      <option value="text-cyber-neon">Neon Green</option>
                      <option value="text-cyber-purple">Purple</option>
                      <option value="text-[#ff3366]">Red</option>
                    </select>
                    <button
                      onClick={async () => {
                        if (!newBeadHeading.trim()) return;
                        const newEntry: EducationBeadRecord = {
                          id: typeof crypto !== "undefined" && "randomUUID" in crypto
                            ? crypto.randomUUID()
                            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                          heading: newBeadHeading.trim(),
                          content: newBeadContent.trim(),
                          color: newBeadColor,
                        };
                        const updated = [...educationBeadsList, newEntry];
                        setEducationBeadsList(updated);
                        setStoredEducationBeads(updated, true);
                        setNewBeadHeading("");
                        setNewBeadContent("");
                        const ok = await saveToDB("save_education_beads", updated);
                        if (ok) alert("✅ Education bead added!");
                      }}
                      className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors h-[46px]"
                    >
                      ADD BEAD
                    </button>
                  </div>
                  <textarea
                    placeholder="Bead Content Description"
                    value={newBeadContent}
                    onChange={(e) => setNewBeadContent(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none h-20"
                  />
                  
                  <div className="mt-4 space-y-2">
                    <Reorder.Group axis="y" values={educationBeadsList} onReorder={(newOrder) => {
                      setEducationBeadsList(newOrder);
                      setStoredEducationBeads(newOrder, true);
                      saveToDB("save_education_beads", newOrder);
                    }} className="space-y-2">
                      {educationBeadsList.map((bead) => (
                        <Reorder.Item key={bead.id} value={bead} className="flex justify-between items-center bg-cyber-black border border-cyber-gray p-3 rounded cursor-grab active:cursor-grabbing hover:border-[#ff3366] transition-colors">
                          <div className="flex flex-col">
                            <span className={`font-mono text-sm font-bold ${bead.color}`}>{bead.heading}</span>
                            <span className="font-mono text-xs text-cyber-text/60 truncate max-w-xs">{bead.content}</span>
                          </div>
                          <button
                            onClick={async () => {
                              const updated = educationBeadsList.filter(b => b.id !== bead.id);
                              setEducationBeadsList(updated);
                              setStoredEducationBeads(updated, true);
                              await saveToDB("save_education_beads", updated);
                            }}
                            className="text-red-500 hover:text-red-400 font-mono text-xs border border-red-500/50 px-2 py-1 rounded transition-colors"
                          >
                            DELETE
                          </button>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                </div>

                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2 mt-10">CONTACT & LINKS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={profileGithubUrl}
                    onChange={(e) => setProfileGithubUrl(e.target.value)}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn URL"
                    value={profileLinkedinUrl}
                    onChange={(e) => setProfileLinkedinUrl(e.target.value)}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Resume/CV URL"
                    value={profileResumeUrl}
                    onChange={(e) => setProfileResumeUrl(e.target.value)}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Profile Image URL"
                    value={profileAvatarUrl}
                    onChange={(e) => setProfileAvatarUrl(e.target.value)}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number (e.g. +91 98765 43210)"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <label className="border-2 border-dashed border-cyber-gray hover:border-[#ff3366] bg-cyber-dark/50 rounded-lg p-6 flex flex-col items-center justify-center text-cyber-text/50 hover:text-[#ff3366] transition-colors cursor-pointer group relative overflow-hidden">
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { publicUrl } = await uploadFile(file, "profile");
                          setProfileResumeUrl(publicUrl);
                          alert("Resume uploaded successfully!");
                        } catch (error) {
                          const message = error instanceof Error ? error.message : "Upload failed";
                          alert("Upload failed: " + message);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-[#ff3366]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Upload size={28} className="mb-2" />
                    <span className="font-mono text-xs">UPLOAD RESUME (PDF)</span>
                  </label>

                  <label className="border-2 border-dashed border-cyber-gray hover:border-[#ff3366] bg-cyber-dark/50 rounded-lg p-6 flex flex-col items-center justify-center text-cyber-text/50 hover:text-[#ff3366] transition-colors cursor-pointer group relative overflow-hidden">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const { publicUrl } = await uploadFile(file, "profile");
                          setProfileAvatarUrl(publicUrl);
                          alert("Profile image uploaded successfully!");
                        } catch (error) {
                          const message = error instanceof Error ? error.message : "Upload failed";
                          alert("Upload failed: " + message);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-[#ff3366]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Upload size={28} className="mb-2" />
                    <span className="font-mono text-xs">UPLOAD PROFILE IMAGE</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={saveProfile}
                    className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors"
                  >
                    SAVE CONTACTS
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                  <FolderGit2 className="text-cyber-cyan" />
                  PROJECTS VAULT
                </h2>
              </div>
              
              <div className="bg-cyber-black border border-cyber-gray rounded-lg p-6 mb-8 relative">
                <h3 className="font-mono text-cyber-cyan mb-4 flex items-center gap-2"><Plus size={16}/> ADD NEW PROJECT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none"
                  />
                  <input
                    type="text"
                    placeholder="GitHub URL"
                    value={newProject.githubUrl || ""}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, githubUrl: e.target.value }))}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Live Demo URL"
                    value={newProject.liveUrl || ""}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, liveUrl: e.target.value }))}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Tech (comma-separated)"
                    value={newProject.techInput}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, techInput: e.target.value }))}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none"
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none mb-4 h-24"
                />
                
                <label className="border-2 border-dashed border-cyber-gray hover:border-cyber-cyan bg-cyber-dark/50 rounded-lg p-8 flex flex-col items-center justify-center text-cyber-text/50 hover:text-cyber-cyan transition-colors cursor-pointer mb-4 group relative overflow-hidden">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const { publicUrl } = await uploadFile(file, "projects");
                        setNewProject((prev) => ({ ...prev, imageUrl: publicUrl }));
                        alert("Project image uploaded successfully!");
                      } catch (error) {
                        const message = error instanceof Error ? error.message : "Upload failed";
                        alert("Upload failed: " + message);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Upload size={32} className="mb-2 group-hover:animate-bounce" />
                  <span className="font-mono text-sm">UPLOAD PROJECT PREVIEW IMAGE [ PNG / JPG / WEBP ]</span>
                </label>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      const title = newProject.title.trim();
                      if (!title) {
                        alert("Project title is required.");
                        return;
                      }
                      const tech = newProject.techInput
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean);
                      const newEntry: ProjectRecord = {
                        id: typeof crypto !== "undefined" && "randomUUID" in crypto
                          ? crypto.randomUUID()
                          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        title,
                        description: newProject.description.trim(),
                        tech,
                        githubUrl: newProject.githubUrl?.trim() || "",
                        liveUrl: newProject.liveUrl?.trim() || "",
                        imageUrl: newProject.imageUrl || "",
                      };
                      const updated = [newEntry, ...existingProjects];
                      setExistingProjects(updated);
                      localStorage.setItem("portfolio.projects.v1", JSON.stringify(updated));
                      setNewProject({
                        id: "",
                        title: "",
                        description: "",
                        tech: [],
                        techInput: "",
                        githubUrl: "",
                        liveUrl: "",
                        imageUrl: "",
                      });
                      const ok = await saveToDB("save_projects", updated);
                      if (ok) alert("✅ Project saved to database!");
                    }}
                    className="px-6 py-2 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan rounded hover:bg-cyber-cyan/40 font-mono text-sm transition-colors flex items-center gap-2"
                  >
                    <Database size={16} /> SAVE TO VAULT
                  </button>
                </div>
              </div>

              <h3 className="font-mono text-white mb-4 mt-8 border-b border-cyber-gray pb-2">EXISTING PROJECTS (Drag to Reorder)</h3>
              <Reorder.Group axis="y" values={existingProjects} onReorder={(newOrder) => {
                setExistingProjects(newOrder);
                setStoredProjects(newOrder);
              }} className="space-y-3">
                {existingProjects.map((project) => {
                  const isEditing = editingProjectId === project.id;
                  return (
                    <Reorder.Item key={project.id} value={project} className="flex flex-col md:flex-row md:items-start gap-4 bg-cyber-black border border-cyber-gray p-4 rounded hover:border-cyber-cyan transition-colors cursor-grab active:cursor-grabbing">
                      {isEditing && editingProjectDraft ? (
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editingProjectDraft.title}
                              onChange={(e) => setEditingProjectDraft({ ...editingProjectDraft, title: e.target.value })}
                              className="bg-cyber-dark border border-cyber-cyan p-2 rounded text-white font-mono text-sm outline-none"
                              placeholder="Project Title"
                              autoFocus
                            />
                            <input
                              type="text"
                              value={editingProjectDraft.githubUrl || ""}
                              onChange={(e) => setEditingProjectDraft({ ...editingProjectDraft, githubUrl: e.target.value })}
                              className="bg-cyber-dark border border-cyber-cyan p-2 rounded text-white font-mono text-sm outline-none"
                              placeholder="GitHub URL"
                            />
                            <input
                              type="text"
                              value={editingProjectDraft.liveUrl || ""}
                              onChange={(e) => setEditingProjectDraft({ ...editingProjectDraft, liveUrl: e.target.value })}
                              className="bg-cyber-dark border border-cyber-cyan p-2 rounded text-white font-mono text-sm outline-none"
                              placeholder="Live Demo URL"
                            />
                            <input
                              type="text"
                              value={editingProjectDraft.techInput}
                              onChange={(e) => setEditingProjectDraft({ ...editingProjectDraft, techInput: e.target.value })}
                              className="bg-cyber-dark border border-cyber-cyan p-2 rounded text-white font-mono text-sm outline-none"
                              placeholder="Tech (comma-separated)"
                            />
                          </div>
                          <textarea
                            value={editingProjectDraft.description}
                            onChange={(e) => setEditingProjectDraft({ ...editingProjectDraft, description: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-cyan p-2 rounded text-white font-mono text-sm outline-none h-20"
                            placeholder="Description"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 space-y-2">
                          <div className="font-mono text-cyber-cyan">{project.title}</div>
                          <div className="text-xs font-mono text-cyber-text/60">
                            GitHub: {project.githubUrl ? project.githubUrl : "not set"}
                          </div>
                          <div className="text-xs font-mono text-cyber-text/60">
                            Live: {project.liveUrl ? project.liveUrl : "not set"}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 md:flex-col md:items-end">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                if (!editingProjectDraft) return;
                                const tech = editingProjectDraft.techInput
                                  .split(",")
                                  .map((item) => item.trim())
                                  .filter(Boolean);
                                const updated = existingProjects.map((item) =>
                                  item.id === project.id
                                    ? {
                                        id: editingProjectDraft.id,
                                        title: editingProjectDraft.title.trim(),
                                        description: editingProjectDraft.description.trim(),
                                        tech,
                                        githubUrl: editingProjectDraft.githubUrl?.trim() || "",
                                        liveUrl: editingProjectDraft.liveUrl?.trim() || "",
                                        imageUrl: editingProjectDraft.imageUrl || "",
                                      }
                                    : item
                                );
                                setExistingProjects(updated);
                                setStoredProjects(updated);
                                setEditingProjectId(null);
                                setEditingProjectDraft(null);
                              }}
                              className="text-cyber-neon hover:text-white font-mono text-xs border border-cyber-neon/50 px-3 py-1 rounded transition-colors"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => {
                                setEditingProjectId(null);
                                setEditingProjectDraft(null);
                              }}
                              className="text-cyber-text/70 hover:text-white font-mono text-xs border border-cyber-gray/50 px-3 py-1 rounded transition-colors"
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProjectId(project.id);
                              setEditingProjectDraft({
                                ...project,
                                techInput: project.tech?.join(", ") || "",
                              });
                            }}
                            className="text-cyber-cyan hover:text-white font-mono text-xs border border-cyber-cyan/50 px-3 py-1 rounded transition-colors"
                          >
                            EDIT
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const updated = existingProjects.filter((item) => item.id !== project.id);
                            setExistingProjects(updated);
                            setStoredProjects(updated);
                          }}
                          className="text-red-500 hover:text-red-400 font-mono text-xs border border-red-500/50 px-2 py-1 rounded transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </motion.div>
          )}

          {activeTab === "certificates" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                  <FileBadge className="text-cyber-purple" />
                  CERTIFICATES
                </h2>
              </div>
              
              <div className="bg-cyber-black border border-cyber-gray rounded-lg p-6 relative mb-8">
                <h3 className="font-mono text-cyber-purple mb-4 flex items-center gap-2"><Plus size={16}/> ISSUE NEW CERTIFICATE</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Certificate Name"
                    value={newCert.name}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-purple outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Issuer (e.g. Oracle, IBM)"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert((prev) => ({ ...prev, issuer: e.target.value }))}
                    className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-purple outline-none"
                  />
                </div>
                
                <label className="border-2 border-dashed border-cyber-gray hover:border-cyber-purple bg-cyber-dark/50 rounded-lg p-8 flex flex-col items-center justify-center text-cyber-text/50 hover:text-cyber-purple transition-colors cursor-pointer mb-4 group relative overflow-hidden min-h-[160px]">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp, application/pdf" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const { publicUrl, path } = await uploadFile(file, "certs");
                        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
                        setNewCert((prev) => ({
                          ...prev,
                          filePath: path,
                          fileUrl: publicUrl,
                          imageUrl: isPdf ? "" : publicUrl,
                        }));
                        alert("Certificate uploaded successfully!");
                      } catch (error) {
                        const message = error instanceof Error ? error.message : "Upload failed";
                        alert("Upload failed: " + message);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {newCert.fileUrl ? (
                    <div className="flex flex-col items-center text-center z-10">
                      {newCert.imageUrl ? (
                        <img 
                          src={newCert.imageUrl} 
                          alt="Certificate preview" 
                          className="max-h-24 object-contain rounded border border-cyber-purple/50 mb-2 shadow-[0_0_15px_rgba(189,0,255,0.25)]" 
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-red-500/10 flex items-center justify-center border border-red-500/50 mb-2 shadow-[0_0_12px_rgba(239,68,68,0.25)] text-red-500 text-xl font-bold font-mono">
                          PDF
                        </div>
                      )}
                      <span className="font-mono text-xs text-cyber-purple font-bold">UPLOADED SUCCESSFULLY</span>
                      <span className="font-mono text-[10px] text-cyber-text/50 truncate max-w-xs mt-1">
                        {newCert.filePath?.split('/').pop() || ""}
                      </span>
                      <span className="font-mono text-[10px] text-cyber-text/30 mt-2 hover:underline">
                        (Click to change file)
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mb-2 group-hover:animate-bounce" />
                      <span className="font-mono text-sm">ENCRYPT & UPLOAD CERTIFICATE FILE</span>
                    </>
                  )}
                </label>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      const name = newCert.name.trim();
                      if (!name) {
                        alert("Certificate name is required.");
                        return;
                      }
                      if (!newCert.fileUrl && !newCert.imageUrl) {
                        alert("Upload a certificate file first.");
                        return;
                      }
                      const newEntry: CertificateRecord = {
                        id: typeof crypto !== "undefined" && "randomUUID" in crypto
                          ? crypto.randomUUID()
                          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                        name,
                        issuer: newCert.issuer.trim() || "Verified Vault",
                        imageUrl: newCert.imageUrl || "",
                        fileUrl: newCert.fileUrl || newCert.imageUrl || "",
                        filePath: newCert.filePath || "",
                      };
                      const updated = [newEntry, ...existingCerts];
                      setExistingCerts(updated);
                      localStorage.setItem("portfolio.certificates.v1", JSON.stringify(updated));
                      setNewCert({
                        id: "",
                        name: "",
                        issuer: "",
                        imageUrl: "",
                        fileUrl: "",
                        filePath: "",
                      });
                      const ok = await saveToDB("save_certificates", updated);
                      if (ok) alert("✅ Certificate saved to database!");
                    }}
                    className="px-6 py-2 bg-cyber-purple/20 text-cyber-purple border border-cyber-purple rounded hover:bg-cyber-purple/40 font-mono text-sm transition-colors flex items-center gap-2"
                  >
                    <Lock size={16} /> SAVE CERTIFICATE
                  </button>
                </div>
              </div>

              <h3 className="font-mono text-white mb-4 mt-8 border-b border-cyber-gray pb-2">EXISTING CERTIFICATES (Drag to Reorder)</h3>
              <Reorder.Group axis="y" values={existingCerts} onReorder={(newOrder) => {
                setExistingCerts(newOrder);
                setStoredCertificates(newOrder);
              }} className="space-y-3">
                {existingCerts.map((cert) => {
                  const isEditing = editingCertId === cert.id;
                  return (
                    <Reorder.Item key={cert.id} value={cert} className="flex justify-between items-center bg-cyber-black border border-cyber-gray p-4 rounded hover:border-cyber-purple transition-colors cursor-grab active:cursor-grabbing">
                      {isEditing && editingCertDraft ? (
                        <div className="flex-1 space-y-2 mr-2">
                          <input
                            type="text"
                            value={editingCertDraft.name}
                            onChange={(e) => setEditingCertDraft({ ...editingCertDraft, name: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-purple p-2 rounded text-white font-mono text-xs outline-none"
                            placeholder="Certificate Name"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={editingCertDraft.issuer}
                            onChange={(e) => setEditingCertDraft({ ...editingCertDraft, issuer: e.target.value })}
                            className="w-full bg-cyber-dark border border-cyber-purple p-2 rounded text-white font-mono text-xs outline-none"
                            placeholder="Issuer"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 flex-1 pr-2 min-w-0">
                          {/* Thumbnail preview */}
                          <div className="w-12 h-12 rounded bg-white/5 border border-cyber-purple/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {cert.imageUrl ? (
                              <img src={cert.imageUrl} alt={cert.name} className="w-full h-full object-cover" />
                            ) : cert.fileUrl ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/10 text-red-500 text-[10px] font-bold font-mono">
                                PDF
                              </div>
                            ) : (
                              <FileBadge className="text-cyber-purple" size={20} />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <a 
                              href={cert.fileUrl || cert.imageUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="font-mono text-sm text-cyber-purple hover:text-white hover:underline truncate block font-bold cursor-pointer"
                              title="Click to view certificate"
                            >
                              {cert.name}
                            </a>
                            <div className="font-mono text-[10px] text-cyber-text/60 truncate">ISSUER: {cert.issuer}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 flex-shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => {
                                if (!editingCertDraft) return;
                                const updated = existingCerts.map((item) =>
                                  item.id === cert.id
                                    ? {
                                        ...editingCertDraft,
                                        name: editingCertDraft.name.trim(),
                                        issuer: editingCertDraft.issuer.trim() || "Verified Vault",
                                      }
                                    : item
                                );
                                setExistingCerts(updated);
                                setStoredCertificates(updated);
                                setEditingCertId(null);
                                setEditingCertDraft(null);
                              }}
                              className="text-cyber-neon hover:text-white font-mono text-xs border border-cyber-neon/50 px-3 py-1 rounded transition-colors"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => {
                                setEditingCertId(null);
                                setEditingCertDraft(null);
                              }}
                              className="text-cyber-text/70 hover:text-white font-mono text-xs border border-cyber-gray/50 px-3 py-1 rounded transition-colors"
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingCertId(cert.id);
                              setEditingCertDraft({ ...cert });
                            }}
                            className="text-cyber-purple hover:text-white font-mono text-xs border border-cyber-purple/50 px-3 py-1 rounded transition-colors"
                          >
                            EDIT
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const updated = existingCerts.filter((item) => item.id !== cert.id);
                            setExistingCerts(updated);
                            setStoredCertificates(updated);
                          }}
                          className="text-red-500 hover:text-red-400 font-mono text-xs border border-red-500/50 px-2 py-1 rounded transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </motion.div>
          )}
          {activeTab === "extracurriculars" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                  <GraduationCap className="text-cyber-cyan" />
                  EXTRACURRICULARS
                </h2>
              </div>
              
              <div className="bg-cyber-black border border-cyber-gray rounded-lg p-6 mb-8">
                <h3 className="font-mono text-cyber-cyan mb-4 flex items-center gap-2"><Plus size={16}/> ADD ACTIVITY</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={extracurricularInput}
                      onChange={(e) => setExtracurricularInput(e.target.value)}
                      placeholder="e.g. Participated in Hackathon 2024"
                      className="flex-1 bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-cyber-text/50 mb-1">FILE ATTACHMENT URL (OPTIONAL)</label>
                      <input
                        type="text"
                        value={extracurricularFileUrl}
                        onChange={(e) => setExtracurricularFileUrl(e.target.value)}
                        placeholder="https://... (or upload below)"
                        className="w-full bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <label className="w-full border border-dashed border-cyber-gray hover:border-cyber-cyan bg-cyber-dark/50 rounded p-3 flex items-center justify-center text-cyber-text/50 hover:text-cyber-cyan transition-colors cursor-pointer text-sm font-mono relative overflow-hidden">
                        <input
                          type="file"
                          className="hidden"
                          accept="application/pdf, image/png, image/jpeg, image/webp"
                          disabled={isUploadingExtraFile}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setIsUploadingExtraFile(true);
                              const { publicUrl } = await uploadFile(file, "certs");
                              setExtracurricularFileUrl(publicUrl);
                              alert("File uploaded successfully!");
                            } catch (error) {
                              const message = error instanceof Error ? error.message : "Upload failed";
                              alert("Upload failed: " + message);
                            } finally {
                              setIsUploadingExtraFile(false);
                            }
                          }}
                        />
                        <Upload size={16} className="mr-2" />
                        <span>{isUploadingExtraFile ? "UPLOADING..." : "UPLOAD PDF OR IMAGE"}</span>
                      </label>
                    </div>
                  </div>

                  {extracurricularFileUrl && (
                    <div className="flex justify-between items-center bg-cyber-dark border border-cyber-gray/50 px-4 py-2 rounded text-xs font-mono text-cyber-cyan">
                      <span className="truncate max-w-md">Attachment: {extracurricularFileUrl}</span>
                      <button
                        type="button"
                        onClick={() => setExtracurricularFileUrl("")}
                        className="text-red-500 hover:text-red-400"
                      >
                        REMOVE
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={async () => {
                        const text = extracurricularInput.trim();
                        if (!text) return;
                        const newEntry: ExtracurricularRecord = {
                          id: typeof crypto !== "undefined" && "randomUUID" in crypto
                            ? crypto.randomUUID()
                            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                          text,
                          fileUrl: extracurricularFileUrl || undefined,
                          filePath: extracurricularFileUrl ? extracurricularFileUrl.substring(extracurricularFileUrl.indexOf("certs/")) : undefined,
                        };
                        const updated = [...extracurricularsList, newEntry];
                        setExtracurricularsList(updated);
                        setStoredExtracurriculars(updated, true);
                        
                        const ok = await saveToDB("save_extracurriculars", updated);
                        if (ok) {
                          alert("✅ Activity added and synced to database!");
                          setExtracurricularInput("");
                          setExtracurricularFileUrl("");
                        }
                      }}
                      className="px-6 py-2 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan rounded hover:bg-cyber-cyan/40 font-mono text-sm transition-colors"
                    >
                      ADD ACTIVITY
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="font-mono text-white mb-4 border-b border-cyber-gray pb-2">EXISTING EXTRACURRICULARS</h3>
              <div className="space-y-3">
                {extracurricularsList.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center bg-cyber-black border border-cyber-gray p-4 rounded hover:border-cyber-cyan transition-colors">
                    <div className="flex flex-col">
                      <span className="font-mono text-sm text-cyber-text">{activity.text}</span>
                      {activity.fileUrl && (
                        <a
                          href={activity.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-cyber-cyan hover:underline mt-1 flex items-center gap-1"
                        >
                          <FileText size={12} />
                          View Attachment
                        </a>
                      )}
                    </div>
                    <button
                      onClick={async () => {
                        if (!confirm("Are you sure you want to delete this activity?")) return;
                        const updated = extracurricularsList.filter((item) => item.id !== activity.id);
                        setExtracurricularsList(updated);
                        setStoredExtracurriculars(updated, true);
                        
                        const ok = await saveToDB("save_extracurriculars", updated);
                        if (ok) {
                          alert("✅ Activity deleted and synced to database!");
                        }
                      }}
                      className="text-red-500 hover:text-red-400 font-mono text-xs border border-red-500/50 px-2 py-1 rounded"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "interests" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                  <Compass className="text-[#ff3366]" />
                  FUTURE INTERESTS
                </h2>
              </div>
              
              <div className="bg-cyber-black border border-cyber-gray rounded-lg p-6 mb-8">
                <h3 className="font-mono text-[#ff3366] mb-4 flex items-center gap-2"><Plus size={16}/> ADD INTEREST (AI ASSISTED)</h3>
                <p className="text-cyber-text/60 font-mono text-xs mb-4">
                  Enter an interest. The system will use Groq AI to fetch relevant metadata and a logo icon from the web. Max 4 interests recommended.
                </p>
                <div className="flex gap-4 mb-4">
                  <input 
                    type="text" 
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="e.g. Quantum Cryptography" 
                    className="flex-1 bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-[#ff3366] outline-none" 
                    disabled={isGenerating}
                  />
                  <button 
                    onClick={async () => {
                      if (!interestInput.trim()) return;
                      setIsGenerating(true);
                      try {
                        const res = await fetch('/api/groq', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ interest: interestInput })
                        });
                        const data = await res.json();
                        if (data.logoUrl) {
                          const newEntry: InterestRecord = {
                            id: typeof crypto !== "undefined" && "randomUUID" in crypto
                              ? crypto.randomUUID()
                              : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                            name: interestInput,
                            logoUrl: data.logoUrl,
                            domain: data.domain || "",
                          };
                          const updated = [...interestsList, newEntry];
                          setInterestsList(updated);
                          setStoredInterests(updated);
                          setInterestInput("");
                        } else {
                          alert("AI Failed: " + data.error);
                        }
                      } catch (e) {
                        alert("Error generating interest");
                      }
                      setIsGenerating(false);
                    }}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded hover:bg-[#ff3366]/40 font-mono text-sm transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? "GENERATING..." : "GENERATE & ADD"}
                  </button>
                </div>
              </div>

              <h3 className="font-mono text-white mb-4 border-b border-cyber-gray pb-2">EXISTING INTERESTS</h3>
              <div className="grid grid-cols-2 gap-4">
                {interestsList.map((interest) => (
                  <div key={interest.id} className="flex justify-between items-center bg-cyber-black border border-cyber-gray p-4 rounded hover:border-[#ff3366] transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={interest.logoUrl} alt={interest.name} className="w-8 h-8 rounded bg-white p-1" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32?text=AI' }} />
                      <span className="font-mono text-sm text-cyber-text">{interest.name}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = interestsList.filter((item) => item.id !== interest.id);
                        setInterestsList(updated);
                        setStoredInterests(updated);
                      }}
                      className="text-red-500 hover:text-red-400 font-mono text-xs border border-red-500/50 px-2 py-1 rounded"
                    >
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "skills" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                  <Cpu className="text-cyber-cyan" />
                  SKILLS DASHBOARD
                </h2>
              </div>
              
              <div className="bg-cyber-black border border-cyber-gray rounded-lg p-6 mb-8 relative">
                <h3 className="font-mono text-cyber-cyan mb-4 flex items-center gap-2"><Plus size={16}/> ADD NEW SKILL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-cyber-text/50">SKILL NAME</label>
                    <input 
                      type="text" 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. Terraform" 
                      className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none w-full" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-cyber-text/50">CATEGORY</label>
                    <select
                      value={skillCategoryInput}
                      onChange={(e) => setSkillCategoryInput(e.target.value)}
                      className="bg-cyber-dark border border-cyber-gray p-3 rounded text-white font-mono text-sm focus:border-cyber-cyan outline-none w-full"
                    >
                      <option value="Security concepts">Security concepts</option>
                      <option value="Tools">Tools</option>
                      <option value="Programming/Web">Programming/Web</option>
                      <option value="Emerging Tech">Emerging Tech</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-cyber-text/50">ICON (OPTIONAL)</label>
                    <label 
                      className={`border-2 border-dashed ${isDragging ? "border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]" : "border-cyber-gray hover:border-cyber-cyan"} bg-cyber-dark/50 rounded p-3 flex items-center justify-center text-cyber-text/50 hover:text-cyber-cyan transition-all cursor-pointer relative overflow-hidden min-h-[46px]`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (!file) return;
                        setIsUploadingSkillLogo(true);
                        try {
                          const { publicUrl } = await uploadFile(file, "skills");
                          setSkillLogoUrl(publicUrl);
                          alert("Icon uploaded successfully!");
                        } catch (error) {
                          alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
                        } finally {
                          setIsUploadingSkillLogo(false);
                        }
                      }}
                    >
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/webp, image/svg+xml" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingSkillLogo(true);
                          try {
                            const { publicUrl } = await uploadFile(file, "skills");
                            setSkillLogoUrl(publicUrl);
                            alert("Icon uploaded successfully!");
                          } catch (error) {
                            alert("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
                          } finally {
                            setIsUploadingSkillLogo(false);
                          }
                        }}
                      />
                      <Upload size={18} className="mr-2" />
                      <span className="font-mono text-sm">
                        {isUploadingSkillLogo ? "UPLOADING..." : skillLogoUrl ? "CHANGE ICON (OR DROP HERE)" : "UPLOAD ICON (OR DROP HERE)"}
                      </span>
                    </label>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={async () => {
                        const nameTrimmed = skillInput.trim();
                        if (!nameTrimmed) {
                          alert("Please enter a skill name.");
                          return;
                        }
                        const newEntry: SkillRecord = {
                          id: typeof crypto !== "undefined" && "randomUUID" in crypto
                            ? crypto.randomUUID()
                            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                          name: nameTrimmed,
                          category: skillCategoryInput,
                          logoUrl: skillLogoUrl,
                        };
                        const updated = [...skillsList, newEntry];
                        setSkillsList(updated);
                        localStorage.setItem("portfolio.skills.v1", JSON.stringify(updated));
                        setSkillInput("");
                        setSkillLogoUrl("");
                        const ok = await saveToDB("save_skills", updated);
                        if (ok) alert("✅ Skill added and saved to database!");
                        else alert("Skill added locally but database save failed — check the error above.");
                      }}
                      className="w-full py-3 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan rounded hover:bg-cyber-cyan/40 font-mono text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      ADD SKILL
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4 border-b border-cyber-gray pb-2">
                <h3 className="font-mono text-white">EXISTING SKILLS</h3>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to reset skills to the default template? This will replace your current custom skills list.")) {
                      setSkillsList(defaultSkills);
                      setStoredSkills(defaultSkills);
                      alert("Skills reset to the default template successfully!");
                    }
                  }}
                  className="px-3 py-1 bg-red-500/20 text-red-500 border border-red-500/50 rounded hover:bg-red-500/40 font-mono text-xs transition-colors"
                >
                  RESET TO DEFAULT TEMPLATE
                </button>
              </div>
              <Reorder.Group axis="y" values={skillsList} onReorder={(newOrder) => {
                setSkillsList(newOrder);
                setStoredSkills(newOrder);
              }} className="space-y-3">
                {skillsList.map((skill) => (
                  <Reorder.Item 
                    key={skill.id} 
                    value={skill} 
                    className="flex justify-between items-center bg-cyber-black border border-cyber-gray p-4 rounded hover:border-cyber-cyan transition-colors cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10 p-1 flex items-center justify-center border border-cyber-cyan/50 shadow-[0_0_10px_rgba(0,255,255,0.25)]">
                        {skill.logoUrl ? (
                          <img src={skill.logoUrl} alt={skill.name} className="w-full h-full object-contain filter drop-shadow-md" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <span className="text-cyber-cyan text-xs">💻</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm text-cyber-text">{skill.name}</span>
                        <span className="font-mono text-[10px] text-cyber-text/50">{skill.category}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = skillsList.filter((item) => item.id !== skill.id);
                        setSkillsList(updated);
                        setStoredSkills(updated);
                      }}
                      className="text-red-500 hover:text-red-400 font-mono text-xs border border-red-500/50 px-2 py-1 rounded cursor-pointer"
                    >
                      DELETE
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-bold font-mono text-white mb-6 text-red-500">SECURITY SETTINGS</h2>
              
              <div className="space-y-6 max-w-md bg-cyber-black border border-red-500/30 p-6 rounded relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Settings size={120} className="animate-[spin_20s_linear_infinite]" />
                </div>
                
                <div className="space-y-2 relative z-10 mb-4">
                  <label className="font-mono text-sm text-cyber-text/70 block">
                    CHANGE ADMIN LOGIN TRIGGER
                  </label>
                  <input
                    type="text"
                    placeholder="New trigger code"
                    value={adminTriggerInput}
                    onChange={(e) => setAdminTriggerInput(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray focus:border-red-500 rounded p-3 text-white font-mono outline-none"
                  />
                </div>

                <div className="space-y-2 relative z-10">
                  <label className="font-mono text-sm text-cyber-text/70 block">
                    TERMINAL REDIRECTION PASSWORD
                  </label>
                  <input
                    type="text"
                    placeholder="New terminal password"
                    value={terminalPasswordInput}
                    onChange={(e) => setTerminalPasswordInput(e.target.value)}
                    className="w-full bg-cyber-dark border border-cyber-gray focus:border-red-500 rounded p-3 text-white font-mono outline-none"
                  />
                </div>
                
                <div className="mt-8 pt-4 border-t border-red-500/20 relative z-10">
                  <button
                    onClick={async () => {
                      const triggerTrimmed = adminTriggerInput.trim();
                      const passwordTrimmed = terminalPasswordInput.trim();
                      if (!triggerTrimmed || !passwordTrimmed) return;
                      
                      setStoredAdminTrigger(triggerTrimmed);
                      setStoredTerminalPassword(passwordTrimmed);
                      
                      const ok = await saveToDB("save_admin_settings", { trigger: triggerTrimmed, terminalPassword: passwordTrimmed });
                      if (ok) alert("✅ Security credentials updated successfully!");
                    }}
                    className="w-full px-6 py-3 bg-red-500/20 text-red-500 border border-red-500 hover:bg-red-500 hover:text-black rounded font-mono font-bold transition-colors"
                  >
                    UPDATE SECURITY CREDENTIALS
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
