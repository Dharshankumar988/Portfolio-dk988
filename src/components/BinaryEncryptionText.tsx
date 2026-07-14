"use client";

import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface Props {
  text: string | undefined;
  className?: string;
  style?: React.CSSProperties;
}

const getRandomBinary = () => (Math.random() > 0.5 ? "1" : "0");

export default function BinaryEncryptionText({ text, className, style }: Props) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll tracking: trigger during the last ~10% of Hero visibility.
  // When the text container's top reaches 15% from the top of the viewport, 
  // it animates until it reaches 0% (top of viewport).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "start 0%"],
  });

  // Calculate exactly ONE random target character from the text
  const activeIndices = useMemo(() => {
    if (!text) return [];
    const validIndices: number[] = [];
    
    // Collect all indices that are not spaces
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " ") {
        validIndices.push(i);
      }
    }
    
    if (validIndices.length === 0) return [];

    // Pick exactly one index
    const randomIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    return [randomIndex];
  }, [text]);

  if (!text) return null;
  if (prefersReducedMotion) {
    return <span className={className} style={style}>{text}</span>;
  }

  return (
    <span ref={containerRef} className={className} style={style}>
      {text.split("").map((char, globalIndex) => {
        const isActive = activeIndices.includes(globalIndex);
        
        if (char === " ") {
          return <span key={globalIndex}> </span>;
        }

        return (
          <BinaryChar
            key={globalIndex}
            char={char}
            isActive={isActive}
            scrollYProgress={scrollYProgress}
          />
        );
      })}
    </span>
  );
}

function BinaryChar({
  char,
  isActive,
  scrollYProgress,
}: {
  char: string;
  isActive: boolean;
  scrollYProgress: any;
}) {
  const binaryVal = useRef(getRandomBinary()).current;
  
  // Tiny horizontal drift: -2px to +2px
  const xOffset = useRef((Math.random() - 0.5) * 4).current; 
  // Gentle upward drift: -10px to -20px
  const yOffset = useRef(-10 - Math.random() * 10).current; 

  // 0.0 - 0.4: Original character fades out, replacement fades in
  const originalOpacity = useTransform(scrollYProgress, [0, 0.4, 0.45, 1], [1, 0, 1, 1]);
  const replacementOpacity = useTransform(scrollYProgress, [0, 0.4, 0.45, 1], [0, 1, 0, 0]);

  // 0.45 - 1.0: Detached particle fades in, drifts up, then fades out
  // Max opacity: 0.12 - 0.20
  const maxParticleOpacity = useRef(0.12 + Math.random() * 0.08).current;
  const particleOpacity = useTransform(scrollYProgress, [0.45, 0.5, 0.8, 1], [0, maxParticleOpacity, maxParticleOpacity, 0]);
  
  const particleY = useTransform(scrollYProgress, [0.45, 1], [0, yOffset]);
  const particleX = useTransform(scrollYProgress, [0.45, 1], [0, xOffset]);

  // 0.9 - 1.0: Tiny white flare simulating existing particle brightness increase
  const flareOpacity = useTransform(scrollYProgress, [0.9, 0.95, 1], [0, 0.5, 0]);

  if (!isActive) {
    return <span className="inline-block">{char}</span>;
  }

  return (
    <span className="relative inline-block">
      {/* Original Character */}
      <motion.span style={{ opacity: originalOpacity }} className="inline-block">
        {char}
      </motion.span>

      {/* Binary Replacement (in place) */}
      <motion.span
        style={{ opacity: replacementOpacity }}
        className="absolute left-0 top-0 pointer-events-none"
      >
        {binaryVal}
      </motion.span>

      {/* Detached Floating Particle */}
      <motion.span
        style={{
          opacity: particleOpacity,
          y: particleY,
          x: particleX,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-[clamp(2.5px,0.5vw,5px)] leading-none drop-shadow-none"
      >
        {binaryVal}
      </motion.span>
      
      {/* Tiny Flare (Simulated Background Particle - white, unstyled) */}
      <motion.div
        style={{
          opacity: flareOpacity,
          y: yOffset,
          x: xOffset,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white rounded-full pointer-events-none shadow-none"
      />
    </span>
  );
}
