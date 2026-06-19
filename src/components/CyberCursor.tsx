"use client";

import { useEffect, useRef, useState } from "react";

export default function CyberCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const target = e.target as Element;
      setHovering(target.closest("a, button, [role='button'], input, textarea, label") !== null);
    };

    window.addEventListener("mousemove", onMove);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Dot — 4px, snaps instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{ marginLeft: "-3px", marginTop: "-3px" }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-100 ${
            hovering ? "bg-cyber-cyan shadow-[0_0_4px_rgba(0,240,255,1)]" : "bg-cyber-neon shadow-[0_0_4px_rgba(57,255,20,0.9)]"
          }`}
        />
      </div>

      {/* Ring — 20px, lags behind */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform"
        style={{ marginLeft: "-14px", marginTop: "-14px" }}
      >
        <div
          className={`w-7 h-7 rounded-full border transition-colors duration-200 ${
            hovering ? "border-cyber-cyan/50" : "border-cyber-neon/25"
          }`}
        />
      </div>
    </>
  );
}
