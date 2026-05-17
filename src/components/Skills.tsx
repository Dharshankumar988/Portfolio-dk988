"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Wrench, Code, Cpu, Shield, Bug, Terminal } from "lucide-react";
import { 
  FaPython, FaJs, FaNetworkWired, 
  FaDatabase, FaFigma, FaGithub, FaRobot, FaShieldAlt
} from "react-icons/fa";
import { 
  SiWireshark, SiPostgresql, SiNextdotjs, SiFastapi, 
  SiIpfs, SiGnuprivacyguard, SiSolidity, SiTailwindcss, SiPolygon
} from "react-icons/si";
import { getStoredSkills, PORTFOLIO_UPDATE_EVENT, SkillRecord } from "@/lib/portfolioStore";

const categories = [
  {
    title: "Security concepts",
    icon: <Lock className="text-cyber-neon" />,
    key: "Security concepts",
  },
  {
    title: "Tools",
    icon: <Wrench className="text-cyber-cyan" />,
    key: "Tools",
  },
  {
    title: "Programming/Web",
    icon: <Code className="text-cyber-purple" />,
    key: "Programming/Web",
  },
  {
    title: "Emerging Tech",
    icon: <Cpu className="text-[#ff3366]" />,
    key: "Emerging Tech",
  },
];

const getSkillIcon = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes("information security")) return <Lock className="w-4 h-4" />;
  if (norm.includes("cryptography")) return <SiGnuprivacyguard className="w-4 h-4" />;
  if (norm.includes("network fundamentals") || norm.includes("networking")) return <FaNetworkWired className="w-4 h-4" />;
  if (norm.includes("abuseipdb")) return <FaShieldAlt className="w-4 h-4" />;
  if (norm.includes("alienvault")) return <Shield className="w-4 h-4" />;
  if (norm.includes("virustotal")) return <Bug className="w-4 h-4" />;
  if (norm.includes("wireshark")) return <SiWireshark className="w-4 h-4" />;
  if (norm.includes("nmap")) return <Terminal className="w-4 h-4" />;
  if (norm.includes("git")) return <FaGithub className="w-4 h-4" />;
  if (norm.includes("vs code")) return <Terminal className="w-4 h-4" />;
  if (norm.includes("figma")) return <FaFigma className="w-4 h-4" />;
  if (norm.includes("python")) return <FaPython className="w-4 h-4" />;
  if (norm.includes("c")) return <Code className="w-4 h-4" />;
  if (norm.includes("javascript")) return <FaJs className="w-4 h-4" />;
  if (norm.includes("fastapi")) return <SiFastapi className="w-4 h-4" />;
  if (norm.includes("next.js") || norm.includes("nextjs")) return <SiNextdotjs className="w-4 h-4" />;
  if (norm.includes("sql")) return <FaDatabase className="w-4 h-4" />;
  if (norm.includes("postgresql")) return <SiPostgresql className="w-4 h-4" />;
  if (norm.includes("tailwind")) return <SiTailwindcss className="w-4 h-4" />;
  if (norm.includes("blockchain") || norm.includes("polygon")) return <SiPolygon className="w-4 h-4" />;
  if (norm.includes("smart contracts") || norm.includes("solidity")) return <SiSolidity className="w-4 h-4" />;
  if (norm.includes("ipfs")) return <SiIpfs className="w-4 h-4" />;
  if (norm.includes("generative ai")) return <FaRobot className="w-4 h-4" />;
  if (norm.includes("ai agents")) return <Cpu className="w-4 h-4" />;
  return <Code className="w-4 h-4" />;
};

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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2 flex items-center gap-4">
            Skills_Dashboard
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyber-neon to-transparent"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const catSkills = storedSkills.items.filter(
              (skill) => skill.category.toLowerCase() === cat.key.toLowerCase()
            );

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-cyber-dark border border-cyber-gray p-6 rounded-lg hover:border-cyber-cyan transition-colors group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyber-cyan/10 to-transparent -mr-8 -mt-8 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
                <div className="mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4 font-mono">{cat.title}</h3>
                
                <ul className="space-y-3 flex-1">
                  {catSkills.map((skill, i) => (
                    <li key={i} className="flex items-center gap-3 text-cyber-text/80 text-sm group/item">
                      <span className="text-cyber-cyan group-hover/item:text-cyber-neon transition-colors flex items-center justify-center">
                        {skill.logoUrl ? (
                          <img 
                            src={skill.logoUrl} 
                            alt={skill.name} 
                            className="w-4 h-4 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              // If image fails, fallback to React Icon:
                              const fallbackIcon = document.createElement('span');
                              fallbackIcon.innerHTML = '💻';
                              e.currentTarget.parentNode?.appendChild(fallbackIcon);
                            }}
                          />
                        ) : (
                          getSkillIcon(skill.name)
                        )}
                      </span>
                      <span className="group-hover/item:text-white transition-colors">{skill.name}</span>
                    </li>
                  ))}
                  {catSkills.length === 0 && (
                    <li className="text-cyber-text/30 text-xs font-mono italic">No skills added</li>
                  )}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
