import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CareerHero3D from "./CareerHero3D";

export default function CareerIntro() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-bg-primary py-20 px-6 md:px-12 lg:px-24">

      {/* Full Screen 3D Background */}
      <CareerHero3D />

      {/* Background Gradients (Optional - can be removed if 3D scene is enough, but kept for extra glow) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Pointer events auto to allow clicking */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-gray-300">
                AI-Powered Career Growth
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Unlock Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">
                Dream Career
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Master interviews, optimize your resume, and get a personalized
              roadmap to success with our advanced AI tools. Elevate your
              professional journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/interview">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold backdrop-blur-sm flex items-center justify-center cursor-pointer"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                <span>AI Mock Interviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                <span>Resume Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-teal-400" />
                <span>Personalized Roadmap</span>
              </div>
            </div>
          </motion.div>

          {/* Empty Right Column - The 3D element is now in the background, positioned to appear here */}
          <div className="hidden lg:block"></div>
        </div>
      </div>
    </section>
  );
}
