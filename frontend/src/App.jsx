import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 🧭 Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import ChatbotPopup from "./components/ChatbotPopup";
import { ToastProvider } from "./components/ToastProvider";
import { PageFallback } from "./components/Skeleton";

// 📝 Page Components (lazy)
const HomePage = lazy(() => import("./pages/HomePage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Interview = lazy(() => import("./pages/Interview"));
const InterviewTips = lazy(() => import("./pages/InterviewTips"));
const InterviewRoom = lazy(() => import("./pages/InterviewRoom"));
const About = lazy(() => import("./pages/About"));
const LearnMore = lazy(() => import("./pages/LearnMore"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Help = lazy(() => import("./pages/Help"));
const PersonalizedRoadmap = lazy(() => import("./pages/PersonalizedRoadmap")); 
// ✅ Add Resume Analyzer
const ResumeAnalyzer = lazy(() => import("./pages/ResumeAnalyzer"));

function AppLayout() {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/auth";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* 🟣 Navbar */}
      {!hideNavFooter && <Navbar />}

      {/* 🟡 Page Routes */}
      <main className="flex-grow">
        <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* 🔐 Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/interview-room" element={<InterviewRoom />} />
            <Route path="/interview-tips" element={<InterviewTips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/personalized-roadmap" element={<PersonalizedRoadmap />} />
            {/* ✅ Add Route */}
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          </Route>
        </Routes>
        </Suspense>
      </main>

      {/* 🟣 Footer */}
      {!hideNavFooter && <Footer />}

      {/* 🤖 Chatbot Floating */}
      {!hideNavFooter && <ChatbotPopup />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <ScrollToTop />
          <AppLayout />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}