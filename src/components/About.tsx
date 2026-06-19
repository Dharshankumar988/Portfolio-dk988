"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  defaultProfile,
  getStoredProfile,
  getStoredEducationBeads,
  EducationBeadRecord,
  PORTFOLIO_UPDATE_EVENT,
  ProfileContent,
} from "@/lib/portfolioStore";

// Live clock for the "uptime" field
function useLiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function About() {
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);
  const [educationBeads, setEducationBeads] = useState<EducationBeadRecord[]>([]);
  const time = useLiveClock();

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

  const details = [
    profile.email && { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail, color: "text-cyber-cyan" },
    profile.githubUrl && { label: "GitHub", value: "GitHub", href: profile.githubUrl, icon: FaGithub, color: "text-cyber-neon" },
    profile.linkedinUrl && { label: "LinkedIn", value: "LinkedIn", href: profile.linkedinUrl, icon: FaLinkedin, color: "text-cyber-purple" },
    profile.phone && { label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, icon: Phone, color: "text-cyber-neon" },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: any; color: string }[];

  const renderBeadsList = (beads: EducationBeadRecord[]) => {
    if (!beads?.length) return null;
    return (
      <div className="space-y-4 mt-5">
        {beads.map((bead) => {
          const dotColor = bead.color || "text-cyber-cyan";
          const bgColorClass = dotColor.replace("text-", "bg-");
          const shadowClass =
            dotColor === "text-cyber-cyan" ? "shadow-[0_0_6px_rgba(0,243,255,0.7)]"
            : dotColor === "text-cyber-neon" ? "shadow-[0_0_6px_rgba(57,255,20,0.7)]"
            : dotColor === "text-cyber-purple" ? "shadow-[0_0_6px_rgba(176,38,255,0.7)]"
            : "shadow-[0_0_6px_rgba(255,51,102,0.7)]";
          const isSub = !!bead.parentId;
          return (
            <div key={bead.id} className={isSub ? "relative ml-5 border-l border-cyber-gray/30 pl-5 pt-1" : "relative pl-5 pt-3"}>
              <div className={`absolute w-1.5 h-1.5 ${bgColorClass} rounded-full ${isSub ? "-left-[22px] top-2.5" : "-left-[26px] top-4"} ${shadowClass}`} />
              <h4 className={`text-xs font-bold font-mono ${dotColor} mb-0.5 tracking-wide`}>{bead.heading}</h4>
              <p className="text-cyber-text/55 text-xs leading-relaxed whitespace-pre-line">{bead.content}</p>
            </div>
          );
        })}
      </div>
    );
  };

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
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-cyber-text/30 text-sm">00</span>
            <div className="h-px w-8 bg-cyber-text/20" />
            <span className="font-mono text-xs text-cyber-text/30 tracking-widest">PROFILE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight mb-14">
            About<span className="text-cyber-text/40">_</span>
          </h2>

          <div className="grid md:grid-cols-12 gap-10 items-start">

            {/* Left column */}
            <div className="md:col-span-7 space-y-5">

              {/* Profile card */}
              <div className="relative bg-[#080c14] border border-cyber-gray/50 rounded-lg overflow-hidden">
                {/* top bar */}
                <div className="flex items-center gap-3 px-5 py-3 bg-cyber-gray/20 border-b border-cyber-gray/40">
                  <User size={14} className="text-cyber-neon/60" />
                  <span className="font-mono text-xs text-cyber-text/40">profile.json</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/50" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <span className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>

                {/* JSON-style bio */}
                <div className="p-6 font-mono text-sm">
                  <div className="text-cyber-gray/50 mb-2">{"{"}</div>
                  <div className="pl-5 space-y-2">
                    <div>
                      <span className="text-cyber-purple/70">&quot;name&quot;</span>
                      <span className="text-cyber-text/40">: </span>
                      <span className="text-cyber-cyan/80">&quot;{profile.name || "—"}&quot;</span>
                      <span className="text-cyber-text/40">,</span>
                    </div>
                    {profile.tagline && (
                      <div>
                        <span className="text-cyber-purple/70">&quot;role&quot;</span>
                        <span className="text-cyber-text/40">: </span>
                        <span className="text-cyber-neon/70">&quot;{profile.tagline}&quot;</span>
                        <span className="text-cyber-text/40">,</span>
                      </div>
                    )}
                    {profile.bio && (
                      <div>
                        <span className="text-cyber-purple/70">&quot;bio&quot;</span>
                        <span className="text-cyber-text/40">: </span>
                        <span className="text-cyber-text/70 leading-relaxed whitespace-pre-wrap">&quot;{profile.bio}&quot;</span>
                        <span className="text-cyber-text/40">,</span>
                      </div>
                    )}
                    {details.length > 0 && (
                      <div>
                        <span className="text-cyber-purple/70">&quot;links&quot;</span>
                        <span className="text-cyber-text/40">: [</span>
                        <div className="pl-5 space-y-1 py-1">
                          {details.map(({ label, value, href, icon: Icon, color }) => (
                            <div key={label}>
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className={`${color} hover:underline transition-all inline-flex items-center gap-1.5 text-xs`}
                              >
                                <Icon size={11} />
                                {value}
                              </a>
                            </div>
                          ))}
                        </div>
                        <span className="text-cyber-text/40">]</span>
                      </div>
                    )}
                    {!profile.bio && details.length === 0 && (
                      <div className="text-cyber-text/20 italic text-xs">// No data — add via admin panel</div>
                    )}
                  </div>
                  <div className="text-cyber-gray/50 mt-2">{"}"}</div>
                </div>
              </div>

              {/* System stats mini panel */}
              <div className="bg-[#080c14] border border-cyber-gray/40 rounded-lg px-5 py-4 font-mono text-xs">
                <div className="flex items-center gap-2 mb-3 text-cyber-text/30">
                  <span className="text-cyber-neon/50">$</span>
                  <span>sys --status</span>
                  <span className="ml-auto text-cyber-text/20">{time}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-cyber-text/40">
                  <div className="flex justify-between">
                    <span className="text-cyber-text/25">status</span>
                    <span className="text-cyber-neon">active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyber-text/25">mode</span>
                    <span className="text-cyber-cyan">learning</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyber-text/25">projects</span>
                    <span className="text-cyber-text/60">building</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyber-text/25">collab</span>
                    <span className="text-cyber-text/60">open</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-5 space-y-8">

              {/* Career Goals */}
              <div className="border-l-2 border-cyber-gray/40 pl-6 relative">
                <div className="absolute w-3 h-3 bg-cyber-neon rounded-full -left-[7px] top-1.5 shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                <h3 className="text-base font-bold text-cyber-neon font-mono tracking-widest mb-3">
                  CAREER_GOALS
                </h3>
                {profile.careerGoals ? (
                  <p className="text-cyber-text/65 text-sm leading-relaxed whitespace-pre-line">
                    {profile.careerGoals}
                  </p>
                ) : (
                  <p className="text-cyber-text/20 text-xs italic font-mono">// not set</p>
                )}
                {renderBeadsList(educationBeads.filter((b) => b.parentId === "career-goals"))}
              </div>

              {/* Education */}
              <div className="border-l-2 border-cyber-gray/40 pl-6 relative">
                <div className="absolute w-3 h-3 bg-cyber-cyan rounded-full -left-[7px] top-1.5 shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
                <h3 className="text-base font-bold text-cyber-cyan font-mono tracking-widest mb-3">
                  EDUCATION
                </h3>
                {profile.education ? (
                  <p className="text-cyber-text/65 text-sm leading-relaxed whitespace-pre-line mb-4">
                    {profile.education}
                  </p>
                ) : (
                  <p className="text-cyber-text/20 text-xs italic font-mono mb-4">// not set</p>
                )}
                {renderBeadsList(educationBeads.filter((b) => b.parentId !== "career-goals"))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
