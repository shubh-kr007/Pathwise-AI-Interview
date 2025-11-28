// src/utils/apiService.js (or wherever you keep it)

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // ✅ Local backend during development
    : "";                     // ✅ In production, use same origin as deployed URL

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const config = {
      ...options,
      // Don't set Content-Type manually for FormData
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // --------- AUTH EXAMPLES (if you need them) ---------
  async login(payload) {
    return this.request("/api/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async signup(payload) {
    return this.request("/api/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async googleLogin(idToken) {
    return this.request("/api/google-login", {
      method: "POST",
      body: JSON.stringify({ token: idToken }),
    });
  }

  // --------- RESUME ---------
  async analyzeResume(formData) {
    return this.request("/api/resume/analyze", {
      method: "POST",
      body: formData, // FormData directly
    });
  }

  // --------- AI ---------
  async getAIFeedback(payload) {
    return this.request("/api/ai/interview-feedback", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async generateQuestions(payload) {
    return this.request("/api/ai/generate-questions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // --------- PROGRESS ---------
  async saveAttempt(payload) {
    return this.request("/api/progress/save-attempt", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getProgress() {
    return this.request("/api/progress", {
      method: "GET",
    });
  }

  // --------- USER ---------
  async getProfile() {
    return this.request("/api/user/profile", {
      method: "GET",
    });
  }

  async updateProfile(payload) {
    return this.request("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
}

export default new ApiService();
