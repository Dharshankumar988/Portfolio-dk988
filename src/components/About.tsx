"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { defaultProfile, getStoredProfile, getStoredEducationBeads, EducationBeadRecord, PORTFOLIO_UPDATE_EVENT, ProfileContent } from "@/lib/portfolioStore";

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

  // Build detail chips only from real DB data
  const details = [
    profile.email    && { label: "Email",    value: profile.email,      href: `mailto:${profile.email}`,   icon: Mail,    color: "text-cyber-cyan" },
    profile.githubUrl && { label: "GitHub",  value: "GitHub Profile",   href: profile.githubUrl,            icon: FaGithub,  color: "text-cyber-neon" },
    profile.linkedinUrl && { label: "LinkedIn", value: "LinkedIn Profile", href: profile.linkedinUrl,       icon: FaLinkedin, color: "text-cyber-purple" },
    profile.phone && { label: "Phone", value: profile.phone, href: `tel:${profile.phone}`, icon: Phone, color: "text-cyber-neon" },
  ].filter(Boolean) as { label: string; value: string; href: string; icon: any; color: string }[];

  const renderBeadsList = (beadsToRender: EducationBeadRecord[]) => {
    if (!beadsToRender || beadsToRender.length === 0) return null;
    return (
      <div className="space-y-4 mt-6">
        {beadsToRender.map((bead) => {
          const dotColor = bead.color || "text-cyber-cyan";
          const bgColorClass = dotColor.replace('text-', 'bg-');
          const shadowClass = dotColor === "text-cyber-cyan" 
            ? "shadow-[0_0_8px_rgba(0,243,255,0.8)]" 
            : dotColor === "text-cyber-neon" 
            ? "shadow-[0_0_8px_rgba(57,255,20,0.8)]"
            : dotColor === "text-cyber-purple"
            ? "shadow-[0_0_8px_rgba(189,0,255,0.8)]"
            : "shadow-[0_0_8px_rgba(255,51,102,0.8)]";
            
          const isSubBead = !!bead.parentId;
          const containerClass = isSubBead ? "relative ml-6 border-l border-cyber-gray/40 pl-5 pt-2" : "relative pl-6 pt-4";
          const dotClass = isSubBead ? `absolute w-1.5 h-1.5 ${bgColorClass} rounded-full -left-[23.5px] top-3 ${shadowClass}` : `absolute w-2 h-2 ${bgColorClass} rounded-full -left-[29px] top-5 ${shadowClass}`;
          const headingSize = isSubBead ? "text-xs" : "text-sm";
          const textSize = isSubBead ? "text-xs" : "text-sm";

          return (
            <div key={bead.id} className={containerClass}>
              <div className={dotClass} />
              <h4 className={`${headingSize} font-bold font-mono ${dotColor} mb-1 tracking-wide`}>
                {bead.heading}
              </h4>
              <p className={`text-cyber-text/60 ${textSize} leading-relaxed whitespace-pre-line font-sans`}>
                {bead.content}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="relative py-24 px-6 md:px-24 z-10 flex items-center" id="about">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Section heading */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-cyber-cyan font-mono text-sm tracking-widest">01.</span>
            <h2 className="text-3xl font-bold text-white tracking-wider font-mono">About Me</h2>
            <div className="flex-1 h-px bg-cyber-gray/40 ml-4" />
          </div>

          {/* Grid Layout showing Profile Card on the left, Goals & Education on the right */}
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Card - Col span 7 */}
            <div className="md:col-span-7 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-neon to-cyber-cyan rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
              <div className="relative bg-cyber-dark border border-cyber-gray p-8 md:p-10 rounded-xl space-y-8">

                {/* Header row */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyber-neon/10 border border-cyber-neon/30 rounded-lg">
                    <User className="text-cyber-neon" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white font-mono tracking-wide">Profile</h3>
                    <p className="text-cyber-text/50 font-mono text-xs tracking-widest mt-0.5">DHARSHAN KUMAR B</p>
                  </div>
                </div>

                {/* Bio — only shown if set in DB */}
                {profile.bio ? (
                  <p className="text-cyber-text/80 leading-relaxed text-lg font-sans border-l-2 border-cyber-neon/40 pl-5 whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-cyber-text/30 leading-relaxed text-base font-mono italic">
                    — Bio not set yet. Add it via the Admin panel. —
                  </p>
                )}

                {/* Tagline badge */}
                {profile.tagline && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-cyan/5 border border-cyber-cyan/30 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                    <span className="font-mono text-sm text-cyber-cyan tracking-wide">{profile.tagline}</span>
                  </div>
                )}

                {/* Contact detail chips — only rendered for real DB values */}
                {details.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {details.map(({ label, value, href, icon: Icon, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 bg-cyber-black/60 border border-cyber-gray rounded-lg hover:border-cyber-cyan/60 transition-colors font-mono text-sm ${color}`}
                      >
                        <Icon size={15} />
                        {value}
                      </a>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Right Side - Career & Education - Col span 5 */}
            <div className="md:col-span-5 space-y-10 pl-2">
              
              {/* Career Goals */}
              <div className="border-l-2 border-cyber-gray pl-6 relative">
                <div className="absolute w-3 h-3 bg-cyber-neon rounded-full -left-[7px] top-2 shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
                <h3 className="text-xl font-bold text-white mb-3 font-mono tracking-wider">Career Goals</h3>
                <p className="text-cyber-text/75 text-base leading-relaxed whitespace-pre-line font-sans">
                  {profile.careerGoals || "To build highly resilient, intelligent systems that leverage AI and Blockchain to solve complex security challenges in enterprise and healthcare environments."}
                </p>
                {renderBeadsList(educationBeads.filter(b => b.parentId === "career-goals"))}
              </div>
              
              {/* Education */}
              <div className="border-l-2 border-cyber-gray pl-6 relative">
                <div className="absolute w-3 h-3 bg-cyber-cyan rounded-full -left-[7px] top-2 shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
                <h3 className="text-xl font-bold text-white mb-3 font-mono tracking-wider">Education</h3>
                <p className="text-cyber-text/75 text-base leading-relaxed whitespace-pre-line font-sans mb-6">
                  {profile.education || "B.E. Computer Science and Engineering\nFocus: Cybersecurity, Network Infrastructure, Machine Learning."}
                </p>

                {/* Education Beads (Timeline) */}
                {renderBeadsList(educationBeads.filter(b => b.parentId !== "career-goals"))}
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
