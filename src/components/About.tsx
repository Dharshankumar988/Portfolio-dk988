"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { defaultProfile, getStoredProfile, PORTFOLIO_UPDATE_EVENT, ProfileContent } from "@/lib/portfolioStore";

export default function About() {
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);

  useEffect(() => {
    const handleUpdate = () => setProfile(getStoredProfile());
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
  ].filter(Boolean) as { label: string; value: string; href: string; icon: any; color: string }[];

  return (
    <section className="relative py-24 px-6 md:px-24 z-10 flex items-center" id="about">
      <div className="w-full max-w-4xl mx-auto">
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

          {/* Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyber-neon to-cyber-cyan rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
            <div className="relative bg-cyber-dark border border-cyber-gray p-8 md:p-10 rounded-xl space-y-8">

              {/* Header row */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-neon/10 border border-cyber-neon/30 rounded-lg">
                  <User className="text-cyber-neon" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-mono tracking-wide">Professional Profile</h3>
                  <p className="text-cyber-text/50 font-mono text-xs tracking-widest mt-0.5">DHARSHAN KUMAR B</p>
                </div>
              </div>

              {/* Bio — only shown if set in DB */}
              {profile.bio ? (
                <p className="text-cyber-text/80 leading-relaxed text-lg font-sans border-l-2 border-cyber-neon/40 pl-5">
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
        </motion.div>
      </div>
    </section>
  );
}
