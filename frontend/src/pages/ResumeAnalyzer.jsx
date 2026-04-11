// src/pages/ResumeAnalyzer.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useResumeAnalyzer } from "../hooks/useResumeAnalyzer";
import ResumeAnalyzerUI from "../components/ResumeAnalyzerUI";

export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    file,
    analysis,
    loading,
    error,
    handleFileChange,
    handleUpload,
    resetAnalysis,
    getScoreColor,
    getScoreBg,
    getATSScoreColor,
    getATSScoreBg,
  } = useResumeAnalyzer(user);

  const handleReset = () => {
    resetAnalysis();
    setActiveTab("overview");
  };

  const handleNavigateToRoadmap = () => {
    navigate("/personalized-roadmap");
  };

  return (
    <ResumeAnalyzerUI
      file={file}
      analysis={analysis}
      loading={loading}
      error={error}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onFileChange={handleFileChange}
      onUpload={handleUpload}
      onReset={handleReset}
      onNavigateToRoadmap={handleNavigateToRoadmap}
      getScoreColor={getScoreColor}
      getScoreBg={getScoreBg}
      getATSScoreColor={getATSScoreColor}
      getATSScoreBg={getATSScoreBg}
    />
  );
}
