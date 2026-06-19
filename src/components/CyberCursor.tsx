"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Hide default cursor globally
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as Element;
      const isClickable =
        target.closest("a, button, [role='button'], input, textarea, select, label") !== null;
      setHovering(isClickable);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      // ring follows with lag
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Small dot — snaps instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ marginLeft: "-4px", marginTop: "-4px" }}
      >
        <div
          className={`w-2 h-2 rounded-full transition-all duration-100 ${
            hovering
              ? "bg-cyber-cyan scale-150 shadow-[0_0_8px_rgba(0,240,255,1)]"
              : clicking
              ? "bg-white scale-75"
              : "bg-cyber-neon shadow-[0_0_6px_rgba(57,255,20,0.8)]"
          }`}
        />
      </div>

      {/* Lagging ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform"
        style={{ marginLeft: "-18px", marginTop: "-18px" }}
      >
        <div
          className={`w-9 h-9 rounded-full border transition-all duration-150 ${
            hovering
              ? "border-cyber-cyan/60 scale-150"
              : clicking
              ? "border-white/40 scale-75"
              : "border-cyber-neon/30"
          }`}
          style={{
            boxShadow: hovering
              ? "0 0 12px rgba(0,240,255,0.2)"
              : "0 0 8px rgba(57,255,20,0.1)",
          }}
        >
          {/* Crosshair lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-current opacity-20 -translate-y-px" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-current opacity-20 -translate-x-px" />
        </div>
      </div>
    </>
  );
}
