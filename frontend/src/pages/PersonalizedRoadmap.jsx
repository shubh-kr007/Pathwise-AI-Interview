import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DEFAULT_ROADMAP = [
  { title: "Fundamentals", desc: "Learn core concepts." },
  { title: "Advanced Topics", desc: "Deep dive into specifics." },
  { title: "Projects", desc: "Build real-world apps." }
];

export default function PersonalizedRoadmap() {
  const [role, setRole] = useState("General Learner");
  const [roadmap, setRoadmap] = useState(DEFAULT_ROADMAP);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/resume/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.data?.detectedRole) {
        setRole(data.data.detectedRole);
        // Generate simple roadmap based on role (Logic can be expanded)
        setRoadmap([
          { title: `${data.data.detectedRole} Basics`, desc: "Master the essentials." },
          { title: "Frameworks & Tools", desc: "Learn industry standards." },
          { title: "Interview Prep", desc: "Mock interviews & System Design." }
        ]);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">
          Your Roadmap: {role}
        </h1>
        <p className="text-slate-400 mb-12">Personalized based on your resume analysis.</p>

        <div className="space-y-8 relative border-l-2 border-slate-700 ml-4 pl-8">
          {roadmap.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.2 }} className="relative">
              <span className="absolute -left-[41px] top-0 w-6 h-6 bg-sky-500 rounded-full border-4 border-bg-primary"></span>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-slate-400 bg-bg-secondary p-4 rounded-xl border border-slate-700">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}