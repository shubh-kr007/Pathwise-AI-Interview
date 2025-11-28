import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Brain,
  ChevronDown,
  ChevronUp,
  Star
} from "lucide-react";

export default function AIFeedbackReport({ feedback, loading }) {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="animate-spin text-purple-400" size={24} />
          <span className="text-lg">AI is analyzing your performance...</span>
        </div>
      </div>
    );
  }

  if (!feedback) return null;

  const {
    overallScore,
    overallSummary,
    strengths,
    areasForImprovement,
    questionAnalysis,
    skillsAssessment,
    recommendations,
    nextSteps
  } = feedback;

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
      {/* Header with AI Badge */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
        <Sparkles className="text-purple-400" size={24} />
        <div>
          <div className="font-semibold text-purple-300">AI-Powered Feedback</div>
          <div className="text-sm text-gray-400">Analyzed by GPT-4 • Personalized insights</div>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Award className="text-purple-400" size={28} />
              <h3 className="text-2xl font-bold">Overall Performance</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{overallSummary}</p>
          </div>
          <div className="text-center ml-6">
            <div className={`text-6xl font-extrabold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-gray-400 text-sm mt-1">out of 100</div>
            <div className="flex gap-1 mt-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(overallScore / 20) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getScoreBg(overallScore)}`}
          />
        </div>
      </div>

      {/* Skills Assessment */}
      {skillsAssessment && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="text-blue-400" size={24} />
            <h4 className="text-xl font-semibold">Skills Assessment</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(skillsAssessment).map(([skill, score]) => (
              <div key={skill} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize font-medium">
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full bg-gradient-to-r ${getScoreBg(score)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-400" size={24} />
            <h4 className="font-semibold text-green-300 text-lg">What You Did Well</h4>
          </div>
          <ul className="space-y-3">
            {strengths?.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm text-gray-200 flex items-start gap-3 bg-green-500/5 p-3 rounded-lg"
              >
                <span className="text-green-400 font-bold text-lg">✓</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-orange-400" size={24} />
            <h4 className="font-semibold text-orange-300 text-lg">Areas to Improve</h4>
          </div>
          <ul className="space-y-3">
            {areasForImprovement?.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm text-gray-200 flex items-start gap-3 bg-orange-500/5 p-3 rounded-lg"
              >
                <span className="text-orange-400 font-bold text-lg">→</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Analysis */}
      {questionAnalysis && questionAnalysis.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="text-purple-400" size={24} />
            <h4 className="text-xl font-semibold">Question-by-Question Breakdown</h4>
          </div>
          <div className="space-y-3">
            {questionAnalysis.map((qa, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      qa.score >= 8 ? 'bg-green-500/20 text-green-400' :
                      qa.score >= 6 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {qa.score}
                    </div>
                    <span className="font-medium">Question {qa.questionNumber}</span>
                  </div>
                  {expandedQuestion === index ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedQuestion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 space-y-3"
                    >
                      <div className="bg-gray-900/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Overall Feedback:</div>
                        <div className="text-gray-200">{qa.feedback}</div>
                      </div>
                      {qa.whatWentWell && (
                        <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/20">
                          <div className="text-sm text-green-400 mb-1">What Went Well:</div>
                          <div className="text-gray-200 text-sm">{qa.whatWentWell}</div>
                        </div>
                      )}
                      {qa.whatToImprove && (
                        <div className="bg-orange-500/5 p-3 rounded-lg border border-orange-500/20">
                          <div className="text-sm text-orange-400 mb-1">What to Improve:</div>
                          <div className="text-gray-200 text-sm">{qa.whatToImprove}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-400" size={24} />
            <h4 className="font-semibold text-blue-300 text-lg">AI Recommendations</h4>
          </div>
          <ul className="space-y-3">
            {recommendations.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm text-gray-200 flex items-start gap-3 bg-blue-500/5 p-3 rounded-lg"
              >
                <span className="text-blue-400 font-bold">{i + 1}.</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-purple-400" size={24} />
            <h4 className="font-semibold text-purple-300 text-lg">Your Next Steps</h4>
          </div>
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 bg-purple-500/5 p-4 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-gray-200">{step}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          💡 This feedback was generated by AI based on your responses. Use it as a guide to improve your interview skills.
        </p>
      </div>
    </motion.div>
  );
}