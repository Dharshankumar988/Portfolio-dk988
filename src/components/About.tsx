"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, X, ExternalLink } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  defaultProfile,
  getStoredProfile,
  getStoredEducationBeads,
  EducationBeadRecord,
  PORTFOLIO_UPDATE_EVENT,
  ProfileContent,
} from "@/lib/portfolioStore";

const BeadNode = ({ bead, allBeads, level = 0, onFileClick }: { bead: EducationBeadRecord, allBeads: EducationBeadRecord[], level?: number, onFileClick: (url: string) => void }) => {
  const colorMap: Record<string, string> = {
    "text-cyber-cyan": "bg-cyber-cyan shadow-[0_0_5px_rgba(0,240,255,0.8)]",
    "text-cyber-neon": "bg-cyber-neon shadow-[0_0_5px_rgba(57,255,20,0.8)]",
    "text-cyber-purple": "bg-cyber-purple shadow-[0_0_5px_rgba(188,19,254,0.8)]",
  };
  const dotClass = colorMap[bead.color] || "bg-cyber-cyan";
  const textClass = bead.color || "text-cyber-text/80";
  const children = allBeads.filter(b => b.parentId === bead.id);

  return (
    <div className={`relative space-y-2 mt-4 ${level > 0 ? "ml-6" : ""}`}>
      {level > 0 && (
        <div className="absolute -left-6 top-2.5 w-6 h-px bg-cyber-gray/40" />
      )}
      <div className={`relative ${level === 0 ? "pl-2" : "pl-6"}`}>
        <div className={`absolute ${level === 0 ? "-left-[21px]" : "left-0"} top-1.5 w-2 h-2 rounded-full ${dotClass} ${level > 0 ? "scale-75" : ""}`} />
        <p className={`font-medium ${level > 0 ? "text-sm" : "text-base"} ${textClass}`}>
          {bead.heading}
        </p>
        {bead.content && (
          <p className="text-cyber-text/50 text-xs leading-relaxed mt-1">{bead.content}</p>
        )}
        {bead.fileUrl && (
          <button
            onClick={() => onFileClick(bead.fileUrl!)}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-cyber-dark border border-cyber-gray/50 hover:border-cyber-cyan hover:text-cyber-cyan text-cyber-text/70 rounded text-[10px] font-mono transition-colors"
          >
            <ExternalLink size={10} /> VIEW CERTIFICATE
          </button>
        )}
      </div>
      {children.length > 0 && (
        <div className="relative border-l border-cyber-gray/20 ml-1 pl-1">
          {children.map(child => (
            <BeadNode key={child.id} bead={child} allBeads={allBeads} level={level + 1} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function About() {
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);
  const [educationBeads, setEducationBeads] = useState<EducationBeadRecord[]>([]);
  const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleUpdate = () => {
      setProfile(getStoredProfile());
      setEducationBeads(getStoredEducationBeads());
    };
    handleUpdate();
    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const links = [
    profile.email && { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail, color: "text-cyber-cyan border-cyber-cyan/30 hover:border-cyber-cyan/60 hover:bg-cyber-cyan/5" },
    profile.githubUrl && { label: "GitHub", value: "GitHub", href: profile.githubUrl, icon: FaGithub, color: "text-cyber-neon border-cyber-neon/30 hover:border-cyber-neon/60 hover:bg-cyber-neon/5" },
    profile.linkedinUrl && { label: "LinkedIn", value: "LinkedIn", href: profile.linkedinUrl, icon: FaLinkedin, color: "text-[#0A66C2] border-[#0A66C2]/30 hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/5" },
    profile.phone && { label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, icon: Phone, color: "text-cyber-text/70 border-cyber-gray/50 hover:border-cyber-gray hover:bg-white/3" },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: any; color: string }[];

  const careerBeadsRoot = educationBeads.filter((b) => b.parentId === "career-goals");
  const eduBeadsRoot = educationBeads.filter((b) => b.parentId === "education" || !b.parentId);

  return (
    <section className="relative py-24 px-6 md:px-24 z-10" id="about">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-cyber-neon glow-text-neon uppercase tracking-widest">About_</h2>
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-start">

            {/* LEFT — bio card */}
            <div className="md:col-span-7">
              <div className="bg-[#080c14] border border-cyber-gray/50 rounded-xl p-8 space-y-6">
                {/* Bio */}
                {profile.bio ? (
                  <div className="bg-[#0a0e17] rounded-lg border border-cyber-gray/40 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyber-gray/30 bg-[#0d1117]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      <span className="ml-2 font-mono text-[10px] text-cyber-text/40">user.bio</span>
                    </div>
                    <div className="p-5 font-mono text-[13px] leading-relaxed text-[#c9d1d9] whitespace-pre-wrap">
                      {profile.bio}
                    </div>
                  </div>
                ) : (
                  <p className="text-cyber-text/25 text-sm italic">Bio not set — add via Admin panel.</p>
                )}

                {/* Tagline chip */}
                {profile.tagline && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
                    <span className="font-mono text-xs text-cyber-cyan/80">{profile.tagline}</span>
                  </div>
                )}

                {/* Contact links */}
                {links.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {links.map(({ label, value, href, icon: Icon, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg font-mono text-xs transition-all duration-200 ${color}`}
                      >
                        <Icon size={12} />
                        {value}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — goals + education */}
            <div className="md:col-span-5 space-y-10">

              {/* Career Goals */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-neon shadow-[0_0_6px_rgba(57,255,20,0.8)]" />
                  <h3 className="text-sm font-semibold text-cyber-neon tracking-wider uppercase font-mono">
                    Career Goals
                  </h3>
                </div>

                <div className="ml-[3px] pl-[17px] border-l border-cyber-gray/40 space-y-4">
                  {profile.careerGoals && (
                    <p className="text-cyber-text/65 text-sm leading-relaxed whitespace-pre-line">
                      {profile.careerGoals}
                    </p>
                  )}
                  {careerBeadsRoot.map((bead) => (
                    <BeadNode key={bead.id} bead={bead} allBeads={educationBeads} onFileClick={setViewFileUrl} />
                  ))}
                  {!profile.careerGoals && careerBeadsRoot.length === 0 && (
                    <p className="text-cyber-text/20 text-xs italic font-mono">Not set yet.</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_6px_rgba(0,240,255,0.8)]" />
                  <h3 className="text-sm font-semibold text-cyber-cyan tracking-wider uppercase font-mono">
                    Education
                  </h3>
                </div>

                <div className="ml-[3px] pl-[17px] border-l border-cyber-gray/40 space-y-4">
                  {profile.education && (
                    <p className="text-cyber-text/65 text-sm leading-relaxed whitespace-pre-line">
                      {profile.education}
                    </p>
                  )}
                  {eduBeadsRoot.map((bead) => (
                    <BeadNode key={bead.id} bead={bead} allBeads={educationBeads} onFileClick={setViewFileUrl} />
                  ))}
                  {!profile.education && eduBeadsRoot.length === 0 && (
                    <p className="text-cyber-text/20 text-xs italic font-mono">Not set yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {isMounted && createPortal(
        <AnimatePresence>
          {viewFileUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setViewFileUrl(null)}
            >
              <div 
                className="relative w-full max-w-4xl max-h-[90vh] bg-cyber-dark border border-cyber-gray rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b border-cyber-gray bg-cyber-black">
                  <h3 className="font-mono text-cyber-cyan font-bold">CERTIFICATE VIEWER</h3>
                  <button 
                    onClick={() => setViewFileUrl(null)}
                    className="text-cyber-text/50 hover:text-[#ff3366] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 bg-black/80 overflow-y-auto relative min-h-[500px] flex justify-center items-start p-4">
                  {viewFileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <img src={viewFileUrl} alt="Certificate" className="max-w-full h-auto object-contain" />
                  ) : (
                    <iframe 
                      src={viewFileUrl} 
                      className="w-full h-[80vh] min-h-[800px] border-none"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
