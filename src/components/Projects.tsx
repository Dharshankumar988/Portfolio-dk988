"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, ExternalLink, GitBranch, Circle } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { defaultProjects, getStoredProjects, PORTFOLIO_UPDATE_EVENT, ProjectRecord } from "@/lib/portfolioStore";

// Color per tech tag
const TAG_COLORS: Record<string, string> = {
  python:     "text-[#3572A5] border-[#3572A5]/40 bg-[#3572A5]/10",
  javascript: "text-[#f1e05a] border-[#f1e05a]/40 bg-[#f1e05a]/10",
  typescript: "text-[#3178c6] border-[#3178c6]/40 bg-[#3178c6]/10",
  "next.js":  "text-white border-white/30 bg-white/5",
  nextjs:     "text-white border-white/30 bg-white/5",
  react:      "text-[#61dafb] border-[#61dafb]/40 bg-[#61dafb]/10",
  fastapi:    "text-[#009688] border-[#009688]/40 bg-[#009688]/10",
  postgresql: "text-[#336791] border-[#336791]/40 bg-[#336791]/10",
  solidity:   "text-[#AAA] border-gray-500/40 bg-gray-500/10",
  tailwind:   "text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10",
  blockchain: "text-[#F7931A] border-[#F7931A]/40 bg-[#F7931A]/10",
  ipfs:       "text-[#65C2CB] border-[#65C2CB]/40 bg-[#65C2CB]/10",
};

const getTagColor = (tag: string) => {
  const norm = tag.toLowerCase().trim();
  for (const key in TAG_COLORS) {
    if (norm.includes(key)) return TAG_COLORS[key];
  }
  return "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5";
};

function ProjectCard({ project, idx }: { project: ProjectRecord; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const lineCount = project.description ? Math.max(4, Math.ceil(project.description.length / 60)) : 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-[#080c14] border border-cyber-gray/50 rounded-lg overflow-hidden"
      style={{
        boxShadow: hovered
          ? "0 0 25px rgba(57,255,20,0.08), 0 0 0 1px rgba(57,255,20,0.15)"
          : "none",
        transition: "box-shadow 0.35s ease",
      }}
    >
      {/* Editor top bar */}
      <div className="flex items-center gap-0 bg-[#0d1117] border-b border-cyber-gray/40 rounded-t-lg py-1.5">
        {/* Spacer */}
        <div className="flex-1" />
        {/* Action buttons */}
        <div className="flex items-center gap-3 px-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-cyber-text/60 hover:text-cyber-neon hover:bg-white/5 transition-colors rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-cyber-text/60 hover:text-cyber-cyan hover:bg-white/5 transition-colors rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Code body */}
      <div className="flex">
        {/* Line numbers */}
        <div className="flex flex-col items-end pr-3 pl-4 py-5 border-r border-cyber-gray/20 select-none">
          {Array.from({ length: lineCount + 2 }, (_, i) => (
            <span key={i} className="font-mono text-[10px] text-cyber-text/15 leading-[1.7rem]">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <h3 className="font-mono text-xl font-bold text-[#d2a8ff] group-hover:text-cyber-cyan transition-colors duration-300 tracking-wide">
              {project.title}
            </h3>
          </div>

          {/* Description */}
          {project.description && (
            <div className="font-mono text-[14px] text-gray-300 leading-relaxed pl-4 border-l-2 border-cyber-cyan/50 py-3 bg-[#0d1117]/80 rounded-r shadow-sm">
              <span className="text-cyber-cyan/40 italic mr-2">/*</span>
              {project.description}
              <span className="text-cyber-cyan/40 italic ml-2">*/</span>
            </div>
          )}

          {/* Tech stack as "imports" */}
          {project.tech?.length ? (
            <div className="space-y-1">
              <div className="font-mono text-[10px] text-cyber-text/25">// stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className={`font-mono text-[11px] px-2.5 py-0.5 rounded-md border ${getTagColor(t)} shadow-sm`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Status bar (VS Code style) */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-cyber-gray/15 border-t border-cyber-gray/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyber-text/25 font-mono text-[10px]">
            <GitBranch size={10} />
            <span>main</span>
          </div>
          <span className="text-cyber-text/15 font-mono text-[10px]">Markdown</span>
        </div>
        <span className="font-mono text-[10px] text-cyber-text/20">
          {lineCount + 2} lines
        </span>
      </div>

      {/* Hover scan effect */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ top: "-30%" }}
            animate={{ top: "130%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-0 w-full h-[30%] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(57,255,20,0.03), transparent)",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectRecord[]>(defaultProjects);

  useEffect(() => {
    const handleUpdate = () => setProjects(getStoredProjects());
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
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-cyber-neon glow-text-neon uppercase tracking-widest">Projects_</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} idx={idx} />
          ))}
          {projects.length === 0 && (
            <div className="md:col-span-2 font-mono text-sm text-cyber-text/25 py-8 pl-2">
              <span className="text-cyber-neon/40">$</span> ls ./projects/{" "}
              <span className="text-red-400/50">→ no projects found</span>
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <button
            onClick={() => {
              import("@/lib/eventBus").then(({ eventBus, EventTypes }) => {
                eventBus.dispatch(EventTypes.ASSISTANT_SEND_QUERY, { query: "Tell me more about your projects and the technologies you used." });
              });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan rounded-full transition-all group"
          >
            <span className="font-mono text-sm">Ask Dharshan about his projects</span>
            <div className="w-6 h-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xs">🤖</span>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
