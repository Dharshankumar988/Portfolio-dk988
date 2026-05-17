"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderGit2, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { defaultProjects, getStoredProjects, PORTFOLIO_UPDATE_EVENT, ProjectRecord } from "@/lib/portfolioStore";

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
    <section className="relative py-24 px-6 md:px-24 z-10 bg-cyber-black/50">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2 flex items-center gap-4">
            Projects_Vault
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyber-cyan to-transparent"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group relative bg-cyber-dark border border-cyber-gray p-6 rounded-lg hover:border-cyber-neon transition-all"
            >
              {(project.githubUrl || project.liveUrl) && (
                <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyber-text hover:text-cyber-neon"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyber-text hover:text-cyber-neon"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <FolderGit2 className="text-cyber-neon" size={28} />
                <h3 className="text-2xl font-bold text-white font-mono">{project.title}</h3>
              </div>
              
              <p className="text-cyber-text/80 mb-6 min-h-[48px]">
                {project.description || ""}
              </p>
              
              {project.tech?.length ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t, i) => (
                    <span key={i} className="text-xs font-mono px-2 py-1 bg-cyber-gray text-cyber-cyan rounded">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
