"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SPACE_IMAGES = [
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000&auto=format&fit=crop",
];

export default function SpaceBackground() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * SPACE_IMAGES.length);
    setCurrentIndex(startIdx);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev !== null ? (prev + 1) % SPACE_IMAGES.length : startIdx));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02050a]">
      {/* Strong CSS Fallback in case images fail or load slowly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(60,20,100,0.4)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(10,50,90,0.5)_0%,transparent_60%)]" />

      {SPACE_IMAGES.map((src, i) => {
        if (failedImages.has(i)) return null;

        return (
          <motion.div
            key={src}
            initial={false}
            animate={{
              opacity: i === currentIndex ? 0.25 : 0, // Very subtle
              scale: i === currentIndex ? 1 : 1.05,
            }}
            transition={{ duration: 6, ease: "easeInOut" }}
            className="absolute inset-0 mix-blend-screen"
          >
            <img 
              src={src}
              alt="Deep Space"
              className="w-full h-full object-cover animate-[panSpace_60s_linear_infinite]"
              onError={() => setFailedImages((prev) => new Set(prev).add(i))}
            />
          </motion.div>
        );
      })}
      
      {/* Dark gradient overlay to ensure text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/40 to-cyber-black/80" />
    </div>
  );
}
