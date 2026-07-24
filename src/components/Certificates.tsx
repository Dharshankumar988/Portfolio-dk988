"use client";

import { motion } from "framer-motion";
import { Award, ExternalLink, ShieldCheck, Star } from "lucide-react";
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
  const isStar = cert.iconType === "star";

  const inner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.07, duration: 0.45 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative bg-[#080c14] border rounded-lg p-6 overflow-hidden flex flex-col gap-4 h-full transition-colors duration-300 ${
        isStar ? "border-amber-500/40" : "border-cyber-gray/50"
      }`}
      style={{
        boxShadow: hovered
          ? isStar
            ? "0 0 24px rgba(245,158,11,0.22), 0 0 0 1px rgba(245,158,11,0.35)"
            : "0 0 24px rgba(176,38,255,0.12), 0 0 0 1px rgba(176,38,255,0.2)"
          : isStar
            ? "0 0 16px rgba(245,158,11,0.08), 0 0 0 1px rgba(245,158,11,0.2)"
            : "none",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Background preview on hover */}
      {(cert.imageUrl || cert.fileUrl) && (
        <div
          className="absolute inset-0 transition-all duration-500 pointer-events-none z-0 rounded-lg overflow-hidden"
          style={{ opacity: hovered ? 0.35 : 0 }}
        >
          {cert.imageUrl || (cert.fileUrl && cert.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
            <img
              src={cert.imageUrl || cert.fileUrl!}
              alt={cert.name}
              className="w-full h-full object-cover"
            />
          ) : (cert.fileUrl && cert.fileUrl.endsWith('.pdf')) ? (
            <div className="w-full h-full overflow-hidden relative">
              <iframe 
                src={`${cert.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="w-full h-[150%] absolute top-0 left-0 border-none pointer-events-none"
                title={cert.name}
              />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/70 to-[#080c14]/30" />
        </div>
      )}

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className={`p-2.5 rounded-lg transition-all duration-300 ${
          isStar 
            ? "bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]" 
            : "bg-cyber-purple/10 border border-cyber-purple/20"
        }`}>
          {isStar ? (
            <Star size={20} className="text-amber-400 fill-amber-400" />
          ) : (
            <Award size={20} className="text-cyber-purple" />
          )}
        </div>
        {hasLink && (
          <span
            className={`flex items-center gap-1 font-mono text-[10px] px-2 py-1 rounded border transition-all duration-300 ${
              hovered
                ? isStar
                  ? "text-amber-400 border-amber-400/40 bg-amber-400/5"
                  : "text-cyber-neon border-cyber-neon/40 bg-cyber-neon/5"
                : "text-cyber-text/25 border-cyber-gray/40"
            }`}
          >
            <ExternalLink size={9} />
            OPEN
          </span>
        )}
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1">
        <h3 className={`font-mono text-sm font-bold leading-snug mb-2 transition-colors duration-300 ${
          hovered ? (isStar ? "text-amber-300" : "text-cyber-neon") : "text-white"
        }`}>
          {cert.name}
        </h3>
        <div className="flex items-center gap-2">
          <ShieldCheck size={11} className={isStar ? "text-amber-400/60" : "text-cyber-purple/50"} />
          <span className="font-mono text-[10px] text-cyber-text/35 tracking-wide uppercase">
            {cert.issuer}
          </span>
        </div>
      </div>



      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-10 h-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: isStar
            ? "linear-gradient(225deg, rgba(245,158,11,0.25) 0%, transparent 60%)"
            : "linear-gradient(225deg, rgba(176,38,255,0.15) 0%, transparent 60%)",
          opacity: hovered ? 1 : isStar ? 0.7 : 0.4,
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
