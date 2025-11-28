import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader, Sparkles, CheckCircle, XCircle, TrendingUp, Award, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);

  useEffect(() => {
    // Check if user already has resume analysis
    const checkExistingAnalysis = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/resume/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.analyzed && data.data) {
            setHasExistingAnalysis(true);
            setAnalysis(data.data);
          }
        }
      } catch (err) {
        console.error("Error checking resume status:", err);
      }
    };

    if (user) {
      checkExistingAnalysis();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a resume (PDF, DOC, DOCX).");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/resume/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setHasExistingAnalysis(true);
      
      // Show success message
      setTimeout(() => {
        const roadmapPrompt = window.confirm(
          "✅ Resume analyzed! Would you like to view your personalized roadmap based on this analysis?"
        );
        if (roadmapPrompt) {
          navigate('/personalized-roadmap');
        }
      }, 1000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-400" size={40} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get instant AI-powered feedback on your resume with actionable insights to land more interviews
          </p>
        </motion.div>

        {/* Upload Section */}
        {!analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl shadow-2xl bg-white/5 backdrop-blur-lg border border-white/10 mb-8"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Upload Your Resume
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-300
                             file:mr-4 file:py-3 file:px-6
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-600 file:text-white
                             hover:file:bg-blue-700 file:cursor-pointer
                             cursor-pointer bg-gray-800/50 rounded-lg p-3 border border-gray-700"
                />
              </div>
              {file && (
                <p className="mt-3 text-sm text-gray-400 flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg">
                  <Upload size={16} />
                  <span className="font-medium">{file.name}</span>
                  <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                </p>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Analyze Resume
                </>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Resume Score</h3>
                  <p className="text-gray-300">{analysis.summary}</p>
                  {analysis.aiGenerated && (
                    <p className="text-xs text-purple-400 mt-2 flex items-center gap-1">
                      <Sparkles size={14} /> AI-Powered Analysis
                    </p>
                  )}
                </div>
                <div className="text-center ml-6">
                  <div className={`text-6xl font-extrabold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">out of 100</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getScoreBg(analysis.score)}`}
                />
              </div>
            </div>

            {/* ATS Compatibility */}
            {analysis.atsCompatibility && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="text-blue-400" size={24} />
                    <div>
                      <div className="font-semibold">ATS Compatibility</div>
                      <div className="text-sm text-gray-400">Applicant Tracking System Score</div>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                    {analysis.atsCompatibility}%
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="text-green-400" size={20} />
                  <h4 className="font-semibold text-green-300">Strengths</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths?.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="text-red-400" size={20} />
                  <h4 className="font-semibold text-red-300">Weaknesses</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.weaknesses?.map((item, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section Analysis */}
            {analysis.sections && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="text-purple-400" size={20} />
                  Section-by-Section Analysis
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(analysis.sections).map(([section, feedback]) => (
                    <div key={section} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="font-medium capitalize mb-1">{section}</div>
                      <div className="text-sm text-gray-400">{feedback}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-blue-400" size={20} />
                <h4 className="font-semibold text-blue-300">Actionable Improvements</h4>
              </div>
              <ul className="space-y-3">
                {analysis.improvements?.map((item, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-3 bg-gray-800/30 p-3 rounded-lg">
                    <span className="text-blue-400 font-bold">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            {analysis.keywords && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold mb-4">Keyword Analysis</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Present Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.present?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Recommended Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.missing?.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs text-yellow-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                <h4 className="font-semibold mb-4 text-purple-300">Expert Recommendations</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/personalized-roadmap')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg transition-all"
              >
                View Personalized Roadmap
              </button>
              <button
                onClick={() => {
                  setAnalysis(null);
                  setFile(null);
                  setHasExistingAnalysis(false);
                }}
                className="px-6 py-3 border border-gray-600 hover:bg-white/5 rounded-xl font-semibold transition-all"
              >
                Analyze Another Resume
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}