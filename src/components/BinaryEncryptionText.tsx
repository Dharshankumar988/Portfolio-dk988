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

  // Scroll tracking: trigger exactly when the subtitle nears the top edge.
  // "start 25%" = When the top of the element is 25% from the top of the viewport.
  // "start -10%" = When the top of the element goes slightly past the top edge.
  // This gives the animation enough distance to fully play out before leaving screen.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 25%", "start -10%"],
  });

  // Calculate random target indices based on text length to animate 1-2 characters
  const activeIndices = useMemo(() => {
    if (!text) return [];
    const validIndices: number[] = [];
    const words = text.split(" ");
    let currentIdx = 0;
    
    // Constraints:
    // - Never first character of any word.
    // - Max 1 character per word.
    // - Total 1-2 characters max.
    // - Never consecutive letters (inherent by max 1 per word).
    
    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      // Pick a valid character in the word if it's long enough
      if (word.length > 2) { 
        const charIdxInWord = 1 + Math.floor(Math.random() * (word.length - 1));
        validIndices.push(currentIdx + charIdxInWord);
      } else if (word.length === 2) {
        validIndices.push(currentIdx + 1);
      }
      currentIdx += word.length + 1; // +1 for the space
    }
    
    // If no valid indices were found due to very short text, just pick the last character of the first word
    if (validIndices.length === 0 && text.length > 0) {
      validIndices.push(text.length - 1);
    }

    // Pick 1 or 2 random indices from valid ones
    const numToPick = Math.random() > 0.3 && validIndices.length > 1 ? 2 : 1;
    const shuffled = validIndices.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numToPick);
  }, [text]);

  if (!text) return null;
  if (prefersReducedMotion) {
    return <span className={className} style={style}>{text}</span>;
  }

  return (
    <span ref={containerRef} className={className} style={style}>
      {text.split("").map((char, globalIndex) => {
        const isActive = activeIndices.includes(globalIndex);
        
        // Render spaces normally to preserve word-breaking
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
  
  // Movement parameters mapped to requirements
  // "Very slight random horizontal drift" -> -4px to 4px
  const xOffset = useRef((Math.random() - 0.5) * 8).current; 
  // "Travel distance: 10-20px upward" -> -10px to -20px
  const yOffset = useRef(-10 - Math.random() * 10).current; 

  // Opacity phases mapped to scroll progression
  // 0% - 90%: unchanged. (Maps to 0-0.2 in our 15vh window)
  
  // 92% (progress 0.2): Original fades out, replacement fades in.
  const originalOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.7, 1], [1, 0, 0, 1, 1]);
  const replacementOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.7, 1], [0, 1, 1, 0, 0]);

  // 97% (progress 0.5-0.7): Particle detaches (fades in)
  // Max opacity 0.10 - 0.22 as requested. We use 0.18
  const particleOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.9, 1], [0, 0.18, 0.18, 0]);
  
  // 99% (progress 0.5-1.0): Drifting up and slightly horizontally
  const particleY = useTransform(scrollYProgress, [0.5, 1], [0, yOffset]);
  const particleX = useTransform(scrollYProgress, [0.5, 1], [0, xOffset]);

  // 100% (progress 0.9-1.0): Absorbed (subtle flare).
  // Flare opacity peaks very low to simulate 5% brightening
  const flareOpacity = useTransform(scrollYProgress, [0.9, 0.95, 0.98, 1], [0, 0, 0.15, 0]);

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
          fontSize: "0.25em", // approx 3-5px
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        {binaryVal}
      </motion.span>
      
      {/* Tiny Flare (Simulated Background Particle) */}
      <motion.div
        style={{
          opacity: flareOpacity,
          y: yOffset,
          x: xOffset,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-white rounded-full pointer-events-none"
      />
    </span>
  );
}
