"use client";
import React, { useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileScan, Bot, Map, TrendingUp, UploadCloud, Award, Quote } from "lucide-react";

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
  const inView = useInView(featuresRef, { amount: 0.2, once: false });

  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="w-full bg-black text-white overflow-x-hidden">
      {/* 🔹 Features Section */}
      <section
        ref={featuresRef}
        className="relative min-h-screen flex items-center justify-center px-6 py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
      >
        <div className="pointer-events-none absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/200 to-transparent z-20"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-black via-black/70 to-transparent"></div>

        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>

        <motion.div
          className="relative z-30 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
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

// 🪄 Feature Card Component (Preserved as requested)
const Card = ({ feature, navigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div
      variants={cardVariants}
      onClick={() => feature.path && navigate(feature.path)}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 cursor-pointer overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(204, 51, 255, 0.15), transparent 80%)`,
        }}
      />

      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-fuchsia-800 to-cyan-600 text-white shadow-lg shadow-fuchsia-500/50 group-hover:shadow-xl group-hover:shadow-cyan-500/50 transition-shadow duration-500"
        >
          <feature.Icon className="w-8 h-8" strokeWidth={2} />
        </motion.div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white tracking-tight">{feature.title}</h3>
          <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
        </div>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className="absolute bottom-8 right-8 text-gray-500 group-hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 group-hover:w-full transition-all duration-500 ease-out"></div>
    </motion.div>
  );
};

// 🆕 How It Works Section (Upgraded)
const HowItWorksSection = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const steps = [
    { icon: UploadCloud, title: "Upload & Analyze", description: "Submit your resume for an instant, in-depth analysis against industry standards." },
    { icon: Bot, title: "Practice & Improve", description: "Engage in realistic AI mock interviews that adapt to your skill level." },
    { icon: Award, title: "Track & Succeed", description: "Monitor your progress and walk into your next interview fully prepared to impress." },
  ];

  return (
    <section ref={ref} className="px-6 py-32 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.7 }} className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          A Smarter Way to Prepare
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-gray-400 max-w-2xl mx-auto mb-20 text-lg">
          Follow three simple steps to transform your job readiness.
        </motion.p>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative flex items-center justify-center w-24 h-24 mb-8 rounded-2xl bg-gray-900 border border-white/10 shadow-xl shadow-violet-500/10 group hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <step.icon size={32} className="text-white relative z-10" />
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-sm font-bold text-gray-400">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 🆕 Final CTA Section (Upgraded)
const CTASection = ({ navigate }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <section ref={ref} className="py-32 px-6 bg-black relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] mask-image-gradient-to-b from-black via-transparent to-transparent"></div>

      <motion.div
        className="relative max-w-5xl mx-auto text-center bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-[2.5rem] p-12 md:p-20 overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-violet-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Start your journey today
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">
            Ready to Secure Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Dream Job?</span>
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
            Stop guessing and start preparing with data-driven insights. Join thousands of candidates who are acing their interviews.
          </p>

          <motion.button
            onClick={() => navigate('/interview')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started for Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};