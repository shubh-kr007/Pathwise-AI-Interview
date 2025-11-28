"use client";
import React, { useEffect, useState } from "react";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Book,
  Bot,
  FileText,
  LayoutGrid,
  TrendingUp,
  AlertCircle,
  Upload,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// --- Data helpers ---
function loadAttempts() {
  try {
    const raw = localStorage.getItem("interview_attempts_v1");
    const arr = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(arr) ? arr : [];
    const seen = new Set();
    const deduped = [];
    for (const a of list) {
      const key = `${a.type}|${a.mode}|${Math.round((a.timestamp || 0)/1000)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(a);
    }
    return deduped;
  } catch {
    return [];
  }
}

function aggregateByType(attempts) {
  const types = ["technical", "behavioral", "system-design"];
  const agg = Object.fromEntries(types.map((t) => [t, { count: 0, scores: [] }]));
  attempts.forEach((a) => {
    if (!agg[a.type]) return;
    agg[a.type].count += 1;
    if (typeof a.scorePercent === "number") agg[a.type].scores.push(a.scorePercent);
  });
  const typeAverages = types.map((t) => {
    const item = agg[t];
    const avg = item.scores.length
      ? Math.round(item.scores.reduce((s, v) => s + v, 0) / item.scores.length)
      : 0;
    const label = t === "system-design" ? "System Design" : t.charAt(0).toUpperCase() + t.slice(1);
    return { type: t, label, average: avg, attempts: item.count };
  });
  return typeAverages;
}

function recentFromAttempts(attempts) {
  const last = [...attempts]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map((a, i) => ({
      id: i + 1,
      type: a.type === "system-design" ? "System Design" : a.type.charAt(0).toUpperCase() + a.type.slice(1),
      date: new Date(a.timestamp).toLocaleString(),
      score: typeof a.scorePercent === "number" ? a.scorePercent : "—",
    }));
  return last;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const DashboardCard = ({ children, className }) => (
  <motion.div
    variants={itemVariants}
    className={`bg-white/5 border border-gray-800 rounded-2xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// ✅ Empty State Component
const EmptyStateCard = ({ icon: Icon, title, description, actionText, actionLink, navigate }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
    <Icon className="text-blue-400 mb-4" size={48} />
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 mb-4 max-w-md">{description}</p>
    {actionText && actionLink && (
      <button
        onClick={() => navigate(actionLink)}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg transition-all"
      >
        {actionText}
      </button>
    )}
  </div>
);

// ✅ Resume Upload Component (Inline)
const ResumeUploadSection = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume/analyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (response.ok) {
        alert('✅ Resume analyzed successfully! Reloading dashboard...');
        window.location.reload(); 
      } else {
        const err = await response.json();
        alert(`❌ Analysis failed: ${err.message}`);
      }
    } catch (err) {
      alert('❌ Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
          <Upload size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold">Analyze Your Resume</h3>
          <p className="text-sm text-gray-400">Get AI-powered insights instantly.</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 transition-colors"
        >
          {uploading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user, refreshUserData } = useAuth();
  const userName = user?.name || "there";
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState(() => loadAttempts());
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [resumeScore, setResumeScore] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setAttempts(loadAttempts());
      
      // Check resume status
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/resume/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setResumeAnalyzed(data.analyzed || false);
          setResumeScore(data.data?.score || null);
        }
      } catch (err) {
        console.error("Error checking resume status:", err);
      }
      
      setHydrated(true);
    };

    loadData();

    const onStorage = (e) => {
      if (e.key === 'interview_attempts_v1') setAttempts(loadAttempts());
    };
    const onUpdated = () => setAttempts(loadAttempts());
    
    window.addEventListener('storage', onStorage);
    window.addEventListener('attempts-updated', onUpdated);
    
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('attempts-updated', onUpdated);
    };
  }, []);

  // Refresh user data periodically
  useEffect(() => {
    if (refreshUserData) {
      refreshUserData();
    }
  }, [refreshUserData]);

  const typeAgg = aggregateByType(attempts);
  const recentInterviews = recentFromAttempts(attempts);
  const overallScores = attempts.filter(a => typeof a.scorePercent === 'number').map(a => a.scorePercent);
  const overallAverage = overallScores.length ? Math.round(overallScores.reduce((s,v)=>s+v,0)/overallScores.length) : 0;
  const totalInterviews = attempts.length;

  // Performance data
  const lastScores = overallScores.slice(-8);
  const startIndex = overallScores.length - lastScores.length;
  const performanceData = lastScores.map((score, idx) => ({ 
    name: `Attempt ${startIndex + idx + 1}`, 
    score 
  }));

  // Check if user is truly new (no resume, no interviews)
  const isNewUser = !resumeAnalyzed && totalInterviews === 0;
  const hasResume = resumeAnalyzed;
  const hasInterviews = totalInterviews > 0;

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 lg:p-8 mt-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-400 mt-1">
              {isNewUser 
                ? "Let's get started with your interview preparation journey."
                : "Here's your progress overview."
              }
            </p>
          </motion.div>

          {/* ✅ New User Onboarding */}
          {isNewUser && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-blue-400" size={28} />
                  Getting Started with Pathwise
                </h2>
                <p className="text-gray-300 mb-6">
                  Welcome to your journey! Follow these steps to get the most out of Pathwise:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div>
                        <h3 className="font-semibold mb-1">Upload Your Resume</h3>
                        <p className="text-sm text-gray-400 mb-3">Get AI-powered feedback and unlock your personalized roadmap</p>
                        <button
                          onClick={() => document.getElementById('resume-upload')?.scrollIntoView({ behavior: 'smooth' })}
                          className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          Upload Resume →
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div>
                        <h3 className="font-semibold mb-1">Practice Interviews</h3>
                        <p className="text-sm text-gray-400 mb-3">Start with a mock interview to build confidence</p>
                        <button
                          onClick={() => navigate('/interview')}
                          className="text-sm px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                          Start Interview →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ✅ Resume Analysis Section (Inline) */}
          {!hasResume && (
            <motion.div variants={itemVariants} className="mb-8" id="resume-upload">
              <DashboardCard>
                <ResumeUploadSection />
              </DashboardCard>
            </motion.div>
          )}

          {/* Resume Score Card (if analyzed) */}
          {hasResume && resumeScore && (
            <motion.div variants={itemVariants} className="mb-8">
              <DashboardCard className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <FileText className="text-blue-400" size={24} />
                      Resume Analysis Complete
                    </h3>
                    <p className="text-gray-400">Your resume has been analyzed successfully.</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${
                        resumeScore >= 80 ? 'text-green-400' : 
                        resumeScore >= 60 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        {resumeScore}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Score</div>
                    </div>
                    <button
                      onClick={() => navigate('/personalized-roadmap')}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg"
                    >
                      View Detailed Roadmap
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          )}

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Performance Chart */}
              {hasInterviews ? (
                <DashboardCard>
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="mr-3 h-5 w-5 text-purple-400" />
                    Performance Overview
                  </h2>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={performanceData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(31, 41, 55, 0.8)",
                            borderColor: "#4b5563",
                            backdropFilter: "blur(4px)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#a78bfa"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#8b5cf6" }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </DashboardCard>
              ) : (
                <DashboardCard>
                  <EmptyStateCard
                    icon={Bot}
                    title="No Interview Data Yet"
                    description="Complete your first mock interview to see your performance analytics and track your progress over time."
                    actionText="Start Your First Interview"
                    actionLink="/interview"
                    navigate={navigate}
                  />
                </DashboardCard>
              )}

              {/* Recent Activity */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Book className="mr-3 h-5 w-5 text-purple-400" />
                  Recent Activity
                </h2>
                {hasInterviews ? (
                  <ul className="space-y-4">
                    {recentInterviews.map((interview) => (
                      <li
                        key={interview.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-default"
                      >
                        <div>
                          <p className="font-medium">{interview.type} Interview</p>
                          <p className="text-sm text-gray-400">{interview.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-purple-400">
                            {interview.score}
                          </p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="mb-2">No recent activity</p>
                    <p className="text-sm">Your completed interviews will appear here</p>
                  </div>
                )}
              </DashboardCard>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              {/* Interview Strengths */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <LayoutGrid className="mr-3 h-5 w-5 text-purple-400" />
                  Interview Strengths
                </h2>
                {hasInterviews ? (
                  <div className="space-y-4">
                    {typeAgg.map((t) => (
                      <div key={t.type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="font-medium">{t.label}</div>
                        <div className="text-right">
                          <div className="text-purple-400 font-bold">{t.average}%</div>
                          <div className="text-xs text-gray-500">{t.attempts} {t.attempts === 1 ? 'attempt' : 'attempts'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">Complete interviews to see your strengths by category</p>
                  </div>
                )}
              </DashboardCard>

              {/* Your Stats */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart className="mr-3 h-5 w-5 text-purple-400" />
                  Your Stats
                </h2>
                <div className="space-y-3">
                  <p className="flex justify-between">
                    <span className="text-gray-400">Interviews Completed</span>
                    <span className="font-bold">{totalInterviews}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Average Score</span>
                    <span className="font-bold">{overallAverage}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-400">Resume Analyzed</span>
                    <span className={`font-bold flex items-center gap-1 ${hasResume ? 'text-green-400' : ''}`}>
                      {hasResume ? <><CheckCircle size={14} /> Yes</> : 'No'}
                    </span>
                  </p>
                </div>
              </DashboardCard>

              {/* Progress Tracker */}
              <DashboardCard>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-3 h-5 w-5 text-purple-400" />
                  Progress Tracker
                </h2>
                <div className="space-y-4">
                  {hasInterviews ? (
                    <>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Technical Skills</span>
                          <span className="text-sm font-bold">{Math.min(100, Math.round((overallAverage * 1.1)))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                            style={{ width: `${Math.min(100, Math.round((overallAverage * 1.1)))}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Communication</span>
                          <span className="text-sm font-bold">{Math.min(100, Math.round((overallAverage * 0.9)))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" 
                            style={{ width: `${Math.min(100, Math.round((overallAverage * 0.9)))}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Problem Solving</span>
                          <span className="text-sm font-bold">{Math.min(100, Math.round((overallAverage * 1.05)))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                            style={{ width: `${Math.min(100, Math.round((overallAverage * 1.05)))}%` }}
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Progress bars will appear after your first interview</p>
                    </div>
                  )}
                </div>
              </DashboardCard>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/interview')}
                className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-all text-left group"
              >
                <Bot className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold mb-1">Practice Interview</h3>
                <p className="text-sm text-gray-400">Start a new mock interview session</p>
              </button>
              
              <button
                onClick={() => navigate('/resume-analyzer')}
                className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl hover:border-green-500/40 transition-all text-left group"
              >
                <FileText className="text-green-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold mb-1">Full Resume Analysis</h3>
                <p className="text-sm text-gray-400">Detailed report & feedback</p>
              </button>
              
              <button
                onClick={() => navigate('/personalized-roadmap')}
                className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all text-left group"
              >
                <TrendingUp className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-bold mb-1">Career Roadmap</h3>
                <p className="text-sm text-gray-400">
                  {hasResume ? 'View your personalized plan' : 'Upload resume to unlock'}
                </p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}