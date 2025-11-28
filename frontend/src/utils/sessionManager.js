// Session Manager - Ensures user data isolation and proper cleanup

class SessionManager {
  constructor() {
    this.currentUserId = null;
    this.sessionId = null;
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize session for a user
  initSession(userId, userData) {
    console.log(`🔐 Initializing session for user: ${userId}`);
    
    // Clear any existing session data first
    this.clearCurrentSession();
    
    this.currentUserId = userId;
    this.sessionId = this.generateSessionId();
    
    // Store session metadata
    localStorage.setItem('current_user_id', userId);
    localStorage.setItem('session_id', this.sessionId);
    localStorage.setItem('session_start', Date.now().toString());
    localStorage.setItem(`user_${userId}_data`, JSON.stringify(userData));
    
    console.log(`✅ Session initialized: ${this.sessionId}`);
  }

  // Clear current user's session data
  clearCurrentSession() {
    const userId = this.currentUserId || localStorage.getItem('current_user_id');
    
    if (userId) {
      console.log(`🗑️ Clearing session data for user: ${userId}`);
      
      // Clear user-specific localStorage keys
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key.startsWith(`user_${userId}_`) || 
          key === 'interview_attempts_v1' || 
          key === 'last_report_v1' || 
          key === 'practice_plan_v1' ||
          key === 'chat_messages_v1' ||
          key === 'last_ai_feedback_v1'
        ) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`✅ Removed ${keysToRemove.length} session items`);
    }
    
    this.currentUserId = null;
    this.sessionId = null;
    localStorage.removeItem('current_user_id');
    localStorage.removeItem('session_id');
    localStorage.removeItem('session_start');
  }

  // Get current user ID
  getCurrentUserId() {
    return this.currentUserId || localStorage.getItem('current_user_id');
  }

  // Get session ID
  getSessionId() {
    return this.sessionId || localStorage.getItem('session_id');
  }

  // Check if session is valid
  isSessionValid() {
    const sessionStart = localStorage.getItem('session_start');
    if (!sessionStart) return false;
    
    const now = Date.now();
    const elapsed = now - parseInt(sessionStart);
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
    
    return elapsed < SESSION_TIMEOUT;
  }

  // Store interview attempt for current user
  saveInterviewAttempt(attempt) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.warn('⚠️ No active session - attempt not saved');
      return;
    }

    const key = `user_${userId}_attempts`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      ...attempt,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
    
    localStorage.setItem(key, JSON.stringify(existing));
    
    // Also save to global attempts for current session
    localStorage.setItem('interview_attempts_v1', JSON.stringify(existing));
  }

  // Get interview attempts for current user
  getInterviewAttempts() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];

    const key = `user_${userId}_attempts`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // Complete logout - clear everything
  logout() {
    console.log('👋 Logging out user...');
    
    this.clearCurrentSession();
    
    // Clear auth tokens
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('signupData');
    
    // Clear global session data
    localStorage.removeItem('interview_attempts_v1');
    localStorage.removeItem('last_report_v1');
    localStorage.removeItem('practice_plan_v1');
    localStorage.removeItem('chat_messages_v1');
    localStorage.removeItem('last_ai_feedback_v1');
    
    sessionStorage.clear();
    
    console.log('✅ User logged out, all session data cleared');
  }

  // Switch user (for testing/admin)
  switchUser(newUserId, newUserData) {
    console.log(`🔄 Switching from user ${this.currentUserId} to ${newUserId}`);
    this.clearCurrentSession();
    this.initSession(newUserId, newUserData);
  }

  // Get session info
  getSessionInfo() {
    return {
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      isValid: this.isSessionValid(),
      startTime: localStorage.getItem('session_start'),
    };
  }
}

// Export singleton instance
const sessionManager = new SessionManager();
export default sessionManager;