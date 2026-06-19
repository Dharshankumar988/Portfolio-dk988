"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Download, Mail, Phone, ChevronDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { defaultProfile, getStoredProfile, PORTFOLIO_UPDATE_EVENT, ProfileContent } from "@/lib/portfolioStore";

function useTypewriter(text: string, speed = 45) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return displayed;
}

export default function Hero() {
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);
  const [avatarVisible, setAvatarVisible] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    if (profile.phone) {
      navigator.clipboard.writeText(profile.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  useEffect(() => {
    setAvatarVisible(true);
  }, [profile.avatarUrl]);

  const typedGreeting = useTypewriter(profile.greeting || "", 50);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-24 z-10">

      <div className="w-full max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          
          {/* Typewriter greeting line */}
          <div className="font-mono text-sm md:text-base text-cyber-neon h-8 flex items-center gap-1">
            <span className="text-cyber-cyan opacity-70">▸</span>
            <span className="ml-1">{typedGreeting}</span>
            <span className="cursor-blink text-cyber-neon ml-0.5">_</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Name — clean gradient style */}
            <h1
              className="font-bold tracking-tight leading-none"
              style={{
                fontSize: `${(profile.nameFontSize || 5) * 0.5 + 1}rem`,
                lineHeight: 1.05,
                background: "linear-gradient(135deg, #ffffff 40%, #00f0ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {profile.name}
            </h1>

            <h2
              className="font-mono text-cyber-text/60 tracking-wide"
              style={{ fontSize: `${(profile.taglineFontSize || 3) * 0.2 + 0.8}rem`, lineHeight: 1.2 }}
            >
              {profile.tagline}
            </h2>



            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon hover:bg-cyber-neon hover:text-black transition-all font-mono text-sm rounded cyber-corner neon-border-hover group"
                >
                  <Download size={16} className="group-hover:animate-bounce" />
                  Download Resume
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 bg-cyber-neon/5 border border-cyber-neon/30 text-cyber-neon/40 font-mono text-sm rounded cursor-not-allowed"
                >
                  <Download size={16} />
                  Download Resume
                </button>
              )}

              {profile.email || profile.githubUrl || profile.linkedinUrl || profile.phone ? (
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex items-center gap-2 px-6 py-3 border border-cyber-cyan/60 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan transition-all font-mono text-sm rounded glow-box-cyan"
                >
                  <Mail size={16} />
                  Contact
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 border border-cyber-cyan/30 text-cyber-cyan/40 font-mono text-sm rounded cursor-not-allowed"
                >
                  <Mail size={16} />
                  Contact
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-56 h-56 md:w-80 md:h-80 relative group float-animation"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-cyber-neon rounded-full opacity-10 group-hover:opacity-25 blur-2xl transition-opacity duration-700" />
          {/* Spinning rings */}
          <div className="absolute inset-1 border-2 border-cyber-neon/40 rounded-full animate-[spin_12s_linear_infinite]">
            {/* Notch on ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyber-neon rounded-full shadow-[0_0_8px_rgba(57,255,20,1)]" />
          </div>
          <div className="absolute inset-5 border border-cyber-cyan/30 rounded-full animate-[spin_20s_linear_infinite_reverse]">
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyber-cyan rounded-full shadow-[0_0_6px_rgba(0,240,255,1)]" />
          </div>
          <div className="absolute inset-8 border border-cyber-purple/20 rounded-full animate-[spin_30s_linear_infinite]" />
          
          {/* Avatar image */}
          <div className="absolute inset-10 bg-cyber-gray rounded-full overflow-hidden border border-cyber-gray/60 z-10 flex items-center justify-center scan-animate">
            {profile.avatarUrl && avatarVisible ? (
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full aspect-square group-hover:scale-105 transition-transform duration-500"
                onError={() => setAvatarVisible(false)}
              />
            ) : (
              <Terminal size={48} className="text-cyber-neon/50" />
            )}
          </div>


        </motion.div>
      </div>



      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="bg-cyber-dark border border-cyber-cyan/60 p-8 rounded-lg max-w-sm w-full shadow-[0_0_40px_rgba(0,240,255,0.12)] flex flex-col gap-4 relative cyber-corner"
            >
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-cyber-text/40 hover:text-white hover:bg-cyber-gray rounded transition-colors font-mono text-sm"
              >
                ✕
              </button>
              <div className="mb-2">
                <h3 className="text-xl font-bold font-mono text-cyber-cyan tracking-wider">CONTACT_LINKS</h3>
                <div className="h-px bg-gradient-to-r from-cyber-cyan/60 to-transparent mt-3" />
              </div>
              
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-3 border border-cyber-gray hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all rounded text-cyber-text group">
                  <Mail className="text-cyber-cyan group-hover:scale-110 transition-transform shrink-0" size={22} />
                  <span className="font-mono text-sm break-all">{profile.email}</span>
                </a>
              )}

              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 border border-cyber-gray hover:border-cyber-purple/50 hover:bg-cyber-purple/5 transition-all rounded text-cyber-text group">
                  <FaGithub className="text-cyber-purple group-hover:scale-110 transition-transform shrink-0" size={22} />
                  <span className="font-mono text-sm break-all">GitHub Profile</span>
                </a>
              )}

              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 border border-cyber-gray hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all rounded text-cyber-text group">
                  <FaLinkedin className="text-[#0A66C2] group-hover:scale-110 transition-transform shrink-0" size={22} />
                  <span className="font-mono text-sm break-all">LinkedIn Profile</span>
                </a>
              )}

              {profile.phone && (
                <button onClick={handleCopyPhone} className="flex items-center justify-between p-3 border border-cyber-gray hover:border-cyber-neon/50 hover:bg-cyber-neon/5 transition-all rounded text-cyber-text group w-full text-left">
                  <div className="flex items-center gap-4">
                    <Phone className="text-cyber-neon group-hover:scale-110 transition-transform shrink-0" size={22} />
                    <span className="font-mono text-sm">{profile.phone}</span>
                  </div>
                  <span className="text-xs font-mono text-cyber-neon shrink-0 ml-2">{copied ? "✓ Copied" : "Copy"}</span>
                </button>
              )}

              <button
                onClick={() => setShowContactModal(false)}
                className="mt-2 px-4 py-2 bg-cyber-gray/20 hover:bg-cyber-gray/50 text-white/70 hover:text-white font-mono text-sm rounded transition-all border border-transparent hover:border-cyber-gray/40"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
