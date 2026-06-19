"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Wrench, Code, Cpu, Shield, Bug, Terminal } from "lucide-react";
import {
  FaPython, FaJs, FaNetworkWired,
  FaDatabase, FaFigma, FaGithub, FaRobot, FaShieldAlt,
} from "react-icons/fa";
import {
  SiWireshark, SiPostgresql, SiNextdotjs, SiFastapi,
  SiIpfs, SiGnuprivacyguard, SiSolidity, SiTailwindcss, SiPolygon,
} from "react-icons/si";
import { getStoredSkills, PORTFOLIO_UPDATE_EVENT, SkillRecord } from "@/lib/portfolioStore";

const CATEGORIES = [
  {
    key: "Security concepts",
    label: "Security",
    color: "text-cyber-neon",
    accent: "border-cyber-neon/20",
    dot: "bg-cyber-neon",
    icon: Lock,
  },
  {
    key: "Tools",
    label: "Tools",
    color: "text-cyber-cyan",
    accent: "border-cyber-cyan/20",
    dot: "bg-cyber-cyan",
    icon: Wrench,
  },
  {
    key: "Programming/Web",
    label: "Dev",
    color: "text-cyber-purple",
    accent: "border-cyber-purple/20",
    dot: "bg-cyber-purple",
    icon: Code,
  },
  {
    key: "Emerging Tech",
    label: "Emerging",
    color: "text-[#ff6b35]",
    accent: "border-[#ff6b35]/20",
    dot: "bg-[#ff6b35]",
    icon: Cpu,
  },
];

const getSkillIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("information security")) return <Lock className="w-3.5 h-3.5" />;
  if (n.includes("cryptography")) return <SiGnuprivacyguard className="w-3.5 h-3.5" />;
  if (n.includes("network")) return <FaNetworkWired className="w-3.5 h-3.5" />;
  if (n.includes("abuseipdb")) return <FaShieldAlt className="w-3.5 h-3.5" />;
  if (n.includes("alienvault")) return <Shield className="w-3.5 h-3.5" />;
  if (n.includes("virustotal")) return <Bug className="w-3.5 h-3.5" />;
  if (n.includes("wireshark")) return <SiWireshark className="w-3.5 h-3.5" />;
  if (n.includes("nmap")) return <Terminal className="w-3.5 h-3.5" />;
  if (n.includes("git")) return <FaGithub className="w-3.5 h-3.5" />;
  if (n.includes("figma")) return <FaFigma className="w-3.5 h-3.5" />;
  if (n.includes("python")) return <FaPython className="w-3.5 h-3.5" />;
  if (n.includes("javascript")) return <FaJs className="w-3.5 h-3.5" />;
  if (n.includes("fastapi")) return <SiFastapi className="w-3.5 h-3.5" />;
  if (n.includes("next")) return <SiNextdotjs className="w-3.5 h-3.5" />;
  if (n.includes("postgresql")) return <SiPostgresql className="w-3.5 h-3.5" />;
  if (n.includes("sql")) return <FaDatabase className="w-3.5 h-3.5" />;
  if (n.includes("tailwind")) return <SiTailwindcss className="w-3.5 h-3.5" />;
  if (n.includes("blockchain") || n.includes("polygon")) return <SiPolygon className="w-3.5 h-3.5" />;
  if (n.includes("solidity") || n.includes("smart")) return <SiSolidity className="w-3.5 h-3.5" />;
  if (n.includes("ipfs")) return <SiIpfs className="w-3.5 h-3.5" />;
  if (n.includes("generative ai")) return <FaRobot className="w-3.5 h-3.5" />;
  if (n.includes("ai agents")) return <Cpu className="w-3.5 h-3.5" />;
  return <Code className="w-3.5 h-3.5" />;
};

function CategoryPanel({
  cat,
  skills,
  idx,
}: {
  cat: typeof CATEGORIES[number];
  skills: SkillRecord[];
  idx: number;
}) {
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.45 }}
      className={`bg-[#080c14] border ${cat.accent} rounded-xl overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-cyber-gray/20">
        <Icon size={15} className={cat.color} />
        <span className={`font-mono text-sm font-semibold ${cat.color}`}>{cat.label}</span>
        <span className="ml-auto font-mono text-xs text-cyber-text/25">{skills.length}</span>
      </div>

      {/* Skills list */}
      <div className="px-5 py-4 flex-1">
        {skills.length === 0 ? (
          <p className="text-cyber-text/20 text-xs italic font-mono py-2">No skills added yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {skills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-3 group">
                <span className={`${cat.color} opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0`}>
                  {skill.logoUrl ? (
                    <img
                      src={skill.logoUrl}
                      alt={skill.name}
                      className="w-3.5 h-3.5 object-contain"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    getSkillIcon(skill.name)
                  )}
                </span>
                <span className="text-cyber-text/65 text-sm group-hover:text-cyber-text/90 transition-colors">
                  {skill.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [storedSkills, setStoredSkills] = useState<{ items: SkillRecord[]; hasStored: boolean }>({
    items: [],
    hasStored: false,
  });

  useEffect(() => {
    const handleUpdate = () => setStoredSkills(getStoredSkills());
    handleUpdate();
    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-24 z-10">
      <div className="w-full max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-cyber-neon glow-text-neon uppercase tracking-widest">Skills_</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => {
            const catSkills = storedSkills.items.filter(
              (s) => s.category.toLowerCase() === cat.key.toLowerCase()
            );
            return <CategoryPanel key={cat.key} cat={cat} skills={catSkills} idx={idx} />;
          })}
        </div>
      </div>
    </section>
  );
}
