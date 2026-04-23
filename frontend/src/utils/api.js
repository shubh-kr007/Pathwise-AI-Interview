import axiosInstance from "./axios";

// API methods
const api = {
  // Get interview attempts
  async getAttempts() {
    try {
      const response = await axiosInstance.get("/api/progress/attempts");
      return response.data;
    } catch (error) {
      console.error("API call failed:", error.message);
      return [];
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
    const response = await axiosInstance.post("/api/resume/analyze", formData);
    return response.data;
  },

  async chatWithAI(message) {
    const response = await axiosInstance.post("/api/ai/chat", { message });
    return response.data;
  },
};

export default api;