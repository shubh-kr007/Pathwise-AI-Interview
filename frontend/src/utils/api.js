import axiosInstance from "./axios";

// API methods
const api = {
  // Get interview attempts
  async getAttempts() {
    try {
      const response = await axiosInstance.get("/api/progress/attempts");
      return response.data;
    } catch (error) {
      // Fallback to localStorage if API fails
      console.warn("API call failed, falling back to localStorage:", error.message);
      const raw = localStorage.getItem("interview_attempts_v1");
      return raw ? JSON.parse(raw) : [];
    }
  },

  // Other API methods can be added here as needed
  async getUserProfile() {
    const response = await axiosInstance.get("/api/user/profile");
    return response.data;
  },

  async updateUserProfile(data) {
    const response = await axiosInstance.put("/api/user/profile", data);
    return response.data;
  },

  async getResumeStatus() {
    const response = await axiosInstance.get("/api/resume/status");
    return response.data;
  },

  async analyzeResume(formData) {
    const response = await axiosInstance.post("/api/resume/analyze", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async chatWithAI(message) {
    const response = await axiosInstance.post("/api/ai/chat", { message });
    return response.data;
  },
};

export default api;