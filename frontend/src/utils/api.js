const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Resume
  async analyzeResume(formData) {
    return this.request('/api/resume/analyze', {
      method: 'POST',
      body: formData, // Pass FormData directly
    });
  }

  // Other methods...
  async saveAttempt(data) {
    return this.request('/api/progress/save-attempt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async getAIFeedback(data) {
    return this.request('/api/ai/interview-feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();