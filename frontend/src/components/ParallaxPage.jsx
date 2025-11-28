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
        <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-fuchsia-600/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-cyan-600/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

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

// 🪄 Feature Card Component
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

// 🆕 How It Works Section
const HowItWorksSection = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });
  const steps = [
    { icon: UploadCloud, title: "Upload & Analyze", description: "Submit your resume for an instant, in-depth analysis against industry standards." },
    { icon: Bot, title: "Practice & Improve", description: "Engage in realistic AI mock interviews that adapt to your skill level." },
    { icon: Award, title: "Track & Succeed", description: "Monitor your progress and walk into your next interview fully prepared to impress." },
  ];

  return (
    <section ref={ref} className="px-6 py-24 bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 initial={{opacity: 0, y: 40}} animate={inView ? {opacity: 1, y: 0} : {opacity: 0, y: 40}} transition={{duration: 0.7}} className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            A Smarter Way to Prepare
        </motion.h2>
        <motion.p initial={{opacity: 0, y: 40}} animate={inView ? {opacity: 1, y: 0} : {opacity: 0, y: 40}} transition={{duration: 0.7, delay: 0.1}} className="text-gray-400 max-w-2xl mx-auto mb-16">
            Follow three simple steps to transform your job readiness.
        </motion.p>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{opacity: 0, y: 50}}
              animate={inView ? {opacity: 1, y: 0} : {opacity: 0, y: 50}}
              transition={{duration: 0.5, delay: index * 0.2}}
              className="p-8 border border-white/10 rounded-2xl bg-gray-900/50 z-10 text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-white mx-auto shadow-lg shadow-fuchsia-500/40">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 🆕 Final CTA Section
const CTASection = ({ navigate }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <section ref={ref} className="py-24 px-6 bg-black">
      <motion.div
        className="relative max-w-4xl mx-auto text-center bg-gray-900/50 border border-white/10 rounded-2xl p-10 md:p-16 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-fuchsia-600/40 to-transparent blur-3xl rounded-full animate-pulse"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Secure Your Dream Job?</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Stop guessing and start preparing with data-driven insights. Your next career move is just a click away.
          </p>
          <motion.button
            onClick={() => navigate('/interview')}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(0, 255, 255, 0.4)"}}
            whileTap={{ scale: 0.95 }}
            transition={{type: "spring", stiffness: 200, damping: 15}}
            className="relative group px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-500 rounded-full font-semibold shadow-lg overflow-hidden"
          >
            <span className="absolute inset-0 block w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
            <span className="relative">Get Started for Free</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};