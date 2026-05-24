"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Download, Mail, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { defaultProfile, getStoredProfile, PORTFOLIO_UPDATE_EVENT, ProfileContent } from "@/lib/portfolioStore";

export default function Hero() {
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);
  const [avatarVisible, setAvatarVisible] = useState(true);
  const [showPhonePopup, setShowPhonePopup] = useState(false);

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
            <h1 className={`${profile.nameFontSize} font-bold tracking-tighter text-white glow-text-cyan`}>
              {profile.name}
            </h1>
            <h2 className={`${profile.taglineFontSize} text-cyber-text/80 font-mono`}>
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

              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 px-6 py-3 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 hover:glow-box-cyan transition-all font-mono text-sm rounded"
                >
                  <Mail size={18} />
                  Contact
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 border border-cyber-cyan/40 text-cyber-cyan/50 font-mono text-sm rounded cursor-not-allowed"
                >
                  <Mail size={18} />
                  Contact
                </button>
              )}

              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 border border-cyber-gray hover:border-cyber-purple hover:text-cyber-purple transition-colors rounded"
                >
                  <FaGithub size={20} />
                </a>
              ) : null}

              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 border border-cyber-gray hover:border-cyber-purple hover:text-cyber-purple transition-colors rounded"
                >
                  <FaLinkedin size={20} />
                </a>
              ) : null}

              {profile.phone ? (
                <button
                  onClick={() => setShowPhonePopup(true)}
                  className="p-3 border border-cyber-gray hover:border-cyber-purple hover:text-cyber-purple transition-colors rounded cursor-pointer"
                  title="View phone number"
                >
                  <Phone size={20} />
                </button>
              ) : null}
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
                className="w-full h-full object-cover"
                onError={() => setAvatarVisible(false)}
              />
            ) : (
              <Terminal size={48} className="text-cyber-neon/50" />
            )}
          </div>
        </motion.div>
      </div>

      {showPhonePopup && (
        <div className="fixed inset-0 bg-cyber-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-cyber-dark border-2 border-cyber-purple p-6 rounded-lg max-w-sm w-full relative shadow-[0_0_25px_rgba(176,38,255,0.25)]"
          >
            <div className="absolute top-0 right-0 p-2 text-xs font-mono opacity-20">SECURE_COMM_V1</div>
            
            <div className="flex items-center gap-3 mb-6">
              <Phone className="text-cyber-purple animate-pulse" size={24} />
              <h3 className="font-mono text-lg font-bold text-white tracking-wider">CONTACT</h3>
            </div>
            
            <div className="bg-cyber-black border border-cyber-gray p-4 rounded text-center mb-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-mono text-xl text-cyber-purple font-bold tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(176,38,255,0.8)] selection:bg-cyber-purple selection:text-cyber-black">
                {profile.phone}
              </span>
            </div>

            {profile.email && (
              <div className="bg-cyber-black border border-cyber-gray p-3 rounded text-center mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-center gap-2 relative z-10 text-cyber-text/80">
                  <Mail size={16} className="text-cyber-cyan" />
                  <span className="font-mono text-sm tracking-wide selection:bg-cyber-cyan selection:text-cyber-black truncate">
                    {profile.email}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(profile.phone || "");
                  alert("Phone number copied to clipboard!");
                }}
                className="flex-1 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple border border-cyber-purple rounded font-mono text-xs transition-all uppercase cursor-pointer"
              >
                COPY NUMBER
              </button>
              <button 
                onClick={() => setShowPhonePopup(false)}
                className="px-4 py-2 bg-cyber-gray hover:bg-cyber-gray/80 text-white rounded font-mono text-xs transition-all cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
