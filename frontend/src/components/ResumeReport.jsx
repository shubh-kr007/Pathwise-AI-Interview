import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Award } from "lucide-react";

export default function ResumeReport({ analysis }) {
  if (!analysis) return null;

  const { score, summary, strengths, weaknesses, improvements, sections, atsCompatibility, recommendations } = analysis;

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Resume Score</h3>
            <p className="text-gray-400">{summary}</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-extrabold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-gray-400 text-sm mt-1">out of 100</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getScoreBg(score)}`}
          />
        </div>
      </div>

      {/* ATS Compatibility */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="text-blue-400" size={24} />
            <div>
              <div className="font-semibold">ATS Compatibility</div>
              <div className="text-sm text-gray-400">Applicant Tracking System</div>
            </div>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(atsCompatibility)}`}>
            {atsCompatibility}%
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-400" size={20} />
            <h4 className="font-semibold text-green-300">Strengths</h4>
          </div>
          <ul className="space-y-2">
            {strengths.map((item, i) => (
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
            {weaknesses.map((item, i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section Analysis */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-purple-400" size={20} />
          Section-by-Section Analysis
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(sections).map(([section, feedback]) => (
            <div key={section} className="bg-gray-800/50 rounded-lg p-4">
              <div className="font-medium capitalize mb-1">{section}</div>
              <div className="text-sm text-gray-400">{feedback}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-blue-400" size={20} />
          <h4 className="font-semibold text-blue-300">Actionable Improvements</h4>
        </div>
        <ul className="space-y-3">
          {improvements.map((item, i) => (
            <li key={i} className="text-sm text-gray-300 flex items-start gap-3 bg-gray-800/30 p-3 rounded-lg">
              <span className="text-blue-400 font-bold">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Keywords */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="font-semibold mb-4">Keyword Analysis</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-400 mb-2">Present Keywords</div>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords?.present?.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-300">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-2">Missing Keywords</div>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords?.missing?.map((kw, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs text-red-300">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}