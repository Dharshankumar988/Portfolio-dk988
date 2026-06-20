"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { id: "hero",         label: "home" },
  { id: "about",        label: "about" },
  { id: "skills",       label: "skills" },
  { id: "projects",     label: "projects" },
  { id: "certificates", label: "certs" },
  { id: "extra",        label: "extra" },
];

export default function TopNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("hero");

  // Show bar after scrolling past hero
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.35 }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div className="flex items-center gap-1 bg-cyber-dark/80 backdrop-blur-md border border-cyber-gray/60 rounded-full px-3 py-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-[90vw] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Live dot */}
            <div className="flex items-center pr-3 border-r border-cyber-gray/40 mr-1 shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neon opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-neon" />
              </span>
            </div>

            {LINKS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`relative px-3 py-1 font-mono text-xs tracking-wide rounded-full transition-all duration-200 shrink-0 ${
                    isActive
                      ? "text-black"
                      : "text-cyber-text/50 hover:text-cyber-text"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-cyber-neon rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
