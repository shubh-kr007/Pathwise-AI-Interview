import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CareerHero3D from "./CareerHero3D";

export default function CareerIntro() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-black py-20 px-6 md:px-12 lg:px-24">
      {/* 🔮 True Black Space Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <CareerHero3D />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 w-fit backdrop-blur-md shadow-[0_0_20px_rgba(20,184,166,0.1)]">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-teal-300">
                AI-Powered Career Intelligence
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white">
                Master Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-500">
                  Career Forge
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium">
                Succeed with AI-driven mock interviews, precision resume intelligence, and custom-tailored professional paths.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <Link to="/interview">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 rounded-2xl bg-white text-black font-bold shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-3 transition-shadow hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                >
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/resume-analyzer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 rounded-2xl bg-teal-950/30 border border-teal-800 text-teal-100 font-bold backdrop-blur-xl hover:bg-teal-900/50 transition-all shadow-xl"
                >
                  Analyze Resume
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-slate-800/50">
               {[
                 { label: 'AI Mock Interviews', color: 'text-teal-400' },
                 { label: 'Resume Intelligence', color: 'text-cyan-400' },
                 { label: 'Career Roadmaps', color: 'text-blue-400' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-2 group">
                   <div className={`w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:scale-150 transition-transform`} />
                   <span className={`text-sm font-bold text-slate-500 group-hover:${item.color} transition-colors uppercase tracking-widest`}>{item.label}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
