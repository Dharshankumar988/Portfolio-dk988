"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "extra", label: "Extra" },
  { id: "contact", label: "Contact" },
];

export default function NavDots() {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 items-end">
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <div
            key={id}
            className="relative flex items-center gap-3 cursor-pointer"
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => scrollTo(id)}
          >
            <AnimatePresence>
              {hovered === id && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="font-mono text-xs text-cyber-cyan bg-cyber-dark border border-cyber-cyan/30 px-3 py-1 rounded whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.div
              animate={{
                width: isActive ? 20 : 8,
                height: isActive ? 8 : 8,
              }}
              className={`rounded-full transition-colors duration-300 ${
                isActive
                  ? "bg-cyber-neon shadow-[0_0_8px_rgba(57,255,20,0.8)]"
                  : "bg-cyber-gray hover:bg-cyber-cyan/60"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
