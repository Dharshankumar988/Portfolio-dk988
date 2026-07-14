"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { eventBus, EventTypes } from "@/lib/eventBus";

// Types
type TutorialStep = {
  id: number;
  mascot: string;
  title?: string;
  message: string | React.ReactNode;
  image?: string; // New optional image property
  targetId?: string; 
  mascotPos?: { x?: string | number; y?: string | number; top?: string | number; left?: string | number; right?: string | number; bottom?: string | number };
  dialogPos?: { x?: string | number; y?: string | number; top?: string | number; left?: string | number; right?: string | number; bottom?: string | number };
  onEnter?: () => void;
  onExit?: () => void;
  autoAdvanceMs?: number;
};

const DOCKED_POS = { bottom: "20px", right: "20px" };

export default function Tutorial() {
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false); 
  const [tutorialState, setTutorialState] = useState<"idle" | "prompt" | "active">("idle");
  const [tutorialPreference, setTutorialPreference] = useState<"yes" | "no" | "skip" | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fakeTyping, setFakeTyping] = useState("");
  
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const status = localStorage.getItem("portfolioTutorialStatus") as "yes" | "no" | "skip" | null;
    if (status) {
      setTutorialPreference(status);
      setHasSeenTutorial(true);
      setTutorialState("idle");
    } else {
      setHasSeenTutorial(false);
      let autoDismissTimer: NodeJS.Timeout;
      const timer = setTimeout(() => {
        setTutorialState("prompt");
        autoDismissTimer = setTimeout(() => {
          setTutorialState((prev) => {
            if (prev === "prompt") {
              localStorage.setItem("portfolioTutorialStatus", "skip");
              setTutorialPreference("skip");
              return "idle";
            }
            return prev;
          });
        }, 7000);
      }, 3500);
      return () => {
        clearTimeout(timer);
        clearTimeout(autoDismissTimer);
      };
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem("portfolioTutorialSeen", "true");
    setTutorialState("idle");
    document.body.classList.remove("tutorial-active");
    removeSpotlight();
    
    if (typeof window !== "undefined") {
      const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
      if (api) {
        api.terminalClose();
        api.closeAssistant();
      }
    }
  };

  const removeSpotlight = () => {
    document.querySelectorAll(".spotlight-target").forEach(el => el.classList.remove("spotlight-target"));
  };

  const addSpotlight = (id: string) => {
    removeSpotlight();
    const el = document.getElementById(id);
    if (el) {
      el.classList.add("spotlight-target");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const simulateTyping = (command: string, onComplete: () => void) => {
    setFakeTyping("");
    let i = 0;
    if (typingInterval.current) clearInterval(typingInterval.current);
    typingInterval.current = setInterval(() => {
      setFakeTyping(command.slice(0, i + 1));
      i++;
      if (i >= command.length) {
        if (typingInterval.current) clearInterval(typingInterval.current);
        setTimeout(onComplete, 400); 
      }
    }, 100);
  };

  const steps: TutorialStep[] = [
    {
      id: 1,
      mascot: "/wave.png",
      title: "Welcome!",
      message: "Hi! I'm Dharshan.\nWelcome to my portfolio.",
      image: "/home page with Terminal and AI.png",
      mascotPos: { left: "50%", top: "35%", x: "-50%", y: "-50%" },
      dialogPos: { left: "50%", top: "65%", x: "-50%", y: "-50%" },
      autoAdvanceMs: 4000,
    },
    {
      id: 2,
      mascot: "/idle.png",
      title: "Quick Tour",
      message: "Let me quickly walk you through some of the features before you begin exploring.",
      image: "/home page with Terminal and AI.png",
      mascotPos: { left: "80%", top: "50%", x: "-50%", y: "-50%" },
      dialogPos: { left: "30%", top: "50%", x: "-50%", y: "-50%" },
      autoAdvanceMs: 5000,
    },
    {
      id: 3,
      mascot: "/left-point.png",
      title: "Interactive Terminal",
      message: (
        <div className="space-y-2">
          <p>We'll start with my favorite feature — the interactive terminal.</p>
          <p>The floating icon on the left allows you to access it from anywhere.</p>
        </div>
      ),
      image: "/home page with Terminal and AI.png",
      targetId: "terminal-toggle-container",
      mascotPos: { left: "20%", top: "50%", x: "-50%", y: "-50%" },
      dialogPos: { left: "50%", top: "50%", x: "-50%", y: "-50%" },
      onEnter: () => {
        const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
        if (api) {
          api.terminalClose();
        }
      },
      autoAdvanceMs: 6000,
    },
    {
      id: 4,
      mascot: "/exp2.png",
      title: "Seamless Navigation",
      message: (
        <div className="space-y-2">
          <p>You can use it to quickly navigate the portfolio, explore every section, and access information without searching through the page.</p>
          <p>Use your mouse, touch controls, keyboard shortcuts, or simply type commands directly.</p>
          {fakeTyping && (
            <div className="mt-3 bg-black/80 border border-cyber-blue p-2 rounded text-cyber-neon font-mono text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <span className="text-gray-400">C:\\Users\\Guest&gt;</span> {fakeTyping}<span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      ),
      image: "/help and info statements.png",
      targetId: "terminal-window",
      mascotPos: { left: "80%", top: "50%", x: "-50%", y: "-50%" },
      dialogPos: { left: "30%", top: "50%", x: "-50%", y: "-50%" },
      onEnter: () => {
        const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
        if (api) {
          api.terminalOpen(); 
          setTimeout(() => {
            simulateTyping("help", () => {
              // Just simulate typing to demonstrate, no execution.
            });
          }, 600);
        }
      },
      autoAdvanceMs: 6000,
    },
    {
      id: 5,
      mascot: "/idle.png",
      title: "Project Explorer",
      message: (
        <div className="space-y-2">
          <p>You can easily browse through my projects right from the terminal.</p>
          <p>It provides a quick overview of each project's tech stack and features.</p>
          {fakeTyping && (
            <div className="mt-3 bg-black/80 border border-cyber-blue p-2 rounded text-cyber-neon font-mono text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <span className="text-gray-400">C:\\Users\\Guest&gt;</span> {fakeTyping}<span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      ),
      image: "/projects in info.png",
      targetId: "terminal-window",
      mascotPos: { left: "80%", top: "50%", x: "-50%", y: "-50%" },
      dialogPos: { left: "30%", top: "50%", x: "-50%", y: "-50%" },
      onEnter: () => {
        const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
        if (api) {
          api.terminalOpen(); 
          setTimeout(() => {
            simulateTyping("projects", () => {
              // Just simulate typing to demonstrate, no execution.
            });
          }, 600);
        }
      },
      autoAdvanceMs: 6000,
    },
    {
      id: 6,
      mascot: "/right-point.png",
      title: "AI Assistant",
      message: "You'll also notice this AI assistant icon floating on the right. It's always ready to help you.",
      image: "/home page with Terminal and AI.png", 
      targetId: "assistant-toggle-container",
      mascotPos: { left: "75%", top: "50%", x: "-50%", y: "-50%" },
      dialogPos: { left: "30%", top: "50%", x: "-50%", y: "-50%" },
      onEnter: () => {
        const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
        if (api) {
          api.terminalClose();
          api.closeAssistant();
        }
      },
      autoAdvanceMs: 5000,
    },
    {
      id: 7,
      mascot: "/exp2.png",
      title: "Chat Interface",
      message: "Need more details? Just click on me. I can answer questions about my portfolio, retrieve project information, documentation, certifications, skills, resume details, and everything stored in my portfolio database.",
      image: "/Assistant.png",
      targetId: "assistant-window",
      mascotPos: { left: "80%", top: "50%", x: "-50%", y: "-50%" },
      dialogPos: { left: "30%", top: "50%", x: "-50%", y: "-50%" },
      onEnter: () => {
        const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
        if (api) {
          api.openAssistant();
        }
      },
      autoAdvanceMs: 7000,
    },
    {
      id: 8,
      mascot: "/up.png",
      title: "Global Navigation",
      message: "The navigation bar stays with you while you explore. You can quickly jump to any section of the portfolio from anywhere on the page.",
      image: "/home page with Terminal and AI.png",
      targetId: "top-nav",
      mascotPos: { left: "50%", top: "220px", x: "-50%", y: "-50%" },
      dialogPos: { left: "50%", top: "45%", x: "-50%", y: "-50%" },
      onEnter: () => {
        const api = (window as unknown as { portfolioAPI: any }).portfolioAPI;
        if (api) {
          api.closeAssistant();
        }
        window.dispatchEvent(new Event("force-show-nav"));
        window.scrollTo({ top: 100, behavior: "smooth" }); 
      },
      autoAdvanceMs: 5000,
    }
  ];


  useEffect(() => {
    eventBus.dispatch(EventTypes.TUTORIAL_STEP_CHANGED, { 
      stepIndex: currentStepIndex, 
      isActive: tutorialState === "active" 
    });

    if (tutorialState === "active") {
      document.body.classList.add("tutorial-active");
      const step = steps[currentStepIndex];
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFakeTyping("");
      if (typingInterval.current) clearInterval(typingInterval.current);
      
      if (step.targetId) {
        setTimeout(() => addSpotlight(step.targetId!), step.targetId === 'top-nav' ? 600 : 200);
      } else {
        removeSpotlight();
      }
      
      if (step.onEnter) {
        step.onEnter();
      }
      
      return () => {
        if (step.onExit) step.onExit();
      };
    } else {
      document.body.classList.remove("tutorial-active");
      removeSpotlight();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, tutorialState]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTutorial();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleChoice = (choice: "yes" | "no" | "skip") => {
    localStorage.setItem("portfolioTutorialStatus", choice);
    setTutorialPreference(choice);
    setHasSeenTutorial(true);
    if (choice === "yes") {
      setTutorialState("active");
      setCurrentStepIndex(0);
    } else {
      setTutorialState("idle");
    }
  };

  const startTour = () => {
    setTutorialState("active");
    setCurrentStepIndex(0);
  };

  const skipTour = () => {
    setTutorialState("idle");
    document.body.classList.remove("tutorial-active");
    removeSpotlight();
  };

  // removed early return to allow floating button to render

  return (
    <>
      <AnimatePresence>
        {tutorialState === "prompt" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md cursor-none [&_*]:cursor-none"
          >
            <div className="bg-cyber-dark border border-cyber-blue/50 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(0,195,255,0.25)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-blue via-cyber-cyan to-cyber-neon" />
              <h2 className="text-3xl font-orbitron text-white mb-3">👋 Welcome!</h2>
              <p className="text-gray-300 mb-5">Would you like a walkthrough of my portfolio?</p>
              <div className="text-xs text-cyber-blue font-mono mb-8 bg-cyber-blue/10 py-1.5 px-4 rounded-full inline-block shadow-[inset_0_0_10px_rgba(0,195,255,0.2)]">
                Estimated time ≈30 seconds
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleChoice("yes")}
                  style={{ cursor: "none" }}
                  className="w-full py-3 bg-cyber-blue/20 hover:bg-cyber-blue/40 text-cyber-blue border border-cyber-blue rounded-xl font-mono transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,195,255,0.5)]"
                >
                  Yes
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleChoice("no")}
                    style={{ cursor: "none" }}
                    className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl font-mono transition-all duration-300"
                  >
                    No
                  </button>
                  <button 
                    onClick={() => handleChoice("skip")}
                    style={{ cursor: "none" }}
                    className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-xl font-mono transition-all duration-300"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tutorialState === "active" && (
          <div className="fixed inset-0 z-[10001] pointer-events-none cursor-none [&_*]:cursor-none">
            
            <AnimatePresence mode="wait">
              {steps[currentStepIndex].image && (
                <motion.div
                  key={`bg-${currentStepIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-2 md:inset-12 flex items-center justify-center pointer-events-none z-10"
                >
                  <img 
                    src={steps[currentStepIndex].image} 
                    alt="Tutorial Screen" 
                    className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,195,255,0.4)] border border-cyber-blue/30"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ ...steps[currentStepIndex].mascotPos, opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 90 }}
              className="absolute pointer-events-auto z-50"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={steps[currentStepIndex].mascot}
                  src={steps[currentStepIndex].mascot}
                  alt="Mascot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain drop-shadow-[0_0_20px_rgba(0,195,255,0.6)]"
                />
              </AnimatePresence>
            </motion.div>

            {tutorialState === "active" && (
              <motion.div
                layout
                drag
                dragMomentum={false}
                whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ ...steps[currentStepIndex].dialogPos, opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 18, stiffness: 90 }}
                className="absolute w-[90vw] max-w-[300px] sm:max-w-[360px] md:max-w-[400px] bg-cyber-dark/90 backdrop-blur-xl border border-cyber-blue/40 p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,195,255,0.25)] pointer-events-auto z-50 cursor-grab"
                style={{
                  // Positioning handled by framer-motion layout
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-cyber-neon font-orbitron text-lg flex-1 tracking-wider">
                    {steps[currentStepIndex].title}
                  </h3>
                  <div className="text-xs text-cyber-blue/60 font-mono bg-cyber-blue/10 px-2 py-1 rounded-md">
                    {currentStepIndex + 1}/{steps.length}
                  </div>
                </div>
                
                <div className="text-gray-200 text-sm mb-6 leading-relaxed whitespace-pre-wrap font-sans">
                  {steps[currentStepIndex].message}
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-cyber-blue/20">
                  <button 
                    onClick={skipTour}
                    style={{ cursor: "none" }}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors font-mono"
                  >
                    Skip Tour
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrev}
                      disabled={currentStepIndex === 0}
                      style={{ cursor: "none" }}
                      className="p-2 bg-cyber-blue/10 hover:bg-cyber-blue/30 rounded-full text-cyber-blue disabled:opacity-30 disabled:hover:bg-cyber-blue/10 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={handleNext}
                      style={{ cursor: "none" }}
                      className="px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/40 text-cyber-blue border border-cyber-blue/50 rounded-full text-sm font-mono transition-colors flex items-center gap-1 shadow-[0_0_15px_rgba(0,195,255,0.2)]"
                    >
                      {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
                      {currentStepIndex < steps.length - 1 && <ChevronRight size={16} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {tutorialPreference && tutorialState === "idle" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={startTour}
            style={{ cursor: "none" }}
            className="fixed bottom-4 right-4 z-[9999] bg-cyber-dark/80 backdrop-blur-md border border-cyber-blue/50 text-cyber-blue px-3 py-2 rounded-full font-orbitron hover:bg-cyber-blue/20 hover:text-white transition-all shadow-[0_0_15px_rgba(0,195,255,0.2)] text-xs font-bold"
          >
            {tutorialPreference === "skip" ? "Tutorial" : "T"}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
