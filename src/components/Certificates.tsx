"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CertificateRecord,
  defaultCertificates,
  getStoredCertificates,
  PORTFOLIO_UPDATE_EVENT,
} from "@/lib/portfolioStore";

function CertCard({ cert, idx }: { cert: CertificateRecord; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const hasLink = !!(cert.fileUrl || cert.imageUrl);

  const inner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.07, duration: 0.45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-[#080c14] border border-cyber-gray/50 rounded-lg p-6 overflow-hidden flex flex-col gap-4 h-full"
      style={{
        boxShadow: hovered
          ? "0 0 24px rgba(176,38,255,0.12), 0 0 0 1px rgba(176,38,255,0.2)"
          : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Background image on hover */}
      {cert.imageUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{ opacity: hovered ? 0.08 : 0 }}
        >
          <img
            src={cert.imageUrl}
            alt={cert.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/50 to-[#080c14]" />
        </div>
      )}

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="p-2.5 bg-cyber-purple/10 border border-cyber-purple/20 rounded-lg">
          <Award size={20} className="text-cyber-purple" />
        </div>
        {hasLink && (
          <span
            className={`flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded border transition-all duration-300 ${
              hovered
                ? "text-cyber-neon border-cyber-neon/40 bg-cyber-neon/5"
                : "text-cyber-text/25 border-cyber-gray/40"
            }`}
          >
            <ExternalLink size={9} />
            OPEN
          </span>
        )}
      </div>

      {/* Body */}
      <div className="relative flex-1">
        <h3 className={`font-mono text-sm font-bold leading-snug mb-2 transition-colors duration-300 ${hovered ? "text-cyber-neon" : "text-white"}`}>
          {cert.name}
        </h3>
        <div className="flex items-center gap-2">
          <ShieldCheck size={11} className="text-cyber-purple/50" />
          <span className="font-mono text-[10px] text-cyber-text/35 tracking-wide uppercase">
            {cert.issuer}
          </span>
        </div>
      </div>

      {/* Bottom tag */}
      <div className="relative flex items-center gap-2">
        <span className="h-px flex-1 bg-cyber-gray/30" />
        <span className="font-mono text-[9px] text-cyber-purple/40 tracking-widest">VERIFIED</span>
        <span className="h-px flex-1 bg-cyber-gray/30" />
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-10 h-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: "linear-gradient(225deg, rgba(176,38,255,0.15) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0.4,
        }}
      />
    </motion.div>
  );

  if (hasLink) {
    return (
      <a
        href={cert.fileUrl || cert.imageUrl || undefined}
        target="_blank"
        rel="noreferrer"
        className="block h-full"
      >
        {inner}
      </a>
    );
  }
  return <div className="h-full">{inner}</div>;
}

export default function Certificates() {
  const [certs, setCerts] = useState<CertificateRecord[]>(defaultCertificates);

  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredCertificates();
      setCerts(stored.length > 0 ? stored : defaultCertificates);
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
    <section className="relative py-24 px-6 md:px-24 z-10">
      <div className="w-full max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-cyber-neon glow-text-neon uppercase tracking-widest">Certificates_</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((cert, idx) => (
            <CertCard key={cert.id} cert={cert} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
