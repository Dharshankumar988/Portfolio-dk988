"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Lock } from "lucide-react";
import { eventBus, EventTypes, PortfolioSection } from "@/lib/eventBus";
import { getStoredProfile, getStoredAdminTrigger, getStoredTerminalPassword, getStoredProjects, getStoredCertificates, getStoredSkills } from "@/lib/portfolioStore";

type MenuOption = { label: string; desc?: string; action: () => void };

const ScanCommand = () => {
  const [progress, setProgress] = useState(0);
  const [ip, setIp] = useState("Scanning...");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(r => r.json())
      .then(d => setIp(d.ip))
      .catch(() => setIp("192.168.1.104 (Fallback)"));

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setComplete(true);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-2 text-cyber-blue font-mono">
      <div className="animate-pulse">[INITIALIZING SECURITY SCAN]</div>
      <div className="flex items-center gap-2 mt-2">
        <span>Target IP:</span>
        <span className="text-cyber-neon font-bold">{ip}</span>
      </div>
      <div className="mt-2 w-full max-w-md bg-cyber-dark border border-cyber-neon/30 h-4 rounded overflow-hidden">
        <div 
          className="h-full bg-cyber-neon transition-all duration-300"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
      <div className="mt-1 text-xs">{Math.floor(Math.min(100, progress))}% Complete</div>
      {complete && (
        <div className="mt-3 text-cyber-neon border-l-2 border-cyber-neon pl-2">
          [✓] PORT SCAN COMPLETE. NO VULNERABILITIES DETECTED.<br/>
          [✓] CONNECTION SECURE. LOGGED.
        </div>
      )}
    </div>
  );
};

const COMMAND_DETAILS = {
  help: "Show available commands",
  info: "Show available portfolio sections",
  about: "Read my professional summary and objective",
  skills: "View my technical skills",
  projects: "Explore the projects I've built",
  certificates: "See my certifications",
  resume: "View or download my resume",
  github: "Open my GitHub profile",
  linkedin: "Open my LinkedIn profile",
  contact: "Find ways to contact me",
  scan: "Run a security scan and trace IP",
  history: "View command history",
  clear: "Clear the terminal"
};

const COMMANDS = Object.keys(COMMAND_DETAILS);

type HistoryEntry = {
  id: string;
  type: "input" | "output" | "error";
  content: React.ReactNode;
};

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([
    { id: "init", type: "output", content: "Dharshan Security Framework OS [Version 10.0.19045.2965]\n(c) Dharshan Corporation. All rights reserved.\n\nType 'help' for a list of commands." }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [activeMenu, setActiveMenu] = useState<{ title: string; options: MenuOption[]; selectedIndex: number } | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Open/Close listeners
    const unsubOpen = eventBus.subscribe(EventTypes.TERMINAL_OPEN, () => setIsOpen(true));
    const unsubClose = eventBus.subscribe(EventTypes.TERMINAL_CLOSE, () => setIsOpen(false));
    const unsubClear = eventBus.subscribe(EventTypes.TERMINAL_CLEAR, () => setHistory([]));
    const unsubExecute = eventBus.subscribe(EventTypes.TERMINAL_EXECUTE, ({ command }) => {
      setIsOpen(true);
      executeCommand(command);
    });

    return () => {
      unsubOpen();
      unsubClose();
      unsubClear();
      unsubExecute();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const addHistory = (type: "input" | "output" | "error", content: React.ReactNode) => {
    setHistory(prev => [...prev, { id: Math.random().toString(), type, content }]);
  };

  const handleAutocomplete = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (activeMenu) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveMenu(prev => prev ? { ...prev, selectedIndex: Math.max(0, prev.selectedIndex - 1) } : null);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveMenu(prev => prev ? { ...prev, selectedIndex: Math.min(prev.options.length - 1, prev.selectedIndex + 1) } : null);
      } else if (e.key === "Escape" || e.key === "Backspace") {
        setActiveMenu(null);
      } else {
        // Any other key typing dismisses the menu
        setActiveMenu(null);
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    addHistory("input", `C:\\Users\\Guest> ${trimmed}`);
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    setInput("");
    setSuggestions([]);

    const dispatchNavigation = (section: PortfolioSection) => {
      eventBus.dispatch(EventTypes.SCROLL_TO_SECTION, { section });
      eventBus.dispatch(EventTypes.ASSISTANT_OPEN_SECTION, { section });
    };

    switch (trimmed) {
      case "help":
        addHistory("output", (
          <div className="flex flex-col gap-1 mt-2">
            <div className="mb-2 text-cyber-blue font-bold">Available Commands:</div>
            {Object.entries(COMMAND_DETAILS).map(([cmd, desc]) => (
              <div 
                key={cmd} 
                className="grid grid-cols-[120px_1fr] gap-4 hover:bg-cyber-blue/10 cursor-pointer p-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  executeCommand(cmd);
                }}
              >
                <span className="text-cyber-neon">{cmd}</span>
                <span className="text-gray-400">{desc}</span>
              </div>
            ))}
          </div>
        ));
        break;
      case "info":
        setActiveMenu({
          title: "Available Portfolio Sections (Use ↑/↓ and Enter):",
          options: ["about", "skills", "projects", "certificates", "resume", "github", "linkedin", "contact"].map(sec => ({
            label: sec,
            desc: COMMAND_DETAILS[sec as keyof typeof COMMAND_DETAILS],
            action: () => executeCommand(sec)
          })),
          selectedIndex: 0
        });
        break;
      case "projects": {
        const projects = getStoredProjects();
        if (projects.length === 0) {
          addHistory("error", "No projects found in the database.");
          break;
        }
        setActiveMenu({
          title: "Select a Project to Open (Use ↑/↓ and Enter):",
          options: projects.map(p => ({
            label: p.title,
            desc: p.tech.join(", "),
            action: () => {
              if (p.githubUrl) window.open(p.githubUrl, "_blank");
              else if (p.liveUrl) window.open(p.liveUrl, "_blank");
              else addHistory("error", `No URL available for ${p.title}`);
            }
          })),
          selectedIndex: 0
        });
        break;
      }
      case "certificates": {
        const certs = getStoredCertificates();
        if (certs.length === 0) {
          addHistory("error", "No certificates found in the database.");
          break;
        }
        setActiveMenu({
          title: "Select a Certificate to View (Use ↑/↓ and Enter):",
          options: certs.map(c => ({
            label: c.name,
            desc: c.issuer,
            action: () => {
              if (c.fileUrl || c.imageUrl) window.open(c.fileUrl || c.imageUrl, "_blank");
              else addHistory("error", `No URL available for ${c.name}`);
            }
          })),
          selectedIndex: 0
        });
        break;
      }
      case "about": {
        const profile = getStoredProfile();
        addHistory("output", (
          <div className="mt-2 text-cyber-cyan border-l-2 border-cyber-cyan pl-2">
            <div className="font-bold mb-1">About {profile.name}</div>
            <div className="whitespace-pre-wrap">{profile.bio || "No biography available."}</div>
            {profile.careerGoals && (
              <div className="mt-2 text-gray-300">
                <span className="font-bold text-cyber-blue">Objective:</span> {profile.careerGoals}
              </div>
            )}
          </div>
        ));
        break;
      }
      case "skills": {
        const skills = getStoredSkills().items;
        if (skills.length === 0) {
          addHistory("error", "No skills found in the database.");
          break;
        }
        const categories: Record<string, string[]> = {};
        skills.forEach(s => {
          if (!categories[s.category]) categories[s.category] = [];
          categories[s.category].push(s.name);
        });
        addHistory("output", (
          <div className="mt-2 text-cyber-neon border-l-2 border-cyber-neon pl-2 space-y-2">
            <div className="font-bold mb-2">Technical Skills</div>
            {Object.entries(categories).map(([cat, items]) => (
              <div key={cat}>
                <span className="text-cyber-blue font-bold">{cat}:</span> <span className="text-gray-300">{items.join(", ")}</span>
              </div>
            ))}
          </div>
        ));
        break;
      }
      case "contact":
        addHistory("output", `Opening ${trimmed}...`);
        dispatchNavigation(trimmed as PortfolioSection);
        break;
      case "resume":
      case "github":
      case "linkedin": {
        const profile = getStoredProfile();
        let url = "";
        if (trimmed === "resume") url = profile.resumeUrl;
        else if (trimmed === "github") url = profile.githubUrl;
        else if (trimmed === "linkedin") url = profile.linkedinUrl;

        if (url) {
          addHistory("output", (
            <div className="mt-1">
              Opening {trimmed}... <a href={url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{url}</a>
            </div>
          ));
          window.open(url, "_blank");
        } else {
          addHistory("error", `No ${trimmed} URL configured in the portfolio.`);
        }
        break;
      }
      case "history":
        addHistory("output", commandHistory.length ? commandHistory.join("\n") : "No commands in history.");
        break;
      case "scan":
        addHistory("output", <ScanCommand />);
        break;
      case "clear":
        setHistory([]);
        break;
      case "--grant --admin access":
        setShowAdminLogin(true);
        break;
      default:
        if (trimmed === getStoredAdminTrigger().toLowerCase()) {
          setShowAdminLogin(true);
        } else {
          addHistory("error", `'${trimmed}' is not recognized as an internal or external command, operable program or batch file.`);
        }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) {
      const matched = COMMANDS.filter(c => c.startsWith(val.toLowerCase()));
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <div id="terminal-toggle-container" className="fixed top-1/2 -translate-y-1/2 left-4 z-50 pointer-events-none flex flex-col items-center gap-2">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="pointer-events-auto p-3 md:p-4 bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(0,195,255,0.3)] hover:shadow-[0_0_25px_rgba(0,195,255,0.5)] transition-all"
            >
              <TerminalIcon className="w-6 h-6 md:w-8 md:h-8" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="terminal-window"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed z-50 flex flex-col overflow-hidden bg-black/80 backdrop-blur-xl border border-cyber-blue/30 shadow-[0_0_30px_rgba(0,195,255,0.15)] ${
              isMaximized 
                ? "inset-0 w-full h-full rounded-none" 
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[800px] h-[500px] rounded-xl"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-900/30 to-black/30 border-b border-cyber-blue/20 select-none">
              <div className="flex items-center gap-2 text-cyber-blue text-sm font-mono">
                <TerminalIcon size={16} />
                <span>Windows PowerShell</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMaximized(!isMaximized)} className="text-gray-400 hover:text-white transition-colors">
                  {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="flex-1 p-4 overflow-y-auto font-mono text-sm"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="space-y-2">
                {history.map((h) => (
                  <div 
                    key={h.id} 
                    className={`whitespace-pre-wrap ${
                      h.type === "input" ? "text-gray-300" : 
                      h.type === "error" ? "text-red-400" : 
                      "text-cyber-blue/90"
                    }`}
                  >
                    {h.content}
                  </div>
                ))}
                
                {/* Active Menu */}
                {activeMenu && (
                  <div className="flex flex-col gap-1 mt-2 mb-2">
                    <div className="mb-2 text-cyber-blue font-bold">{activeMenu.title}</div>
                    {activeMenu.options.map((opt, idx) => (
                      <div 
                        key={opt.label + idx} 
                        className={`grid grid-cols-[180px_1fr] gap-4 cursor-pointer p-1 rounded transition-colors ${
                          idx === activeMenu.selectedIndex ? "bg-cyber-blue/20 text-white border-l-2 border-cyber-blue" : "hover:bg-cyber-blue/10 text-gray-400"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          opt.action();
                          setActiveMenu(null);
                        }}
                      >
                        <span className="text-cyber-neon capitalize truncate">{opt.label}</span>
                        <span className="truncate">{opt.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Input Line */}
                <div className="flex items-center text-gray-300">
                  <span className="mr-2">C:\Users\Guest&gt;</span>
                  <div className="relative flex-1 flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (activeMenu) {
                            e.preventDefault();
                            const selectedAction = activeMenu.options[activeMenu.selectedIndex].action;
                            setActiveMenu(null);
                            selectedAction();
                          } else {
                            executeCommand(input);
                          }
                        } else if (e.ctrlKey && e.key === "l") {
                          e.preventDefault();
                          setHistory([]);
                        } else {
                          handleAutocomplete(e);
                        }
                      }}
                      className="w-full bg-transparent outline-none border-none text-gray-300 caret-cyber-blue"
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {/* Suggestions Ghost Text */}
                    {suggestions.length > 0 && input && suggestions[0].startsWith(input.toLowerCase()) && (
                      <span className="absolute left-0 pointer-events-none text-gray-500">
                        {input}<span className="opacity-50">{suggestions[0].slice(input.length)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Popup */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-cyber-dark border-2 border-cyber-blue/50 p-8 rounded-lg shadow-[0_0_50px_rgba(0,195,255,0.2)]"
            >
              <h2 className="text-2xl font-bold font-mono text-cyber-blue mb-6 flex items-center gap-2">
                <Lock size={24} />
                ADMIN AUTHENTICATION
              </h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (adminPasswordInput === getStoredTerminalPassword()) {
                  sessionStorage.setItem("isAdmin", "true");
                  window.location.href = "/admin";
                } else {
                  addHistory("error", "ACCESS DENIED: Invalid administrator credentials.");
                  setShowAdminLogin(false);
                  setAdminPasswordInput("");
                  setIsOpen(true);
                }
              }} className="space-y-4">
                <input
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="ENTER PASSWORD"
                  autoFocus
                  className="w-full bg-black/50 border border-cyber-gray focus:border-cyber-blue rounded p-3 font-mono text-white outline-none transition-colors"
                />
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue border border-cyber-blue rounded font-mono transition-colors">
                    LOGIN
                  </button>
                  <button type="button" onClick={() => { setShowAdminLogin(false); setAdminPasswordInput(""); }} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded font-mono transition-colors">
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
