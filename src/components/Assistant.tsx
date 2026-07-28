"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { eventBus, EventTypes, PortfolioSection } from "@/lib/eventBus";
import { getStoredProfile } from "@/lib/portfolioStore";
import { useIsMobile } from "@/utils/useIsMobile";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SECTIONS: { label: string; id: PortfolioSection }[] = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Certificates", id: "certificates" },
  { label: "Resume", id: "resume" },
  { label: "GitHub", id: "github" },
  { label: "LinkedIn", id: "linkedin" },
  { label: "Contact", id: "contact" },
];

export default function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi I am Dharshan Kumar B👋, Nice to meet u. Ask me anything about my portfolio, skills, projects, or experience!",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubOpen = eventBus.subscribe(EventTypes.OPEN_ASSISTANT, () => setIsOpen(true));
    const unsubClose = eventBus.subscribe(EventTypes.CLOSE_ASSISTANT, () => setIsOpen(false));
    const unsubQuery = eventBus.subscribe(EventTypes.ASSISTANT_SEND_QUERY, ({ query }) => {
      setIsOpen(true);
      handleSend(query);
    });

    const initialHide = setTimeout(() => setShowTooltip(false), 5000);
    const cycle = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 15 * 60 * 1000);

    return () => {
      unsubOpen();
      unsubClose();
      unsubQuery();
      clearTimeout(initialHide);
      clearInterval(cycle);
    };
  }, []);

  const handleQuickAction = (sec: { label: string; id: string }) => {
    if (["resume", "github", "linkedin"].includes(sec.id)) {
      const userMsg: Message = { id: Date.now().toString() + "_u", role: "user", content: sec.label };
      const sysMsg: Message = { id: Date.now().toString() + "_s", role: "assistant", content: `Opening ${sec.label} in a new tab...` };
      setMessages(prev => [...prev, userMsg, sysMsg]);
      
      const profile = getStoredProfile();
      let url = "";
      if (sec.id === "resume") url = profile.resumeUrl;
      else if (sec.id === "github") url = profile.githubUrl;
      else if (sec.id === "linkedin") url = profile.linkedinUrl;
      
      if (url) {
        setTimeout(() => window.open(url, "_blank"), 500);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString() + "_err", role: "assistant", content: `No ${sec.label} URL found.` }]);
      }
      
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } else {
      // Send the query to the AI assistant
      handleSend(sec.label);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: data.reply }]);
      } else {
        throw new Error(data.error || "Failed to fetch");
      }
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ═══════════════════════════════════════════════
   *  MOBILE: Full-screen chat with FAB trigger
   * ═══════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <>
        {/* Floating Action Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyber-cyan/30 to-cyber-neon/20 border border-cyber-cyan/50 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.3)]"
              style={{
                bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
                right: "16px",
              }}
              aria-label="Open chat"
            >
              <div className="absolute inset-0 rounded-full bg-cyber-cyan/20 animate-ping opacity-30" />
              <img
                src="/AI_icon.png"
                alt="AI"
                className="w-8 h-8 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <Bot size={24} className="text-cyber-cyan absolute z-[5] hidden [.fallback-icon_&]:block" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Full-screen Chat Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-0 z-[60] flex flex-col bg-cyber-black"
            >
              {/* Header */}
              <div className="flex flex-col border-b border-cyber-gray/30 bg-gradient-to-b from-cyber-dark to-cyber-black shrink-0">
                <div className="flex items-center justify-between px-4 pt-3 pb-2"
                     style={{ paddingTop: "max(12px, env(safe-area-inset-top, 12px))" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-cyber-cyan/50 flex items-center justify-center bg-black/50 shrink-0">
                      <img src="/AI_icon.png" alt="Bot" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <Bot size={20} className="text-cyber-cyan absolute -z-10" />
                    </div>
                    <div>
                      <h3 className="font-mono text-cyber-cyan text-[13px] sm:text-base font-bold leading-tight">Hi👋 Nice to meet you .</h3>
                      <p className="text-[10px] sm:text-[11px] text-cyber-text/40">I am Dharshan Kumar B</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-cyber-text/50 hover:text-white transition-colors rounded-full hover:bg-cyber-gray/30 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close chat"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Quick Sections — horizontal scroll */}
                <div className="flex gap-2 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {SECTIONS.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleQuickAction(sec)}
                      className="text-xs px-3 py-1.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/25 text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors shrink-0 min-h-[32px]"
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-cyber-cyan/15 border border-cyber-cyan/25 text-white rounded-br-sm"
                        : "bg-cyber-gray/40 border border-cyber-gray/30 text-gray-200 rounded-bl-sm"
                    }`}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-headings:text-cyber-neon prose-a:text-cyber-neon prose-a:font-semibold prose-a:underline prose-a:decoration-cyber-neon/50 prose-a:underline-offset-4 prose-a:break-all hover:prose-a:text-white hover:prose-a:decoration-white prose-pre:bg-black/60 prose-pre:border prose-pre:border-cyber-blue/30">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyber-neon font-semibold underline decoration-cyber-neon/50 underline-offset-4 break-all hover:text-white hover:decoration-white transition-colors" />
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-cyber-gray/40 border border-cyber-gray/30 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-cyber-cyan/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-cyber-cyan/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-cyber-cyan/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div
                className="shrink-0 px-4 py-3 border-t border-cyber-gray/30 bg-cyber-dark/80"
                style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}
              >
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 bg-cyber-gray/40 border border-cyber-gray/50 focus:border-cyber-cyan/50 rounded-xl py-3 pl-4 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors min-h-[48px]"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-3 bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan disabled:text-gray-600 disabled:bg-transparent disabled:border-cyber-gray/30 hover:bg-cyber-cyan/30 transition-colors rounded-xl min-w-[48px] min-h-[48px] flex items-center justify-center shrink-0"
                    aria-label="Send message"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  /* ═══════════════════════════════════════════════
   *  DESKTOP: Original assistant (unchanged)
   * ═══════════════════════════════════════════════ */
  return (
    <>
      {/* Trigger Mascot */}
      <div id="assistant-toggle-container" className="fixed top-1/2 -translate-y-1/2 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group focus:outline-none flex items-center gap-3"
            >
              {/* Dialog Box */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hidden sm:flex absolute top-full mt-4 right-0 w-40 bg-cyber-blue/20 border border-cyber-blue/50 text-cyber-blue text-xs leading-relaxed px-3 py-2 rounded-2xl rounded-tr-none backdrop-blur-md shadow-[0_0_15px_rgba(0,195,255,0.3)] text-center pointer-events-none"
                  >
                    Ask me anything related to the portfolio !!
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative">
                <div className="absolute inset-0 bg-cyber-blue/20 rounded-full blur-xl group-hover:bg-cyber-blue/40 transition-colors" />
                <img 
                  src="/AI_icon.png" 
                  alt="Assistant Mascot" 
                  className="w-12 h-12 md:w-16 md:h-16 object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,195,255,0.5)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.closest('button')?.classList.add('fallback-icon');
                  }}
                />
                <div className="hidden group-[.fallback-icon]:flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-cyber-blue/20 border border-cyber-blue text-cyber-blue backdrop-blur-sm relative z-10">
                  <Bot className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Assistant Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="assistant-window"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg md:max-w-xl lg:max-w-2xl h-[600px] max-h-[80vh] z-50 flex flex-col bg-black/80 backdrop-blur-xl border border-cyber-blue/30 shadow-[0_0_30px_rgba(0,195,255,0.15)] rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col border-b border-cyber-blue/20 bg-gradient-to-b from-blue-900/40 to-transparent p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-cyber-blue/50 flex items-center justify-center bg-black/50">
                    <img src="/AI_icon.png" alt="Bot" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <Bot size={20} className="text-cyber-blue absolute -z-10" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-cyber-blue text-sm sm:text-lg leading-tight">Hi👋 Nice to meet you .</h3>
                    <p className="text-xs text-gray-400">I am Dharshan Kumar B</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                  <X size={20} />
                </button>
              </div>

              {/* Quick Sections */}
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleQuickAction(sec)}
                    className="text-xs px-2 py-1 rounded-md bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:bg-cyber-blue/20 transition-colors"
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyber-blue/30 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === "user" 
                      ? "bg-cyber-blue/20 border border-cyber-blue/30 text-white rounded-br-none" 
                      : "bg-gray-800/60 border border-gray-700/50 text-gray-200 rounded-bl-none"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-headings:text-cyber-neon prose-a:text-cyber-neon prose-a:font-semibold prose-a:underline prose-a:decoration-cyber-neon/50 prose-a:underline-offset-4 prose-a:break-all hover:prose-a:text-white hover:prose-a:decoration-white prose-pre:bg-black/60 prose-pre:border prose-pre:border-cyber-blue/30">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyber-neon font-semibold underline decoration-cyber-neon/50 underline-offset-4 break-all hover:text-white hover:decoration-white transition-colors" />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyber-blue/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-cyber-blue/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-cyber-blue/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-cyber-blue/20 bg-black/50">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-gray-900/80 border border-gray-700 focus:border-cyber-blue/50 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 text-cyber-blue disabled:text-gray-600 hover:text-white transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
