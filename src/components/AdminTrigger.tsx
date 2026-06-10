"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, AlertTriangle } from "lucide-react";
import { getStoredAdminTrigger, setStoredAdminTrigger, getStoredTerminalPassword, setStoredTerminalPassword, saveToDB } from "@/lib/portfolioStore";

const MASTER_OVERRIDE_CODE = "shrav1410";

export default function AdminTrigger() {
  const [isTriggered, setIsTriggered] = useState(false);
  const [newTrigger, setNewTrigger] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<"idle" | "updating" | "success">("idle");

  useEffect(() => {
    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const key = e.key.toLowerCase();
      buffer = (buffer + key).slice(-MASTER_OVERRIDE_CODE.length);
      if (buffer === MASTER_OVERRIDE_CODE) {
        setIsTriggered(true);
        buffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isTriggered) {
      setNewTrigger(getStoredAdminTrigger());
      setNewPassword(getStoredTerminalPassword());
    }
  }, [isTriggered]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.trim() || !newPassword.trim()) return;
    setAuthStatus("updating");
    
    setStoredAdminTrigger(newTrigger, true);
    setStoredTerminalPassword(newPassword, true);
    
    const ok = await saveToDB("save_admin_settings", { trigger: newTrigger, terminalPassword: newPassword });
    
    if (ok) {
      setAuthStatus("success");
      setTimeout(() => {
        setIsTriggered(false);
        setAuthStatus("idle");
        setNewTrigger("");
        setNewPassword("");
      }, 2000);
    } else {
      setAuthStatus("idle");
    }
  };

  return (
    <AnimatePresence>
      {isTriggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <div className="absolute inset-0 pointer-events-none scanlines"></div>
          
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md bg-cyber-dark border-2 border-[#ff3366]/50 p-8 rounded-lg shadow-[0_0_50px_rgba(255,51,102,0.2)]"
          >
            <div className="flex items-center gap-4 mb-6 text-[#ff3366]">
              <AlertTriangle size={32} className="animate-pulse" />
              <h2 className="text-2xl font-bold font-mono tracking-widest">MASTER OVERRIDE</h2>
            </div>
            
            <div className="font-mono text-sm space-y-2 mb-8">
              <p className="text-cyber-text">CRITICAL ACCESS GRANTED.</p>
              <p className="text-[#ff3366]">UPDATE ADMIN CREDENTIALS BELOW.</p>
            </div>
            
            {authStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-cyber-neon space-y-4"
              >
                <Unlock size={48} />
                <p className="font-mono text-xl tracking-widest">TRIGGER UPDATED</p>
                <p className="font-mono text-sm opacity-70">Returning to system...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-gray" size={20} />
                  <input
                    type="password"
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    placeholder="ENTER NEW ADMIN TRIGGER"
                    className="w-full bg-black/50 border border-cyber-gray focus:border-[#ff3366] rounded p-3 pl-10 font-mono text-white outline-none transition-colors"
                    disabled={authStatus === "updating"}
                    autoFocus
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-gray" size={20} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="ENTER NEW LOGIN PASSWORD"
                    className="w-full bg-black/50 border border-cyber-gray focus:border-[#ff3366] rounded p-3 pl-10 font-mono text-white outline-none transition-colors"
                    disabled={authStatus === "updating"}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={authStatus === "updating" || !newTrigger || !newPassword}
                  className="w-full py-3 bg-[#ff3366]/10 hover:bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366] rounded font-mono font-bold tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {authStatus === "updating" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#ff3366] border-t-transparent rounded-full animate-spin" />
                      UPDATING...
                    </>
                  ) : (
                    "CONFIRM"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsTriggered(false)}
                  className="w-full py-2 text-cyber-text/50 hover:text-white font-mono text-sm transition-colors"
                >
                  [ ABORT ]
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
