import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bot,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Play,
  Lightbulb,
  BarChart3,
  Award,
  Code2,
  Server,
  Settings,
  Database,
  Shield,
  Briefcase,
} from "lucide-react";

const interviewTypes = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "Coding challenges, DSA, and problem-solving",
    icon: <Bot className="h-8 w-8" />,
    duration: "30-45 min",
    difficulty: "Medium",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    description: "STAR method, leadership, teamwork scenarios",
    icon: <Users className="h-8 w-8" />,
    duration: "20-30 min",
    difficulty: "Easy",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Architecture, scalability, distributed systems",
    icon: <Target className="h-8 w-8" />,
    duration: "45-60 min",
    difficulty: "Hard",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "React, Vue, Angular, CSS, JavaScript",
    icon: <Code2 className="h-8 w-8" />,
    duration: "35-45 min",
    difficulty: "Medium",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "APIs, databases, server-side programming",
    icon: <Server className="h-8 w-8" />,
    duration: "40-50 min",
    difficulty: "Medium",
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "ML, statistics, Python, data analysis",
    icon: <Database className="h-8 w-8" />,
    duration: "45-60 min",
    difficulty: "Hard",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "CI/CD, Docker, Kubernetes, cloud platforms",
    icon: <Settings className="h-8 w-8" />,
    duration: "35-45 min",
    difficulty: "Medium",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "security",
    title: "Security Engineer",
    description: "Cybersecurity, penetration testing, protocols",
    icon: <Shield className="h-8 w-8" />,
    duration: "40-50 min",
    difficulty: "Hard",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "product-manager",
    title: "Product Management",
    description: "Strategy, user research, roadmaps",
    icon: <Lightbulb className="h-8 w-8" />,
    duration: "30-40 min",
    difficulty: "Medium",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "full-stack",
    title: "Full Stack Developer",
    description: "End-to-end development, MERN/MEAN stack",
    icon: <Briefcase className="h-8 w-8" />,
    duration: "45-60 min",
    difficulty: "Hard",
    color: "from-violet-500 to-purple-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

export default function Interview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState(null);

  // ✅ Load real user stats from localStorage
  const [userStats, setUserStats] = useState({
    interviewsCompleted: 0,
    averageScore: 0,
    timeSaved: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadUserStats();

    // Listen for updates
    const handleUpdate = () => {
      loadUserStats();
    };

    window.addEventListener("attempts-updated", handleUpdate);
    return () => window.removeEventListener("attempts-updated", handleUpdate);
  }, []);

  const loadUserStats = () => {
    try {
      const attemptsRaw = localStorage.getItem("interview_attempts_v1");
      const attempts = attemptsRaw ? JSON.parse(attemptsRaw) : [];

      const completed = attempts.length;
      const scores = attempts
        .filter((a) => typeof a.scorePercent === "number")
        .map((a) => a.scorePercent);
      const avgScore = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      const timeSaved = (completed * 0.75).toFixed(1); // Estimate 45min per interview
      const successRate = avgScore > 0 ? Math.min(100, avgScore + 7) : 0; // Estimate

      setUserStats({
        interviewsCompleted: completed,
        averageScore: avgScore,
        timeSaved: timeSaved,
        successRate: successRate,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // ✅ Dynamic stats array based on real data
  const stats = [
    {
      label: "Interviews Completed",
      value: userStats.interviewsCompleted.toString(),
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      label: "Average Score",
      value: `${userStats.averageScore}%`,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Time Saved",
      value: `${userStats.timeSaved}h`,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Success Rate",
      value: `${userStats.successRate}%`,
      icon: <Award className="h-5 w-5" />,
    },
  ];

  const handleStartInterview = (type) => {
    navigate(`/interview-room?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 sm:p-6 lg:p-8 mt-20">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI Interview Room
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Welcome back, {user?.name || "there"}! Ready to ace your next interview?
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="inline-block px-6 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 font-semibold"
            >
              <Zap className="inline h-4 w-4 mr-2" />
              Powered by Advanced AI
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/5 border border-gray-800 rounded-xl p-4 text-center"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center justify-center mb-2 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interview Types Grid */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Choose Your Interview Type
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {interviewTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  className={`bg-white/5 border border-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-gray-600 ${
                    selectedType === type.id
                      ? "ring-2 ring-blue-500 bg-blue-500/10"
                      : ""
                  }`}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType(type.id)}
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center text-white mb-4 mx-auto`}
                  >
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center">{type.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 text-center">
                    {type.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{type.duration}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        type.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-400"
                          : type.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {type.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedType}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectedType && handleStartInterview(selectedType)}
            >
              <Play className="h-5 w-5" />
              Start{" "}
              {selectedType
                ? interviewTypes.find((t) => t.id === selectedType)?.title
                : "Interview"}
            </motion.button>

            <motion.button
              className="flex items-center gap-3 px-8 py-4 border border-gray-600 hover:border-white hover:bg-white/5 rounded-xl font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/interview-tips")}
            >
              <BookOpen className="h-5 w-5" />
              Interview Tips
            </motion.button>

            <motion.button
              className="flex items-center gap-3 px-8 py-4 border border-gray-600 hover:border-white hover:bg-white/5 rounded-xl font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
            >
              <BarChart3 className="h-5 w-5" />
              View Progress
            </motion.button>
          </motion.div>

          {/* Quick Tips Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-300">
              💡 Quick Interview Tips
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold mb-2">Be Specific</h4>
                <p className="text-gray-400 text-sm">
                  Use concrete examples and metrics in your answers
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🤝</div>
                <h4 className="font-semibold mb-2">Stay Calm</h4>
                <p className="text-gray-400 text-sm">
                  Take deep breaths and think before responding
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">❓</div>
                <h4 className="font-semibold mb-2">Ask Questions</h4>
                <p className="text-gray-400 text-sm">
                  Show interest by asking thoughtful questions
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}