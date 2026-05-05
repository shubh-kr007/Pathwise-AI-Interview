import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const inactivityTimerRef = useRef(null);
  const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour in ms

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Removes all per-user progress data from localStorage. */
  const clearUserSessionData = () => {
    localStorage.removeItem("interview_attempts_v1");
    localStorage.removeItem("last_report_v1");
    localStorage.removeItem("practice_plan_v1");
    localStorage.removeItem("chat_messages_v1");
    localStorage.removeItem("last_ai_feedback_v1");
  };

  /** Restarts the inactivity countdown. */
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
  };

  /** Called on any user activity event while logged in. */
  const handleUserActivity = () => {
    if (user) resetInactivityTimer();
  };

  // ── Effects ───────────────────────────────────────────────────────────────

  /** Restore session from localStorage on mount. */
  useEffect(() => {
    const token    = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (!token || !userData) return;

    try {
      const parsed = JSON.parse(userData);

      if (parsed?.email) {
        setUser({
          name:                parsed.name                || "",
          email:               parsed.email               || "",
          picture:             parsed.picture             || "",
          phone:               parsed.phone               || "",
          location:            parsed.location            || "",
          course:              parsed.course              || "",
          interviewsCompleted: parsed.interviewsCompleted || 0,
          averageScore:        parsed.averageScore        || 0,
        });
        return;
      }
    } catch {
      // userData was not valid JSON — fall through to JWT decode
    }

    // Fallback: decode the JWT directly
    try {
      const decoded = jwtDecode(token);
      const name =
        decoded.name ||
        (decoded.given_name
          ? `${decoded.given_name} ${decoded.family_name || ""}`.trim()
          : "");
      setUser({ name, email: decoded.email || "" });
    } catch {
      // Token is invalid; leave user as null
    }
  }, []);

  /** Attach / detach inactivity listeners whenever the user changes. */
  useEffect(() => {
    if (!user) return;

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    resetInactivityTimer();
    events.forEach((ev) => document.addEventListener(ev, handleUserActivity, true));

    return () => {
      events.forEach((ev) => document.removeEventListener(ev, handleUserActivity, true));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [user]);

  // ── Auth actions ──────────────────────────────────────────────────────────

  /**
   * Persists the token + user data, clears stale session data if a
   * different user is logging in, and updates React state.
   */
  const login = (token, userData) => {
    // Clear previous user's data if a different account is logging in
    try {
      const prev = JSON.parse(localStorage.getItem("userData"));
      if (prev?.email && prev.email !== userData.email) {
        clearUserSessionData();
      }
    } catch {
      // Nothing to clear
    }

    localStorage.setItem("token",        token);
    localStorage.setItem("userData",     JSON.stringify(userData));
    localStorage.setItem("justLoggedIn", "true"); // Triggers chatbot open

    const userObj = {
      name:                userData.name                || "",
      email:               userData.email               || "",
      picture:             userData.picture             || "",
      phone:               userData.phone               || "",
      location:            userData.location            || "",
      course:              userData.course              || "",
      interviewsCompleted: userData.interviewsCompleted || 0,
      averageScore:        userData.averageScore        || 0,
    };

    setUser(userObj);
    return userObj;
  };

  /** Re-fetches the user profile from the API and syncs state + localStorage. */
  const refreshUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://pathwise-ai-interview-backend.onrender.com";

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const profile = await response.json();

      const updatedUser = {
        name:                profile.name                || "",
        email:               profile.email               || "",
        picture:             profile.picture             || "",
        phone:               profile.phone               || "",
        location:            profile.location            || "",
        course:              profile.course              || "",
        interviewsCompleted: profile.interviewsCompleted || 0,
        averageScore:        profile.averageScore        || 0,
      };

      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(profile));
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  /** Clears all session data and logs the user out. */
  const logout = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    clearUserSessionData();
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("signupData");

    setUser(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;