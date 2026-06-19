"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  defaultProfile,
  getStoredProfile,
  getStoredEducationBeads,
  EducationBeadRecord,
  PORTFOLIO_UPDATE_EVENT,
  ProfileContent,
} from "@/lib/portfolioStore";

export default function About() {
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);
  const [educationBeads, setEducationBeads] = useState<EducationBeadRecord[]>([]);

  useEffect(() => {
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

  const careerBeads = educationBeads.filter((b) => b.parentId === "career-goals");
  const eduBeads = educationBeads.filter((b) => b.parentId !== "career-goals");

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
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">About</h2>
            <div className="flex-1 h-px bg-cyber-gray/40 max-w-xs" />
          </div>

          <div className="grid md:grid-cols-12 gap-10 items-start">

            {/* LEFT — bio card */}
            <div className="md:col-span-7">
              <div className="bg-[#080c14] border border-cyber-gray/50 rounded-xl p-8 space-y-6">
                {/* Bio */}
                {profile.bio ? (
                  <p className="text-cyber-text/75 leading-relaxed text-base border-l-2 border-cyber-neon/30 pl-5">
                    {profile.bio}
                  </p>
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

                <div className="pl-5 border-l border-cyber-gray/40 space-y-3">
                  {profile.careerGoals && (
                    <p className="text-cyber-text/65 text-sm leading-relaxed whitespace-pre-line">
                      {profile.careerGoals}
                    </p>
                  )}
                  {careerBeads.map((bead) => (
                    <div key={bead.id} className="space-y-0.5">
                      <p className="text-cyber-text/80 text-sm font-medium">{bead.heading}</p>
                      {bead.content && (
                        <p className="text-cyber-text/45 text-xs leading-relaxed">{bead.content}</p>
                      )}
                    </div>
                  ))}
                  {!profile.careerGoals && careerBeads.length === 0 && (
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

                <div className="pl-5 border-l border-cyber-gray/40 space-y-3">
                  {profile.education && (
                    <p className="text-cyber-text/65 text-sm leading-relaxed whitespace-pre-line">
                      {profile.education}
                    </p>
                  )}
                  {eduBeads.map((bead) => {
                    const colorMap: Record<string, string> = {
                      "text-cyber-cyan": "text-cyber-cyan",
                      "text-cyber-neon": "text-cyber-neon",
                      "text-cyber-purple": "text-cyber-purple",
                    };
                    const headingColor = colorMap[bead.color] || "text-cyber-cyan";
                    return (
                      <div key={bead.id} className="space-y-0.5">
                        <p className={`text-sm font-medium ${headingColor}`}>{bead.heading}</p>
                        {bead.content && (
                          <p className="text-cyber-text/45 text-xs leading-relaxed">{bead.content}</p>
                        )}
                      </div>
                    );
                  })}
                  {!profile.education && eduBeads.length === 0 && (
                    <p className="text-cyber-text/20 text-xs italic font-mono">Not set yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
