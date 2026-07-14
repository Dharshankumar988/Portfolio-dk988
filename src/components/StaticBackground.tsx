"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { eventBus, EventTypes } from "@/lib/eventBus";

const IMAGES = [
  "/bg/1.jpg",
  "/bg/2.jpg",
  "/bg/3.jpg",
  "/bg/4.jpg",
  "/bg/5.jpg",
  "/bg/6.jpg"
];

export default function StaticBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  useEffect(() => {
    const unsub = eventBus.subscribe(EventTypes.TUTORIAL_STEP_CHANGED, ({ stepIndex, isActive }) => {
      setIsTutorialActive(isActive);
      if (isActive) {
        // Map 7 tutorial steps to 6 images (step 7 can just reuse the 6th image)
        setCurrentIndex(Math.min(stepIndex, 5));
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (isTutorialActive) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(timer);
  }, [isTutorialActive]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Background"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
