"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Cpu, Database } from "lucide-react";
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

  return (
    <section className="relative min-h-screen py-24 px-6 md:px-24 z-10 flex items-center">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Holographic Card Effect */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyber-neon to-cyber-cyan rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-cyber-dark border border-cyber-gray p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-6">
                <User className="text-cyber-neon" size={32} />
                <h2 className="text-3xl font-bold text-white tracking-wider font-mono">
                  Professional Profile
                </h2>
              </div>
              <p className="text-cyber-text/80 leading-relaxed font-sans text-lg">
                {profile.bio}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 p-3 bg-cyber-black/50 border border-cyber-gray rounded">
                  <Shield className="text-cyber-cyan" size={24} />
                  <span className="font-mono text-sm text-cyber-text">Security</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cyber-black/50 border border-cyber-gray rounded">
                  <Cpu className="text-cyber-neon" size={24} />
                  <span className="font-mono text-sm text-cyber-text">AI Systems</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cyber-black/50 border border-cyber-gray rounded">
                  <Database className="text-cyber-purple" size={24} />
                  <span className="font-mono text-sm text-cyber-text">Cloud Technologies</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-cyber-black/50 border border-cyber-gray rounded">
                  <div className="text-cyber-cyan font-bold font-mono">{'{}'}</div>
                  <span className="font-mono text-sm text-cyber-text">Development</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="border-l-2 border-cyber-gray pl-6 relative">
              <div className="absolute w-3 h-3 bg-cyber-neon rounded-full -left-[7px] top-2" />
              <h3 className="text-xl font-bold text-white mb-2 font-mono">Career Goals</h3>
              <p className="text-cyber-text/70 text-sm">
                To build highly resilient, intelligent systems that leverage AI and Blockchain to solve complex security challenges in enterprise and healthcare environments.
              </p>
            </div>
            
            <div className="border-l-2 border-cyber-gray pl-6 relative">
              <div className="absolute w-3 h-3 bg-cyber-cyan rounded-full -left-[7px] top-2" />
              <h3 className="text-xl font-bold text-white mb-2 font-mono">Education</h3>
              <p className="text-cyber-text/70 text-sm">
                B.E. Computer Science and Engineering<br/>
                Focus: Cybersecurity, Network Infrastructure, Machine Learning.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
