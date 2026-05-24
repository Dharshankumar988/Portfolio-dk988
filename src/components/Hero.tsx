"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Download, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { defaultProfile, getStoredProfile, PORTFOLIO_UPDATE_EVENT, ProfileContent } from "@/lib/portfolioStore";

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

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-24 z-10">
      <div className="w-full max-w-4xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          
          <div className="font-mono text-sm md:text-base text-cyber-neon h-8 flex items-center">
            <span className="text-cyber-cyan mr-2">{'>'}</span>
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-3 h-5 bg-cyber-neon align-middle"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-sm md:text-base font-mono text-cyber-text/70 tracking-widest">
              {profile.greeting}
            </p>
            <h1 
              className="font-bold tracking-tighter text-white glow-text-cyan"
              style={{ fontSize: `${(profile.nameFontSize || 5) * 0.5 + 1}rem`, lineHeight: 1.1 }}
            >
              {profile.name}
            </h1>
            <h2 
              className="text-cyber-text/80 font-mono"
              style={{ fontSize: `${(profile.taglineFontSize || 3) * 0.2 + 0.8}rem`, lineHeight: 1.2 }}
            >
              {profile.tagline}
            </h2>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-cyber-neon/10 border border-cyber-neon text-cyber-neon hover:bg-cyber-neon/20 hover:glow-box-neon transition-all font-mono text-sm rounded"
                >
                  <Download size={18} />
                  Download Resume
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 bg-cyber-neon/5 border border-cyber-neon/40 text-cyber-neon/50 font-mono text-sm rounded cursor-not-allowed"
                >
                  <Download size={18} />
                  Download Resume
                </button>
              )}

              {profile.email || profile.githubUrl || profile.linkedinUrl || profile.phone ? (
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex items-center gap-2 px-6 py-3 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:glow-box-cyan transition-all font-mono text-sm rounded"
                >
                  <Mail size={18} />
                  Contact
                </button>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 border border-cyber-cyan/40 text-cyber-cyan/50 font-mono text-sm rounded cursor-not-allowed"
                >
                  <Mail size={18} />
                  Contact
                </button>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-56 h-56 md:w-80 md:h-80 relative group"
        >
          <div className="absolute inset-0 bg-cyber-neon rounded-full opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-500" />
          <div className="absolute inset-2 border-2 border-cyber-neon/50 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border border-cyber-cyan/50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-8 bg-cyber-gray rounded-full overflow-hidden border border-cyber-gray z-10 flex items-center justify-center">
            {profile.avatarUrl && avatarVisible ? (
              <img
                src={profile.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover rounded-full aspect-square"
                onError={() => setAvatarVisible(false)}
              />
            ) : (
              <Terminal size={48} className="text-cyber-neon/50" />
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-cyber-dark border border-cyber-cyan p-8 rounded-lg max-w-sm w-full shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col gap-4 relative"
            >
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 text-cyber-gray hover:text-white transition-colors"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold font-mono text-cyber-cyan mb-2 border-b border-cyber-gray/50 pb-4">Contact Link</h3>
              
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-3 border border-cyber-gray hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all rounded text-cyber-text group">
                  <Mail className="text-cyber-cyan group-hover:scale-110 transition-transform shrink-0" size={24} />
                  <span className="font-mono text-sm break-all">{profile.email}</span>
                </a>
              )}

              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 border border-cyber-gray hover:border-cyber-purple/50 hover:bg-cyber-purple/5 transition-all rounded text-cyber-text group">
                  <FaGithub className="text-cyber-purple group-hover:scale-110 transition-transform shrink-0" size={24} />
                  <span className="font-mono text-sm break-all">GitHub Profile</span>
                </a>
              )}

              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 border border-cyber-gray hover:border-cyber-blue/50 hover:bg-[#0A66C2]/10 transition-all rounded text-cyber-text group">
                  <FaLinkedin className="text-[#0A66C2] group-hover:scale-110 transition-transform shrink-0" size={24} />
                  <span className="font-mono text-sm break-all">LinkedIn Profile</span>
                </a>
              )}

              {profile.phone && (
                <button onClick={handleCopyPhone} className="flex items-center justify-between p-3 border border-cyber-gray hover:border-cyber-neon/50 hover:bg-cyber-neon/5 transition-all rounded text-cyber-text group w-full text-left">
                  <div className="flex items-center gap-4">
                    <Phone className="text-cyber-neon group-hover:scale-110 transition-transform shrink-0" size={24} />
                    <span className="font-mono text-sm">{profile.phone}</span>
                  </div>
                  <span className="text-xs font-mono text-cyber-neon shrink-0 ml-2">{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}

              <button 
                onClick={() => setShowContactModal(false)}
                className="mt-4 px-4 py-2 bg-cyber-gray/20 hover:bg-cyber-gray/40 text-white font-mono text-sm rounded transition-colors"
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
