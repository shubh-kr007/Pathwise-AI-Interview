import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Rocket, Code, TrendingUp, Target, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    title: "AI-Powered Mock Interviews",
    description:
      "Simulate real interview scenarios with instant, actionable feedback powered by advanced AI.",
    icon: "🤖",
  },
  {
    title: "Personalized Roadmaps",
    description:
      "Get a learning path tailored to your goals, strengths, and areas for improvement.",
    icon: "🗺️",
  },
  {
    title: "Progress Tracking",
    description:
      "Visualize your growth with analytics, charts, and detailed performance reports.",
    icon: "📈",
  },
  {
    title: "Resume Builder",
    description:
      "Craft a professional resume with AI suggestions and best practices.",
    icon: "📄",
  },
];

const team = [
   {
    name: "Shubh Kumar",
    role: "Backend Lead",
    bio: "Passionate about scalable backend architectures and APIs.",
  },
  {
    name: "Mohd. Saqib",
    role: "Auth Lead",
    bio: "Expert in secure authentication and user management systems.",
  },
  {
    name: "Rishabh Srivastava",
    role: "Frontend Lead",
    bio: "Loves building beautiful, accessible user experiences.",
  },
];

const helpSteps = [
  {
    number: 1,
    title: "Practice & Learn",
    description: "Choose from multiple interview types and practice with AI-powered questions tailored to your field.",
    icon: <Target className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    number: 2,
    title: "Get AI Feedback",
    description: "Receive instant, detailed feedback on your performance with actionable suggestions for improvement.",
    icon: <Brain className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    number: 3,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed analytics and personalized learning roadmaps.",
    icon: <BarChart3 className="h-8 w-8" />,
    color: "from-green-500 to-emerald-500"
  },
];

export default function About() {
  const { user } = useAuth();
  const userName = user?.name || "there";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center mb-16"
      >
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          About Pathwise
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Hi {userName}! Our mission is to empower everyone to ace their interviews with confidence. We blend cutting-edge AI, expert content, and a supportive community to help you land your dream job.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <span className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-extrabold text-lg shadow-2xl shadow-purple-500/50 animate-pulse">
           Don't just memorize. Get Pathwise.
          </span>
        </motion.div>
      </motion.div>

      {/* Animated Timeline Section - Our Journey */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-blue-300">Our Journey</h2>
        <ol className="relative border-l border-blue-500">
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-700 rounded-full -left-4 ring-4 ring-blue-300">
              <Rocket className="w-5 h-5 text-white" />
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
              Project Inception - August 2025
            </h3>
            <p className="mb-4 text-base font-normal text-gray-300">
              Started as a college project with the vision to make interview preparation accessible and AI-powered.
            </p>
          </li>
          <li className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-700 rounded-full -left-4 ring-4 ring-purple-300 animate-pulse">
              <Code className="w-5 h-5 text-white" />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Active Development - Present
            </h3>
            <p className="text-base font-normal text-gray-300">
              Currently building and refining features. We're actively adding AI-powered feedback, resume analysis, and progress tracking. This is a learning journey for us as developers!
            </p>
          </li>
          <li className="ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-green-700 rounded-full -left-4 ring-4 ring-green-300">
              <TrendingUp className="w-5 h-5 text-white" />
            </span>
            <h3 className="mb-1 text-lg font-semibold text-white">Future Goals</h3>
            <p className="text-base font-normal text-gray-300">
              Planning to add voice-based interviews, video analysis, community features, and mobile app support. Your feedback helps us improve!
            </p>
          </li>
        </ol>
      </motion.div>

      {/* How Pathwise Helps You Section */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-green-300 text-center">How Pathwise Helps You</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {helpSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white/10 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl`}>
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-pink-300">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            className="bg-white/10 rounded-xl p-8 shadow-lg animate-fade-in"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-lg text-gray-200 mb-4">
              "The AI feedback is incredibly detailed! It helped me identify gaps I didn't even know I had. Great project!"
            </p>
            <div className="font-bold text-white">— Beta Tester, Computer Science Student</div>
          </motion.div>
          <motion.div
            className="bg-white/10 rounded-xl p-8 shadow-lg animate-fade-in"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-lg text-gray-200 mb-4">
              "Love the clean design and smooth animations. The progress tracking really motivates me to practice more!"
            </p>
            <div className="font-bold text-white">— Early User, Software Developer</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="max-w-4xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-300">Our Mission</h2>
        <p className="text-lg text-gray-200 mb-2">
          We believe everyone deserves a fair shot at their dream job. Our mission is to break down barriers and make interview preparation accessible, effective, and even fun for all.
        </p>
        <p className="text-lg text-gray-200">
          From students to seasoned professionals, we're here to support your journey every step of the way.
        </p>
      </motion.div>

      {/* Team Section - Without Photos */}
      <motion.div
        className="max-w-5xl w-full mb-24"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-10 text-purple-300 text-center">Meet the Team</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="bg-white/10 border border-gray-700 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2, type: "spring" }}
            >
              <h4 className="text-xl font-bold mb-1 text-white">{member.name}</h4>
              <p className="text-purple-300 font-semibold mb-2">{member.role}</p>
              <p className="text-gray-300 text-sm">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Animated Call to Action */}
      <motion.div
        className="w-full flex flex-col items-center mt-16"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl px-10 py-8 shadow-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to Ace Your Next Interview?</h3>
          <p className="text-gray-200 mb-4">Sign up now and unlock all features for free!</p>
          <a
            href="/interview"
            className="px-8 py-3 bg-black/80 hover:bg-black rounded-xl font-semibold text-blue-200 shadow-lg transition transform hover:scale-105"
          >
            Start Practicing
          </a>
        </div>
      </motion.div>
    </div>
  );
}