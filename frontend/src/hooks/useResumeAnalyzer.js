import { useState, useEffect } from "react";
import { API_BASE } from "../config/api";

export function useResumeAnalyzer(user) {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);

  // Check for existing analysis on mount
  useEffect(() => {
    const checkExistingAnalysis = async () => {
      try {
        const { default: api } = await import("../utils/api");
        const data = await api.getResumeStatus();
        if (data.analyzed && data.data) {
          setHasExistingAnalysis(true);
          setAnalysis(data.data);
        }
      } catch (err) {
        console.error("Error checking resume status:", err);
      }
    };

    if (user) {
      checkExistingAnalysis();
    }
  }, [user]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      const allowedExtensions = ["pdf", "doc", "docx"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Invalid format. Please upload a structured Resume (PDF, DOC, DOCX) only.");
        setFile(null);
        return;
      }
      
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

      const { default: api } = await import("../utils/api");
      const data = await api.analyzeResume(formData);
      
      setAnalysis(data.analysis);
      setHasExistingAnalysis(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setFile(null);
    setHasExistingAnalysis(false);
    setError("");
  };

  // Utility functions for score colors
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

  const getATSScoreColor = (score) => {
    if (score >= 75) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getATSScoreBg = (score) => {
    if (score >= 75) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-500";
  };

  return {
    file,
    analysis,
    loading,
    error,
    hasExistingAnalysis,
    handleFileChange,
    handleUpload,
    resetAnalysis,
    getScoreColor,
    getScoreBg,
    getATSScoreColor,
    getATSScoreBg,
  };
}

