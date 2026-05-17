"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  CertificateRecord,
  defaultCertificates,
  getStoredCertificates,
  PORTFOLIO_UPDATE_EVENT,
} from "@/lib/portfolioStore";

const normalizeCertName = (fileName: string) => {
  const withoutExt = fileName.replace(/\.[^/.]+$/, "");
  const withoutPrefix = withoutExt.includes("_")
    ? withoutExt.split("_").slice(1).join("_")
    : withoutExt;
  return withoutPrefix.replace(/[-_]+/g, " ").trim();
};

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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2 flex items-center gap-4">
            Certificate_Vault
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-cyber-purple to-transparent"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, idx) => (
            <motion.a
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              href={cert.fileUrl || cert.imageUrl || undefined}
              target={cert.fileUrl || cert.imageUrl ? "_blank" : undefined}
              rel={cert.fileUrl || cert.imageUrl ? "noreferrer" : undefined}
              className="group relative bg-cyber-dark border border-cyber-gray p-6 rounded-lg overflow-hidden cursor-pointer hover:border-cyber-purple transition-colors h-48 flex flex-col justify-between"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-0">
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyber-gray/40 to-cyber-dark" />
                )}
                <div className="absolute inset-0 bg-cyber-dark/40 backdrop-blur-[2px]"></div>
              </div>

              <div className="relative z-10 flex justify-between items-start mb-4">
                <Award className="text-cyber-purple group-hover:animate-pulse transition-colors" size={32} />
                <span className="text-xs font-mono px-2 py-1 bg-cyber-gray text-cyber-purple rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  VERIFIED
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-cyber-neon transition-colors">
                  {cert.name}
                </h3>
                <div className="font-mono text-sm text-cyber-text/50">
                  ISSUER: {cert.issuer}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
