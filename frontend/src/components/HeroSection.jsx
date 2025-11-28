"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LightRays from "./LightRays"; // ✅ Import LightRays

// Animation variants for the main container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

// Variants for line and text
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

// Word animation
const wordVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const handleGetStarted = () => navigate("/interview");
  const handleLearnMore = () => navigate("/learn-more");

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black px-4">
      {/* 🔆 LightRays Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>

      {/* ✨ Foreground Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-5xl w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-bold drop-shadow-2xl leading-tight tracking-tight whitespace-nowrap
                     text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
        >
          <motion.span variants={wordVariants} className="block">
            Crack Your Interview
          </motion.span>

          <motion.span variants={wordVariants} className="block mt-2">
            with{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI
            </span>
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-lg sm:text-xl md:text-2xl opacity-90 max-w-2xl mx-auto px-4"
        >
          Practice HR, Technical, and Behavioral interviews with real-time
          feedback. Track your progress and boost your confidence 🚀
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-lg font-semibold shadow-lg transition cursor-pointer w-full sm:w-auto"
            onClick={handleGetStarted}
          >
           Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg text-white border border-gray-400 hover:border-white rounded-2xl font-semibold shadow-md transition cursor-pointer w-full sm:w-auto"
            onClick={handleLearnMore}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
