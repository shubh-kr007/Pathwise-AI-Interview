import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bot, FileText, Map, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Bot className="w-10 h-10" />,
    title: "AI Mock Interviews",
    description: "Practice with AI-powered interviews across technical, behavioral, and system design categories.",
    color: "from-blue-500 to-cyan-500",
    path: "/interview"
  },
  {
    icon: <FileText className="w-10 h-10" />,
    title: "Resume Analysis",
    description: "Get instant AI feedback on your resume with actionable suggestions for improvement.",
    color: "from-purple-500 to-pink-500",
    path: "/dashboard"
  },
  {
    icon: <Map className="w-10 h-10" />,
    title: "Career Roadmap",
    description: "Receive personalized learning paths tailored to your career goals and skill level.",
    color: "from-green-500 to-emerald-500",
    path: "/personalized-roadmap"
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Progress Tracking",
    description: "Monitor your improvement with detailed analytics and performance insights.",
    color: "from-orange-500 to-red-500",
    path: "/dashboard"
  }
];

export default function FeatureCards() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 bg-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive tools powered by AI to help you prepare, practice, and excel in your interviews
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              onClick={() => navigate(feature.path)}
              className="group relative bg-white/5 border border-gray-800 rounded-2xl p-6 cursor-pointer overflow-hidden hover:border-gray-600 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all">
                {feature.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute bottom-4 right-4 text-gray-600 group-hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}