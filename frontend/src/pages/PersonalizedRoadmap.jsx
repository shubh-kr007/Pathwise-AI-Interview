// src/pages/PersonalizedRoadmap.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE } from "../config/api";

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
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/resume/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return;

        const data = await res.json();
        
        if (data.data?.detectedRole) {
          const detectedRole = data.data.detectedRole;
          setRole(detectedRole);

          // Simple role-based roadmap – extend this as needed
          setRoadmap([
            { title: `${detectedRole} Basics`, desc: "Master the core fundamentals for this role." },
            { title: "Frameworks & Tools", desc: "Learn the frameworks, tools, and ecosystem commonly used." },
            { title: "Projects & Portfolio", desc: "Build real-world projects and showcase them in your portfolio." },
            { title: "Interview Prep", desc: "Practice role-specific interview questions and system design." },
          ]);
        }
      } catch (err) {
        console.error("Error fetching resume status for roadmap:", err);
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
        <p className="text-slate-400 mb-12">
          Personalized based on your resume analysis.
        </p>

        <div className="space-y-8 relative border-l-2 border-slate-700 ml-4 pl-8">
          {roadmap.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <span className="absolute -left-[41px] top-0 w-6 h-6 bg-sky-500 rounded-full border-4 border-bg-primary"></span>
              <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
              <p className="text-slate-400 bg-bg-secondary p-4 rounded-xl border border-slate-700">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}