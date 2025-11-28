import React, { useState } from "react";
import api from "../utils/api";
import { motion } from "framer-motion";
import { Upload, FileText, Loader, Sparkles } from "lucide-react";
import ResumeReport from "./ResumeReport";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
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
      const data = await api.analyzeResume(formData);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to parse resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-blue-400" size={40} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Resume Analyzer
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Get instant AI-powered feedback on your resume with actionable insights
          </p>
        </motion.div>

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

        {/* AI Analysis Report */}
        {result?.aiAnalysis && <ResumeReport analysis={result.aiAnalysis} />}
      </div>
    </div>
  );
}