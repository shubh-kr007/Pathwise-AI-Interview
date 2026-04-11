// src/pages/PersonalizedRoadmap.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_BASE } from "../config/api";
import {
  Target,
  CheckCircle,
  BookOpen,
  Code,
  Briefcase,
  TrendingUp,
  Award,
  Calendar,
  ExternalLink,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

export default function PersonalizedRoadmap() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your roadmap");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/resume/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch resume analysis");
        }

        const data = await res.json();

        if (data.analyzed && data.data) {
          setAnalysis(data.data);
        } else {
          setError("No resume analysis found. Please analyze your resume first.");
        }
      } catch (err) {
        console.error("Error fetching resume analysis:", err);
        setError(err.message || "Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  // Generate dynamic roadmap based on analysis
  const generateDynamicRoadmap = () => {
    if (!analysis) return [];

    const roadmap = [];
    const detectedRole = analysis.detectedRole || "Software Developer";
    const experienceLevel = analysis.experienceLevel || "Entry Level";
    const criticalWeaknesses = analysis.criticalWeaknesses || [];
    const improvements = analysis.improvements || [];
    const keywords = analysis.keywords?.missing || [];
    const atsScore = analysis.atsCompatibility || analysis.atsAnalysis?.score || 0;

    // Phase 1: Immediate Fixes (Weeks 1-2)
    roadmap.push({
      title: "Phase 1: Critical Fixes & Resume Optimization",
      duration: "Weeks 1-2",
      desc: "Address critical weaknesses and improve ATS compatibility immediately",
      icon: AlertCircle,
      color: "red",
      milestones: [
        ...criticalWeaknesses.slice(0, 2).map((w) => `Fix: ${w}`),
        atsScore < 60 ? "Improve ATS score to 70+" : "Optimize resume formatting",
        "Add missing contact information if needed",
      ],
      resources: [
        "Resume templates (ATS-friendly)",
        "Action verb list for resume writing",
        "ATS keyword optimization guide",
      ],
      priority: "High",
    });

    // Phase 2: Skill Development (Weeks 3-8)
    const skillGaps = keywords.slice(0, 5);
    if (skillGaps.length > 0 || improvements.length > 0) {
      roadmap.push({
        title: `Phase 2: Skill Development & ${detectedRole} Fundamentals`,
        duration: "Weeks 3-8",
        desc: `Build core skills for ${detectedRole} role and address identified gaps`,
        icon: BookOpen,
        color: "blue",
        milestones: [
          ...skillGaps.map((skill) => `Learn: ${skill}`),
          "Complete 2-3 hands-on projects",
          "Build portfolio showcasing new skills",
        ],
        resources: [
          `${detectedRole} learning path (freeCodeCamp/Udemy)`,
          "Official documentation and tutorials",
          "Practice platforms (LeetCode, HackerRank)",
        ],
        priority: "High",
      });
    }

    // Phase 3: Advanced Skills & Projects (Weeks 9-16)
    roadmap.push({
      title: "Phase 3: Advanced Skills & Real-World Projects",
      duration: "Weeks 9-16",
      desc: `Develop advanced ${detectedRole} skills and build impressive portfolio projects`,
      icon: Code,
      color: "purple",
      milestones: [
        `Master advanced ${detectedRole} concepts`,
        "Build 2-3 production-ready projects",
        "Contribute to open-source projects",
        "Deploy projects with live demos",
      ],
      resources: [
        "Advanced courses and certifications",
        "GitHub for version control",
        "Cloud platforms (AWS, Vercel, Netlify)",
        "Technical blogs and communities",
      ],
      priority: "Medium",
    });

    // Phase 4: Professional Development (Weeks 17-24)
    roadmap.push({
      title: "Phase 4: Professional Development & Networking",
      duration: "Weeks 17-24",
      desc: "Enhance professional presence and prepare for job applications",
      icon: Briefcase,
      color: "green",
      milestones: [
        "Optimize LinkedIn profile with keywords",
        "Network with industry professionals",
        "Attend tech meetups or webinars",
        "Get recommendations and endorsements",
      ],
      resources: [
        "LinkedIn optimization guide",
        "Networking strategies",
        "Tech communities (Dev.to, Reddit)",
        "Industry-specific forums",
      ],
      priority: "Medium",
    });

    // Phase 5: Interview Preparation (Weeks 25-32)
    roadmap.push({
      title: "Phase 5: Interview Preparation & Job Search",
      duration: "Weeks 25-32",
      desc: `Prepare for ${detectedRole} interviews and start applying`,
      icon: Target,
      color: "yellow",
      milestones: [
        `Practice ${detectedRole}-specific interview questions`,
        "Complete mock interviews",
        "Build interview question bank",
        "Apply to 50+ relevant positions",
      ],
      resources: [
        "Interview preparation platforms",
        "System design resources",
        "Behavioral interview guides",
        "Job boards (LinkedIn, Indeed, AngelList)",
      ],
      priority: "High",
    });

    // Use AI-generated roadmap if available, otherwise use dynamic one
    if (analysis.roadmap && Array.isArray(analysis.roadmap) && analysis.roadmap.length > 0) {
      return analysis.roadmap.map((phase, index) => ({
        ...phase,
        icon: [AlertCircle, BookOpen, Code, Briefcase, Target][index] || Target,
        color: ["red", "blue", "purple", "green", "yellow"][index] || "blue",
        priority: index < 2 ? "High" : index < 3 ? "Medium" : "Low",
      }));
    }

    return roadmap;
  };

  const roadmap = generateDynamicRoadmap();
  const detectedRole = analysis?.detectedRole || "Software Developer";
  const experienceLevel = analysis?.experienceLevel || "Entry Level";
  const resumeScore = analysis?.score || 0;
  const atsScore = analysis?.atsCompatibility || analysis?.atsAnalysis?.score || 0;

  const getColorClasses = (color) => {
    const colors = {
      red: "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-300",
      blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
      purple: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
      green: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300",
      yellow: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      red: "text-red-400",
      blue: "text-blue-400",
      purple: "text-purple-400",
      green: "text-green-400",
      yellow: "text-yellow-400",
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Roadmap Available</h2>
          <p className="text-gray-400 mb-6">{error || "Please analyze your resume first to generate a personalized roadmap."}</p>
          <a
            href="/resume-analyzer"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Analyze Resume
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-400" size={40} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Your Personalized Roadmap
            </h1>
          </div>
          <p className="text-gray-400 text-xl mb-6">
            Tailored specifically for your {detectedRole} journey
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Detected Role</div>
              <div className="text-xl font-bold text-blue-400">{detectedRole}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Experience Level</div>
              <div className="text-xl font-bold text-purple-400">{experienceLevel}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">Resume Score</div>
              <div className="text-xl font-bold text-green-400">{resumeScore}/100</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gray-400 mb-1">ATS Score</div>
              <div className="text-xl font-bold text-yellow-400">{atsScore}/100</div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />

          <div className="space-y-12">
            {roadmap.map((phase, index) => {
              const IconComponent = phase.icon || Target;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative pl-24"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-0">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getColorClasses(phase.color)} border-4 border-gray-900 flex items-center justify-center shadow-xl`}>
                      <IconComponent className={`${getIconColor(phase.color)}`} size={24} />
                    </div>
                  </div>

                  {/* Phase Card */}
                  <div className={`bg-gradient-to-br ${getColorClasses(phase.color)} backdrop-blur-xl rounded-2xl p-8 border-2 shadow-2xl hover:scale-[1.02] transition-transform`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold">{phase.title}</h3>
                          {phase.priority === "High" && (
                            <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300 font-semibold">
                              High Priority
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{phase.duration || phase.title}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{phase.desc}</p>
                      </div>
                    </div>

                    {/* Milestones */}
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle size={18} className={getIconColor(phase.color)} />
                          Key Milestones
                        </h4>
                        <ul className="space-y-2">
                          {phase.milestones.map((milestone, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 + i * 0.1 }}
                              className="flex items-start gap-2 text-sm text-gray-300"
                            >
                              <ArrowRight size={16} className={`${getIconColor(phase.color)} mt-0.5 flex-shrink-0`} />
                              <span>{milestone}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resources */}
                    {phase.resources && phase.resources.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <BookOpen size={18} className={getIconColor(phase.color)} />
                          Recommended Resources
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((resource, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.2 + i * 0.05 }}
                              className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-xs text-gray-300 hover:border-gray-600 transition-all flex items-center gap-1"
                            >
                              {resource}
                              <ExternalLink size={12} />
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: roadmap.length * 0.2 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
            <p className="text-gray-400 mb-6">
              Follow this roadmap step by step to achieve your career goals as a {detectedRole}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/resume-analyzer"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                <TrendingUp size={18} />
                Re-analyze Resume
              </a>
              <a
                href="/dashboard"
                className="px-6 py-3 border-2 border-gray-600 hover:border-gray-500 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <Briefcase size={18} />
                Back to Dashboard
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
