"use client";

import { useEffect, useState, useRef } from "react";
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
    dir: "~/skills/security/",
    color: "text-cyber-neon",
    borderColor: "border-cyber-neon/30",
    glowColor: "rgba(57,255,20,0.15)",
    icon: Lock,
    perm: "drwxr-x---",
    owner: "dharshan",
    group: "cyber",
  },
  {
    key: "Tools",
    dir: "~/skills/tools/",
    color: "text-cyber-cyan",
    borderColor: "border-cyber-cyan/30",
    glowColor: "rgba(0,240,255,0.15)",
    icon: Wrench,
    perm: "drwxr-x---",
    owner: "dharshan",
    group: "ops",
  },
  {
    key: "Programming/Web",
    dir: "~/skills/dev/",
    color: "text-cyber-purple",
    borderColor: "border-cyber-purple/30",
    glowColor: "rgba(176,38,255,0.15)",
    icon: Code,
    perm: "drwxr-x---",
    owner: "dharshan",
    group: "dev",
  },
  {
    key: "Emerging Tech",
    dir: "~/skills/emerging/",
    color: "text-[#ff6b35]",
    borderColor: "border-[#ff6b35]/30",
    glowColor: "rgba(255,107,53,0.15)",
    icon: Cpu,
    perm: "drwxr-x---",
    owner: "dharshan",
    group: "r&d",
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
  if (n.includes("vs code")) return <Terminal className="w-3.5 h-3.5" />;
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

// Fake stable timestamps per skill
const fakeDates = ["Jan 12", "Feb  3", "Mar 17", "Apr  8", "May 22", "Jun  1", "Jul 30", "Aug 14", "Sep  5", "Oct 19", "Nov 11", "Dec 28"];
const fakeSizes = [4096, 2048, 8192, 1024, 16384, 512, 3072, 6144, 2560, 4608];

function getStableVal<T>(arr: T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

type TerminalCardProps = {
  cat: typeof CATEGORIES[number];
  skills: SkillRecord[];
  idx: number;
};

function TerminalCard({ cat, skills, idx }: TerminalCardProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
      className={`bg-[#080c14] border ${cat.borderColor} rounded-lg overflow-hidden`}
      style={{
        boxShadow: `0 0 0 0px ${cat.glowColor}`,
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${cat.glowColor}, inset 0 0 40px ${cat.glowColor.replace("0.15", "0.04")}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0px ${cat.glowColor}`;
      }}
    >
      {/* Terminal title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cyber-gray/30 border-b border-cyber-gray/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="font-mono text-xs text-cyber-text/30 ml-2">{cat.dir}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`font-mono text-[10px] ${cat.color} opacity-50 hover:opacity-100 transition-opacity`}
        >
          {expanded ? "[-]" : "[+]"}
        </button>
      </div>

      {/* ls -la header line */}
      <div className="px-4 py-2.5 border-b border-cyber-gray/20">
        <div className="flex items-center gap-2 font-mono text-xs text-cyber-text/40">
          <span className={cat.color}>$</span>
          <span>ls -la</span>
          <span className={`${cat.color} opacity-60`}>{cat.dir}</span>
        </div>
        <div className="font-mono text-[10px] text-cyber-text/25 mt-1.5">
          total {skills.length * 4 + 8} · {skills.length} items
        </div>
      </div>

      {/* File rows */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 space-y-1.5">
              {skills.length === 0 ? (
                <div className="font-mono text-xs text-cyber-text/20 italic py-2">
                  — no entries —
                </div>
              ) : (
                skills.map((skill) => {
                  const date = getStableVal(fakeDates, skill.name);
                  const size = getStableVal(fakeSizes, skill.id);
                  const isHov = hovered === skill.id;
                  return (
                    <motion.div
                      key={skill.id}
                      onMouseEnter={() => setHovered(skill.id)}
                      onMouseLeave={() => setHovered(null)}
                      animate={{ backgroundColor: isHov ? "rgba(255,255,255,0.03)" : "transparent" }}
                      className="flex items-center gap-3 font-mono text-xs rounded px-2 py-1 cursor-default group"
                    >
                      {/* Permissions */}
                      <span className="text-cyber-text/20 hidden sm:block shrink-0 tracking-tight">
                        -rwxr-x---
                      </span>
                      {/* Size */}
                      <span className="text-cyber-text/25 w-8 text-right shrink-0 hidden md:block">
                        {size}
                      </span>
                      {/* Date */}
                      <span className="text-cyber-text/25 w-10 shrink-0 hidden lg:block">
                        {date}
                      </span>
                      {/* Icon + Name */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`${cat.color} opacity-60 group-hover:opacity-100 transition-opacity shrink-0 flex items-center`}>
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
                        <span
                          className={`${cat.color} transition-all duration-150 truncate ${
                            isHov ? "opacity-100" : "opacity-70"
                          }`}
                        >
                          {skill.name.toLowerCase().replace(/\s+/g, "_")}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category footer */}
      <div className={`px-4 py-2 border-t border-cyber-gray/20 flex items-center gap-2`}>
        <Icon size={12} className={`${cat.color} opacity-50`} />
        <span className={`font-mono text-[10px] ${cat.color} opacity-40 tracking-widest uppercase`}>
          {cat.key}
        </span>
        {skills.length > 0 && (
          <span className="ml-auto font-mono text-[10px] text-cyber-text/20">
            {skills.length} file{skills.length !== 1 ? "s" : ""}
          </span>
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
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-cyber-neon/50 text-sm">01</span>
            <div className="h-px w-8 bg-cyber-neon/30" />
            <span className="font-mono text-xs text-cyber-text/30 tracking-widest">CAPABILITIES</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight">
            Skills<span className="text-cyber-neon">_</span>
          </h2>
          <p className="font-mono text-xs text-cyber-text/30 mt-2">
            <span className="text-cyber-cyan/50">$</span> ls -la ~/skills/ <span className="text-cyber-text/20">—— {storedSkills.items.length} total</span>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => {
            const catSkills = storedSkills.items.filter(
              (s) => s.category.toLowerCase() === cat.key.toLowerCase()
            );
            return <TerminalCard key={cat.key} cat={cat} skills={catSkills} idx={idx} />;
          })}
        </div>
      </div>
    </section>
  );
}
