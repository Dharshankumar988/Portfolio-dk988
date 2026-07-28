"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { eventBus, EventTypes } from "@/lib/eventBus";
import { useIsMobile } from "@/utils/useIsMobile";
import { Home, User, Wrench, FolderGit2, Award, Sparkles } from "lucide-react";

const LINKS = [
  { id: "hero",         label: "home" },
  { id: "about",        label: "about" },
  { id: "skills",       label: "skills" },
  { id: "projects",     label: "projects" },
  { id: "certificates", label: "certs" },
  { id: "extra",        label: "extra" },
];

const MOBILE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  hero: Home,
  about: User,
  skills: Wrench,
  projects: FolderGit2,
  certificates: Award,
  extra: Sparkles,
};

export default function TopNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("hero");
  const isMobile = useIsMobile();

  // Show bar after scrolling past hero
  useEffect(() => {
    const onScroll = () => {
      if (document.body.classList.contains("tutorial-active")) return;
      setVisible(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    
    const forceShow = () => {
      setVisible(true);
    };
    window.addEventListener("force-show-nav", forceShow);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("force-show-nav", forceShow);
    };
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

  useEffect(() => {
    const unsub = eventBus.subscribe(EventTypes.SCROLL_TO_SECTION, ({ section }) => {
      scrollTo(section);
    });
    return () => unsub();
  }, []);

  /* ─── Mobile: fixed bottom glassmorphism dock ─── */
  if (isMobile) {
    return (
      <nav
        id="top-nav"
        className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center justify-around bg-cyber-dark/80 backdrop-blur-xl border-t border-cyber-gray/40 px-1 py-2 shadow-[0_-4px_30px_rgba(0,0,0,0.6)]">
          {LINKS.map(({ id, label }) => {
            const isActive = active === id;
            const Icon = MOBILE_ICONS[id] || Home;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="relative flex flex-col items-center gap-0.5 px-2 py-1 min-w-[48px] min-h-[44px] justify-center transition-colors"
                aria-label={label}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-cyber-neon/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={20}
                  className={`relative z-10 transition-colors duration-200 ${
                    isActive ? "text-cyber-neon drop-shadow-[0_0_6px_rgba(57,255,20,0.8)]" : "text-cyber-text/40"
                  }`}
                />
                <span
                  className={`relative z-10 font-mono text-[9px] tracking-wider uppercase transition-colors duration-200 ${
                    isActive ? "text-cyber-neon" : "text-cyber-text/30"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  /* ─── Desktop: original floating pill nav (unchanged) ─── */
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          id="top-nav"
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
