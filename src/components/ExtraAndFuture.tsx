"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, GraduationCap } from "lucide-react";
import {
  defaultExtracurriculars,
  defaultInterests,
  ExtracurricularRecord,
  getStoredExtracurriculars,
  getStoredInterests,
  InterestRecord,
  PORTFOLIO_UPDATE_EVENT,
} from "@/lib/portfolioStore";

export default function ExtraAndFuture() {
  const [extracurriculars, setExtracurriculars] = useState<ExtracurricularRecord[]>(defaultExtracurriculars);
  const [futureInterests, setFutureInterests] = useState<InterestRecord[]>(defaultInterests);

  useEffect(() => {
    const handleUpdate = () => {
      setExtracurriculars(getStoredExtracurriculars());
      setFutureInterests(getStoredInterests());
    };
    handleUpdate();
    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <section className="relative py-24 px-6 md:px-24 z-10 bg-cyber-black/50">
      <div className="w-full max-w-6xl mx-auto">
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Extracurriculars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cyber-dark border border-cyber-gray p-8 rounded-lg relative overflow-hidden group hover:border-cyber-cyan transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <GraduationCap className="text-cyber-cyan" size={32} />
              <h2 className="text-2xl font-bold font-mono text-white">Extracurriculars</h2>
            </div>
            
            <ul className="space-y-4">
              {extracurriculars.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 bg-cyber-cyan rounded-full flex-shrink-0"></div>
                  <span className="text-cyber-text/80 text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Future Interests */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-cyber-dark border border-cyber-gray p-8 rounded-lg relative overflow-hidden group hover:border-[#ff3366] transition-colors"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff3366]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <Compass className="text-[#ff3366]" size={32} />
              <h2 className="text-2xl font-bold font-mono text-white">Future Interests</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {futureInterests.map((interest) => (
                <div key={interest.id} className="bg-cyber-black border border-cyber-gray p-4 rounded flex flex-col items-center justify-center gap-3 hover:border-[#ff3366]/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-[#ff3366]/40 flex items-center justify-center">
                    <img
                      src={interest.logoUrl}
                      alt={interest.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const fallback = interest.domain
                          ? `https://icons.duckduckgo.com/ip3/${interest.domain}.ico`
                          : "";
                        if (fallback && e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                          return;
                        }
                        e.currentTarget.src = "https://via.placeholder.com/24?text=AI";
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-cyber-text text-center">{interest.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
