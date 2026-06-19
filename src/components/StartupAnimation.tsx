"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STARTUP_LINES = [
  "> Welcome to Dharshan's portfolio",
  "[✓] Objectives loaded",
  "[✓] Skills loaded",
  "[✓] Projects loaded",
  "[✓] Certificates loaded",
  "[✓] Network established",
  "> Access granted.",
];

// Total chars across all lines ≈ 190
// At 12ms/tick → ~2280ms typing + 300ms end pause + 400ms fade = ~3s
// Comfortable at 4-4.5s with a small end pause

export default function StartupAnimation() {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("portfolio_startup_done")) {
      setIsDone(true);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;

    const interval = setInterval(() => {
      if (lineIndex < STARTUP_LINES.length) {
        const line = STARTUP_LINES[lineIndex];
        if (charIndex < line.length) {
          setCurrentLineText(line.substring(0, charIndex + 1));
          charIndex++;
        } else {
          setCompletedLines((prev) => [...prev, line]);
          setCurrentLineText("");
          lineIndex++;
          charIndex = 0;
        }
      } else {
        clearInterval(interval);
        // Short pause then fade out
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem("portfolio_startup_done", "true");
          }, 380);
        }, 320);
      }
    }, 13); // 13ms per character — ~4s total for all lines

    return () => clearInterval(interval);
  }, []);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div
          key="startup"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38 }}
          className="fixed inset-0 z-[100] bg-cyber-black flex flex-col justify-center items-center"
        >
          <div className="absolute inset-0 pointer-events-none scanlines" />
          <div className="w-full max-w-2xl px-6">
            <div className="font-mono text-lg text-cyber-neon space-y-2">
              {completedLines.map((line, i) => (
                <div
                  key={i}
                  className={line.startsWith(">") ? "font-bold mt-4" : "opacity-75 ml-4"}
                >
                  {line}
                </div>
              ))}

              {completedLines.length < STARTUP_LINES.length && (
                <div
                  className={
                    STARTUP_LINES[completedLines.length]?.startsWith(">")
                      ? "font-bold mt-4"
                      : "opacity-75 ml-4"
                  }
                >
                  {currentLineText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-2.5 h-[1.1em] bg-cyber-neon ml-1 align-middle"
                  />
                </div>
              )}

              {completedLines.length === STARTUP_LINES.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block w-2.5 h-[1.1em] bg-cyber-neon ml-1 align-middle mt-2"
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
