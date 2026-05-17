"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STARTUP_LINES = [
  "> Welcome to Dharshan's portfolio",
  "[✓] Objectives loaded",
  "[✓] Skills loaded",
  "[✓] Projects loaded",
  "[✓] Certificates loaded",
  "[✓] Network established",
  "> Access granted."
];

export default function StartupAnimation() {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if animation has run before in this session to avoid annoyance
    if (sessionStorage.getItem("portfolio_startup_done")) {
      setIsDone(true);
      return;
    }

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    const interval = setInterval(() => {
      if (currentLineIndex < STARTUP_LINES.length) {
        const targetLine = STARTUP_LINES[currentLineIndex];
        
        if (currentCharIndex < targetLine.length) {
          setCurrentLineText(targetLine.substring(0, currentCharIndex + 1));
          currentCharIndex++;
        } else {
          setCompletedLines((prev) => [...prev, targetLine]);
          setCurrentLineText("");
          currentLineIndex++;
          currentCharIndex = 0;
        }
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          sessionStorage.setItem("portfolio_startup_done", "true");
        }, 600);
      }
    }, 40); // Standard speed

    return () => clearInterval(interval);
  }, []);

  if (isDone) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-cyber-black flex flex-col justify-center items-center">
      <div className="absolute inset-0 pointer-events-none scanlines"></div>
      <div className="w-full max-w-2xl px-6">
        <div className="font-mono text-lg text-cyber-neon space-y-2">
          {completedLines.map((line, i) => (
            <div key={i} className={line.startsWith(">") ? "font-bold mt-4" : "opacity-80 ml-4"}>
              {line}
            </div>
          ))}
          {completedLines.length < STARTUP_LINES.length && (
            <div className={STARTUP_LINES[completedLines.length]?.startsWith(">") ? "font-bold mt-4" : "opacity-80 ml-4"}>
              {currentLineText}
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-3 h-5 bg-cyber-neon ml-1 align-middle"
              />
            </div>
          )}
          {completedLines.length === STARTUP_LINES.length && (
            <div className="mt-4">
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-3 h-5 bg-cyber-neon ml-1 align-middle"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
