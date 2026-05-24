"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { defaultProfile, getStoredAdminTrigger, getStoredProfile, getStoredTerminalPassword, PORTFOLIO_UPDATE_EVENT, ProfileContent } from "@/lib/portfolioStore";

export default function ContactTerminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<{ command?: string; response: React.ReactNode }[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loginStep, setLoginStep] = useState<"idle" | "password">("idle");
  const [profile, setProfile] = useState<ProfileContent>(defaultProfile);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const adminTriggerRef = useRef<string>("");
  const terminalPasswordRef = useRef<string>("admin");
  const router = useRouter();

  useEffect(() => {
    const syncTrigger = () => {
      adminTriggerRef.current = getStoredAdminTrigger();
      terminalPasswordRef.current = getStoredTerminalPassword();
    };
    syncTrigger();
    window.addEventListener(PORTFOLIO_UPDATE_EVENT, syncTrigger);
    window.addEventListener("storage", syncTrigger);
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, syncTrigger);
      window.removeEventListener("storage", syncTrigger);
    };
  }, []);

  // Cheat code listener
  useEffect(() => {
    let buffer = "";
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRevealed) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const trigger = adminTriggerRef.current || "dk160106";
      buffer = (buffer + e.key.toLowerCase()).slice(-trigger.length);
      if (buffer === trigger) {
        setIsRevealed(true);
        setOutput([{ response: <div className="text-cyber-neon">System Ready. Type 'help' for commands.</div> }]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRevealed]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const handleUpdate = () => setProfile(getStoredProfile());
    handleUpdate();
    window.addEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(PORTFOLIO_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    
    let response: React.ReactNode = "";

    if (loginStep === "password") {
      const currentPassword = terminalPasswordRef.current || "admin";
      if (cmd === currentPassword) {
        response = <div className="text-cyber-neon mt-2">ACCESS GRANTED. REDIRECTING...</div>;
        setOutput((prev) => [...prev, { response: <div className="text-cyber-text/50">password: ********</div> }, { response }]);
        setInput("");
        setLoginStep("idle");
        localStorage.setItem("isAdmin", "true");
        setTimeout(() => {
          router.push("/admin");
        }, 1500);
        return;
      } else {
        response = <div className="text-red-400 mt-2">ACCESS DENIED.</div>;
        setOutput((prev) => [...prev, { response: <div className="text-cyber-text/50">password: ********</div> }, { response }]);
        setInput("");
        setLoginStep("idle");
        return;
      }
    }
    
    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === "contact --show") {
      const hasContact = Boolean(
        profile.email || profile.githubUrl || profile.linkedinUrl || profile.resumeUrl || profile.phone
      );
      response = (
        <div className="mt-2 space-y-2 text-cyber-cyan">
          {hasContact ? (
            <>
              {profile.email ? (
                <p>
                  Email: <a href={`mailto:${profile.email}`} className="hover:text-cyber-neon underline">{profile.email}</a>
                </p>
              ) : null}
              {profile.githubUrl ? (
                <p>
                  GitHub: <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-cyber-neon underline">{profile.githubUrl}</a>
                </p>
              ) : null}
              {profile.linkedinUrl ? (
                <p>
                  LinkedIn: <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-cyber-neon underline">{profile.linkedinUrl}</a>
                </p>
              ) : null}
              {profile.phone ? (
                <p>
                  Phone: <span className="text-cyber-neon font-mono">{profile.phone}</span>
                </p>
              ) : null}
              {profile.resumeUrl ? (
                <p>
                  Resume: <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="hover:text-cyber-neon underline">Download PDF</a>
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-cyber-text/70">No contact details configured in Admin.</p>
          )}
        </div>
      );
    } else if (lowerCmd === "clear") {
      setOutput([]);
      setInput("");
      return;
    } else if (lowerCmd === "exit") {
      setIsRevealed(false);
      setOutput([]);
      setInput("");
      return;
    } else if (lowerCmd === "login") {
      response = <div className="text-cyber-cyan mt-2">Enter Password:</div>;
      setLoginStep("password");
    } else if (lowerCmd === "help") {
      response = (
        <div className="mt-2 text-cyber-text/80">
          <p>Available commands:</p>
          <p className="text-cyber-neon">- contact --show : Display contact information</p>
          <p className="text-cyber-neon">- login : Access Admin Space</p>
          <p className="text-cyber-neon">- clear : Clear terminal</p>
          <p className="text-cyber-neon">- exit : Close terminal</p>
        </div>
      );
    } else {
      response = <div className="mt-2 text-red-400">Command not found: {cmd}. Type 'help' for available commands.</div>;
    }

    setOutput((prev) => [...prev, { command: cmd, response }]);
    setInput("");
  };

  if (!isRevealed) return null;

  return (
    <section className="fixed bottom-0 left-0 right-0 p-6 md:p-12 z-50 pointer-events-none flex justify-center">
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-4xl bg-cyber-dark/95 backdrop-blur border border-cyber-gray rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto"
          >
            {/* Terminal Header */}
            <div className="bg-[#1a1b26] border-b border-cyber-gray p-3 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={() => setIsRevealed(false)}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center font-mono text-xs text-cyber-text/50">
                dharshan@sys: ~/terminal
              </div>
              <div className="w-12"></div> {/* Spacer for centering */}
            </div>
            
            {/* Terminal Body */}
            <div 
              className="p-6 h-80 overflow-y-auto font-mono text-sm cursor-text"
              onClick={focusInput}
              ref={terminalRef}
            >
              <div className="text-cyber-text/80 mb-4">
                Dharshan Security Framework - SECURE TERMINAL<br/>
              </div>
              
              {output.map((item, idx) => (
                <div key={idx} className="mb-4">
                  {item.command && (
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-neon">root@dharshan:~$</span>
                      <span className="text-white">{item.command}</span>
                    </div>
                  )}
                  {item.response}
                </div>
              ))}
              
              <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4">
                <span className="text-cyber-neon">root@dharshan:~$</span>
                <input
                  ref={inputRef}
                  type={loginStep === "password" ? "password" : "text"}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white caret-cyber-neon"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
