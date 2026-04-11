import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Loader,
  Sparkles,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertCircle,
  FileText,
  Target,
  BarChart3,
  Shield,
  Eye,
  AlertTriangle,
  FileCheck,
  Download,
  RefreshCw,
} from "lucide-react";

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
  getScoreBg,
  getATSScoreColor,
  getATSScoreBg,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || 
        droppedFile.name.endsWith(".doc") || 
        droppedFile.name.endsWith(".docx"))) {
      onFileChange(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="relative">
              <Sparkles className="text-blue-400" size={48} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-blue-400/30 rounded-full"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              ATS Resume Analyzer
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Get comprehensive ATS compatibility analysis with real-time scoring,
            keyword optimization, and actionable insights to land more interviews.
          </motion.p>
        </motion.div>

        {/* Upload Section */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative p-10 rounded-3xl shadow-2xl backdrop-blur-xl border-2 transition-all duration-300 ${
                isDragging
                  ? "bg-blue-500/20 border-blue-400 scale-105"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Upload Area */}
              <div className="text-center mb-6">
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30 mb-4"
                >
                  <Upload
                    className={`${isDragging ? "text-blue-400" : "text-gray-400"}`}
                    size={40}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Upload Your Resume</h3>
                <p className="text-gray-400 mb-4">
                  Drag and drop your resume here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX files (Max 5MB)
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInputChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all cursor-pointer text-center"
              >
                <FileCheck className="inline-block mr-2" size={20} />
                Choose File
              </label>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-400" size={24} />
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onFileChange(null)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              <button
                onClick={onUpload}
                disabled={loading || !file}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={24} />
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-400 text-sm backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Main Score Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Resume Score */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Target className="text-blue-400" size={28} />
                        Overall Resume Score
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>
                    <div className="text-center ml-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className={`text-7xl font-extrabold ${getScoreColor(
                          analysis.score
                        )}`}
                      >
                        {analysis.score}
                      </motion.div>
                      <div className="text-gray-400 text-sm mt-1">out of 100</div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.score}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${getScoreBg(
                        analysis.score
                      )} shadow-lg`}
                    />
                  </div>
                </div>
              </motion.div>

              {/* ATS Compatibility Score */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Shield className="text-green-400" size={28} />
                        ATS Compatibility
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Applicant Tracking System Score
                      </p>
                    </div>
                    <div className="text-center ml-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className={`text-7xl font-extrabold ${getATSScoreColor(
                          analysis.atsCompatibility || analysis.atsAnalysis?.score
                        )}`}
                      >
                        {analysis.atsCompatibility || analysis.atsAnalysis?.score}
                      </motion.div>
                      <div className="text-gray-400 text-sm mt-1">out of 100</div>
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          analysis.atsCompatibility || analysis.atsAnalysis?.score
                        }%`,
                      }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      className={`h-full bg-gradient-to-r ${getATSScoreBg(
                        analysis.atsCompatibility || analysis.atsAnalysis?.score
                      )} shadow-lg`}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ATS Score Breakdown */}
            {analysis.atsAnalysis?.breakdown && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl"
              >
                <h4 className="font-bold mb-6 flex items-center gap-3 text-xl">
                  <BarChart3 className="text-purple-400" size={24} />
                  ATS Score Breakdown
                </h4>
                <div className="grid md:grid-cols-5 gap-4">
                  {Object.entries(analysis.atsAnalysis.breakdown).map(
                    ([category, score], index) => {
                      const maxScore = {
                        formatting: 20,
                        keywords: 25,
                        structure: 20,
                        content: 25,
                        contact: 10,
                      }[category] || 20;
                      const percentage = (score / maxScore) * 100;
                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-gray-600 transition-all hover:scale-105"
                        >
                          <div className="text-sm text-gray-400 mb-3 capitalize font-medium">
                            {category}
                          </div>
                          <div className="text-3xl font-bold text-white mb-3">
                            {score}/{maxScore}
                          </div>
                          <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full ${
                                percentage >= 80
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : percentage >= 60
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-red-500 to-rose-500"
                              } shadow-lg`}
                            />
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </motion.div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b-2 border-gray-700/50 overflow-x-auto">
              {[
                { id: "overview", label: "Overview", icon: Eye },
                { id: "ats", label: "ATS Analysis", icon: Shield },
                { id: "strengths", label: "Strengths", icon: CheckCircle },
                { id: "weaknesses", label: "Weaknesses", icon: XCircle },
                { id: "improvements", label: "Improvements", icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                      : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Role Detection */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
                    <h4 className="font-bold mb-6 flex items-center gap-3 text-xl">
                      <Target className="text-blue-400" size={24} />
                      Detected Role & Experience
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        {
                          label: "Role",
                          value: analysis.detectedRole || "Software Developer",
                        },
                        {
                          label: "Experience Level",
                          value: analysis.experienceLevel || "Entry Level",
                        },
                        {
                          label: "Market Competitiveness",
                          value: analysis.marketCompetitiveness || "Moderate",
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/50 hover:border-blue-500/50 transition-all"
                        >
                          <div className="text-sm text-gray-400 mb-2 font-medium">
                            {item.label}
                          </div>
                          <div className="text-xl font-bold text-white">
                            {item.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Section Analysis */}
                  {analysis.sections && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-xl">
                        <FileText className="text-purple-400" size={24} />
                        Section-by-Section Analysis
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(analysis.sections).map(
                          ([section, feedback], i) => (
                            <motion.div
                              key={section}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/50 transition-all"
                            >
                              <div className="font-semibold capitalize mb-2 text-purple-300 text-lg">
                                {section}
                              </div>
                              <div className="text-sm text-gray-400 leading-relaxed">
                                {feedback}
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ATS Analysis Tab */}
              {activeTab === "ats" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* ATS Issues */}
                  {analysis.atsAnalysis?.issues && (
                    <div className="bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 rounded-2xl p-8 shadow-xl">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-red-300 text-xl">
                        <AlertTriangle className="text-red-400" size={24} />
                        ATS Compatibility Issues
                      </h4>
                      <ul className="space-y-3">
                        {analysis.atsAnalysis.issues.map((issue, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm text-gray-300 flex items-start gap-3 bg-gray-800/30 p-4 rounded-xl border border-red-500/20"
                          >
                            <span className="text-red-400 mt-1 font-bold">•</span>
                            <span className="flex-1">{issue}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ATS Recommendations */}
                  {analysis.atsAnalysis?.recommendations && (
                    <div className="bg-blue-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl p-8 shadow-xl">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-blue-300 text-xl">
                        <AlertCircle className="text-blue-400" size={24} />
                        ATS Optimization Recommendations
                      </h4>
                      <ul className="space-y-4">
                        {analysis.atsAnalysis.recommendations.map((rec, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm text-gray-300 flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-blue-500/20"
                          >
                            <span className="text-blue-400 font-bold text-lg">
                              {i + 1}.
                            </span>
                            <span className="flex-1">{rec}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Keyword Analysis */}
                  {analysis.keywords && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
                      <h4 className="font-bold mb-6 text-xl">Keyword Analysis</h4>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="text-sm text-gray-400 mb-3 font-medium">
                            Present Keywords
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.present?.map((kw, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300 font-medium"
                              >
                                {kw}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-3 font-medium">
                            Missing Keywords
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.missing?.map((kw, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300 font-medium"
                              >
                                {kw}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {analysis.keywords.recommended && (
                        <div>
                          <div className="text-sm text-gray-400 mb-3 font-medium">
                            Recommended Keywords
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {analysis.keywords.recommended.map((kw, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-300 font-medium"
                              >
                                {kw}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Strengths Tab */}
              {activeTab === "strengths" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-8 shadow-xl"
                >
                  <h4 className="font-bold mb-6 flex items-center gap-3 text-green-300 text-xl">
                    <CheckCircle className="text-green-400" size={24} />
                    Resume Strengths
                  </h4>
                  <ul className="space-y-4">
                    {analysis.strengths?.map((strength, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-sm text-gray-300 flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-green-500/20"
                      >
                        <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={20} />
                        <span className="flex-1">{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Weaknesses Tab */}
              {activeTab === "weaknesses" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {analysis.criticalWeaknesses && (
                    <div className="bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 rounded-2xl p-8 shadow-xl">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-red-300 text-xl">
                        <XCircle className="text-red-400" size={24} />
                        Critical Weaknesses
                      </h4>
                      <ul className="space-y-4">
                        {analysis.criticalWeaknesses.map((weakness, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm text-gray-300 flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-red-500/20"
                          >
                            <XCircle className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
                            <span className="flex-1">{weakness}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.minorWeaknesses && (
                    <div className="bg-yellow-500/10 backdrop-blur-xl border-2 border-yellow-500/30 rounded-2xl p-8 shadow-xl">
                      <h4 className="font-bold mb-6 flex items-center gap-3 text-yellow-300 text-xl">
                        <AlertTriangle className="text-yellow-400" size={24} />
                        Minor Weaknesses
                      </h4>
                      <ul className="space-y-4">
                        {analysis.minorWeaknesses.map((weakness, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm text-gray-300 flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-yellow-500/20"
                          >
                            <span className="text-yellow-400 mt-1 font-bold">•</span>
                            <span className="flex-1">{weakness}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Improvements Tab */}
              {activeTab === "improvements" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl p-8 shadow-xl">
                    <h4 className="font-bold mb-6 flex items-center gap-3 text-blue-300 text-xl">
                      <TrendingUp className="text-blue-400" size={24} />
                      Actionable Improvements
                    </h4>
                    <ul className="space-y-4">
                      {analysis.improvements?.map((improvement, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm text-gray-300 flex items-start gap-4 bg-gray-800/30 p-4 rounded-xl border border-blue-500/20"
                        >
                          <span className="text-blue-400 font-bold text-lg">{i + 1}.</span>
                          <span className="flex-1">{improvement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {analysis.recommendations && (
                    <div className="bg-purple-500/10 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl p-8 shadow-xl">
                      <h4 className="font-bold mb-6 text-purple-300 text-xl">
                        Expert Recommendations
                      </h4>
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm text-gray-300 flex items-start gap-3 bg-gray-800/30 p-4 rounded-xl border border-purple-500/20"
                          >
                            <span className="text-purple-400 text-lg">→</span>
                            <span className="flex-1">{rec}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateToRoadmap}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-xl font-bold shadow-xl transition-all text-white flex items-center gap-2"
              >
                <TrendingUp size={20} />
                View Personalized Roadmap
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReset}
                className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 hover:bg-white/5 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Analyze Another Resume
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

