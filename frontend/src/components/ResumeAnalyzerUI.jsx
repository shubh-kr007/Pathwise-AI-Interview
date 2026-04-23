import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Cpu,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  ShieldCheck,
  FileText,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Award,
  TrendingUp,
  Brain,
  Rocket
} from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

export default function ResumeAnalyzerUI({
  file,
  analysis,
  loading,
  error,
  activeTab,
  setActiveTab,
  onFileChange,
  onUpload,
  onReset,
  onNavigateToRoadmap,
  getScoreColor,
  getATSScoreColor,
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
        {/* Header Section */}
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6"
          >
            <Cpu size={16} />
            <span>Powered by Llama Intelligence</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent"
          >
            Resume Intelligence <br />
            <span className="text-blue-500">Engine</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg lg:text-xl"
          >
            Deep document parsing and strategic career analysis using state-of-the-art 
            Llama models. Decode your market value in seconds.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const f = e.dataTransfer.files[0];
                  if (f) onFileChange(f);
                }}
                className={`relative group rounded-[32px] p-12 border-2 border-dashed transition-all duration-500 ${
                  isDragging ? "bg-blue-600/10 border-blue-500 scale-105" : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Upload Professional Resume</h3>
                  <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                    Strictly accepts <span className="text-white font-bold">PDF, DOCX or DOC</span>. 
                    Unsupported formats will be rejected by the Llama Intelligence core.
                  </p>

                  <input
                    type="file"
                    className="hidden"
                    id="resume-file"
                    onChange={(e) => onFileChange(e.target.files[0])}
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="resume-file"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-blue-500 hover:text-white transition-all cursor-pointer shadow-xl shadow-white/5"
                  >
                    Select Resume File <ChevronRight size={18} />
                  </label>
                </div>
              </div>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                      <FileText className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => onFileChange(null)} className="text-gray-500 hover:text-red-400">
                    Remove
                  </button>
                </motion.div>
              )}

              <button
                onClick={onUpload}
                disabled={!file || loading}
                className="w-full mt-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={24} />
                ) : (
                  <>
                    <Zap size={24} />
                    <span>Initialize Deep Analysis</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
                  <AlertCircle size={20} />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Score Dashboard */}
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Strategy Assessment</h2>
                      <p className="text-gray-400">{analysis.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </div>
                      <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">Strategic Index</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.score}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </Card>

                <Card className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="text-purple-400" size={32} />
                  </div>
                  <div className={`text-4xl font-bold mb-1 ${getATSScoreColor(analysis.atsAnalysis?.score)}`}>
                    {analysis.atsAnalysis?.score}%
                  </div>
                  <p className="text-gray-400 font-medium">ATS Resilience</p>
                  <p className="text-xs text-gray-500 mt-2 italic px-4">"{analysis.atsAnalysis?.feedback?.slice(0, 80)}..."</p>
                </Card>
              </div>

              {/* Core Attributes */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Target, label: "Target Role", value: analysis.detectedRole, color: "blue" },
                  { icon: Award, label: "Experience", value: analysis.experienceLevel, color: "purple" },
                  { icon: TrendingUp, label: "Market Fit", value: analysis.industryInsights?.marketCompetitiveness, color: "green" },
                  { icon: Brain, label: "Intelligence", value: "Verified", color: "blue" }
                ].map((item, i) => (
                  <Card key={i} className="flex flex-col items-center text-center py-4">
                    <item.icon className="text-gray-500 mb-2" size={20} />
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-tighter">{item.label}</p>
                    <p className="font-bold text-sm">{item.value}</p>
                  </Card>
                ))}
              </div>

              {/* Detail Tabs */}
              <div className="flex gap-4 overflow-x-auto pb-4 sticky top-24 z-20 bg-[#050505]/80 backdrop-blur-md py-2">
                {["Overview", "Keywords", "Roadmap", "Market"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.toLowerCase() ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === "overview" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-blue-400" size={20} /> Strategic Assets
                      </h3>
                      <div className="space-y-3">
                        {analysis.strengths?.map((s, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                            <p className="text-sm text-gray-300">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2 text-red-400">
                        <AlertCircle size={20} /> Optimization Required
                      </h3>
                      <div className="space-y-3">
                        {analysis.weaknesses?.map((w, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                            <div className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                            <p className="text-sm text-gray-300">{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "keywords" && (
                  <Card className="space-y-8">
                    <div>
                      <h4 className="text-gray-400 text-sm mb-4">Detected Industry Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords?.present?.map((kw, i) => (
                          <Badge key={i} color="blue">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm mb-4">Critical Missing Targets</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keywords?.missing?.map((kw, i) => (
                          <Badge key={i} color="red">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {activeTab === "roadmap" && (
                  <div className="space-y-4">
                    {analysis.roadmap?.map((phase, i) => (
                      <Card key={i} className="flex gap-6 items-start">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-1">{phase.title}</h4>
                          <p className="text-gray-400 text-sm mb-4">{phase.desc}</p>
                          <div className="flex flex-wrap gap-2">
                            {phase.milestones?.map((m, j) => (
                              <Badge key={j} color="purple">{m}</Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === "market" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <h4 className="text-gray-400 text-sm mb-4">Salary Expectation</h4>
                      <div className="text-3xl font-bold text-green-400">{analysis.industryInsights?.salaryRange}</div>
                      <p className="text-xs text-gray-500 mt-2">Adjusted for current market trends and your experience level.</p>
                    </Card>
                    <Card>
                      <h4 className="text-gray-400 text-sm mb-4">Immediate Actions</h4>
                      <div className="space-y-2">
                        {analysis.improvements?.map((imp, i) => (
                          <p key={i} className="text-sm font-medium flex items-center gap-2">
                            <ChevronRight size={14} className="text-blue-500" /> {imp}
                          </p>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onNavigateToRoadmap}
                  className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/5"
                >
                  <Rocket size={20} /> Launch Career Map
                </button>
                <button
                  onClick={onReset}
                  className="px-10 py-4 border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Re-parse Document
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
