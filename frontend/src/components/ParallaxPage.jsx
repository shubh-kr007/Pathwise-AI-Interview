"use client";
import React, { useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileScan, Bot, Map, TrendingUp, UploadCloud, Award, Quote, ArrowRight } from "lucide-react";

// Feature data
const features = [
  { id: 1, title: "Resume Analyzer", description: "Get instant, AI-powered feedback to optimize your resume and land more interviews.", Icon: FileScan, path: "/resume-analyzer" },
  { id: 2, title: "AI Mock Interviews", description: "Practice your interview skills with a realistic AI, covering both technical and behavioral questions.", Icon: Bot, path: "/interview" },
  { id: 3, title: "Personalized Roadmap", description: "Receive a custom learning path with curated resources to achieve your specific career goals.", Icon: Map, path: "/personalized-roadmap" },
  { id: 4, title: "Progress Tracker", description: "Visualize your growth with detailed analytics on your skills, interview performance, and progress.", Icon: TrendingUp, path: "/dashboard" },
];

export default function CareerLanding() {
  const navigate = useNavigate();
  const featuresRef = React.useRef(null);
  const inView = useInView(featuresRef, { amount: 0.1, once: false });

  return (
    <div className="w-full bg-[#020617] text-white overflow-x-hidden">
      {/* 🔹 Features Section */}
      <section
        ref={featuresRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 bg-[#020617] overflow-hidden"
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(13,148,136,0.1),transparent_70%)]" />
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center mb-12 md:mb-24 max-w-3xl"
        >
          <h2 className="text-2xl md:text-6xl font-extrabold tracking-tighter mb-4 md:mb-6">
            Elite <span className="text-teal-400">Toolkit</span> for Top Candidates
          </h2>
          <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed px-4 md:px-0">
            Every tool you need to outperform the competition, built with cutting-edge AI and advanced career logic.
          </p>
        </motion.div>

        <motion.div
          className="relative z-30 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {features.map((feature) => (
            <Card key={feature.id} feature={feature} navigate={navigate} />
          ))}
        </motion.div>
      </section>

      {/* 🆕 How It Works Section */}
      <HowItWorksSection />

      {/* 🆕 Final Call to Action Section */}
      <CTASection navigate={navigate} />
    </div>
  );
}

// 🪄 Feature Card Component (Sleek Professional Design)
const Card = ({ feature, navigate }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      onClick={() => feature.path && navigate(feature.path)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
      className="relative group bg-slate-950/40 backdrop-blur-2xl border border-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 cursor-pointer overflow-hidden transition-all duration-500 hover:border-teal-500/50 hover:shadow-[0_20px_80px_-20px_rgba(20,184,166,0.2)]"
    >
      {/* Internal Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-teal-600/5 to-blue-600/5 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 mb-10 rounded-2xl bg-[#0f172a] border border-teal-900/30 text-white shadow-inner shadow-white/5 group-hover:scale-110 group-hover:bg-teal-600 group-hover:border-teal-400 transition-all duration-500">
          <feature.Icon className="w-7 h-7" strokeWidth={1.5} />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl md:text-3xl font-bold text-white tracking-tighter leading-none group-hover:text-teal-400 transition-colors">
            {feature.title}
          </h3>
          <p className="text-slate-400 leading-relaxed text-sm md:text-lg font-medium group-hover:text-slate-200 transition-colors">
            {feature.description}
          </p>
        </div>

        <div className="mt-12 flex items-center gap-3 text-slate-500 group-hover:text-white font-black text-xs uppercase tracking-[0.3em] transition-all">
          <span className="w-8 h-[1px] bg-slate-800 group-hover:w-12 group-hover:bg-white transition-all" />
          <span>Launch Module</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

// 🆕 How It Works Section (Elevated Style)
const HowItWorksSection = () => {
  const steps = [
    { icon: UploadCloud, title: "Upload & Analysis", color: "bg-teal-500" },
    { icon: Bot, title: "Intelligent Practice", color: "bg-cyan-500" },
    { icon: Award, title: "Targeted Success", color: "bg-blue-500" },
  ];

  return (
    <section className="px-6 py-40 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-full h-[600px] bg-teal-600/5 -translate-y-1/2 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-black uppercase tracking-widest mb-8">
          The Process
        </div>
        <h2 className="text-3xl md:text-7xl font-black mb-8 md:mb-12 tracking-tighter text-white px-4 md:px-0">
          A Smarter Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Accelerate</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="group relative flex flex-col items-center"
            >
              <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-[2.5rem] rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                <div className={`absolute -top-4 -right-4 w-10 h-10 rounded-full ${step.color} text-white flex items-center justify-center font-black text-sm z-20`}>
                  {i + 1}
                </div>
                <step.icon size={40} className="text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{step.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xs mx-auto">
                Advanced AI algorithms decode your profile and build a bridge to your goals.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 🆕 Final CTA Section (Dynamic Gradient Style)
const CTASection = ({ navigate }) => {
  return (
    <section className="py-40 px-6 bg-[#020617] relative">
      <motion.div
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-6xl mx-auto overflow-hidden rounded-[4rem] bg-gradient-to-br from-teal-600 to-blue-900 p-1 md:p-2 shadow-[0_50px_100px_-20px_rgba(20,184,166,0.3)]"
      >
        <div className="bg-[#020617] rounded-[2rem] md:rounded-[3.8rem] p-8 md:p-32 relative overflow-hidden">
          {/* Animated Background Light */}
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] animate-pulse" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
             <h2 className="text-3xl md:text-8xl font-black text-white tracking-tighter mb-8 md:mb-10">
               Ready to <span className="text-teal-400 underline decoration-teal-500/30">Dominate</span> <br className="hidden md:block" /> Your Career?
             </h2>
             <p className="text-base md:text-xl text-slate-400 max-w-2xl mb-10 md:mb-16 leading-relaxed font-medium">
               Join 50,000+ candidates who have leveled up their careers with Pathwise precision.
             </p>
             
             <motion.button
               onClick={() => navigate('/interview')}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="group relative px-6 py-4 md:px-12 md:py-6 bg-white text-black rounded-2xl md:rounded-3xl font-black text-base md:text-xl flex items-center gap-4 hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-shadow"
             >
               Start Free Session
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-teal-600 flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                 <ArrowRight size={16} className="md:size-[20px]" />
               </div>
             </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};