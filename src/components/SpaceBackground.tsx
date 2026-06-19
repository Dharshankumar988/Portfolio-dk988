"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SpaceBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#02050a]">
      {/* Strong CSS Fallback in case images fail or load slowly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,40,200,0.4)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(40,100,200,0.5)_0%,transparent_60%)]" />

      {isClient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 mix-blend-screen"
        >
          <img 
            src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=2560&auto=format&fit=crop"
            alt="Deep Space"
            className="w-full h-full object-cover animate-[panSpace_60s_linear_infinite]"
          />
        </motion.div>
      )}
      
      {/* Dark gradient overlay to ensure text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/40 to-cyber-black/80" />
    </div>
  );
}
