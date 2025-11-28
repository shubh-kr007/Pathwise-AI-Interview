import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const inactivityTimerRef = useRef(null);
  const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour

  const clearUserSessionData = () => {
    // Clear all per-user progress-related data
    localStorage.removeItem("interview_attempts_v1");
    localStorage.removeItem("last_report_v1");
    localStorage.removeItem("practice_plan_v1");
    localStorage.removeItem("chat_messages_v1");
    localStorage.removeItem("last_ai_feedback_v1");
  };

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  };

  const handleUserActivity = () => {
    if (user) resetInactivityTimer();
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData?.email) {
          setUser({
            name: parsedUserData.name || "",
            email: parsedUserData.email || "",
            picture: parsedUserData.picture || "",
            phone: parsedUserData.phone || "",
            location: parsedUserData.location || "",
            course: parsedUserData.course || "",
            interviewsCompleted: parsedUserData.interviewsCompleted || 0,
            averageScore: parsedUserData.averageScore || 0,
          });
        }
      } catch {
        try {
          const decoded = jwtDecode(token);
          const name =
            decoded.name ||
            (decoded.given_name
              ? `${decoded.given_name} ${decoded.family_name || ""}`.trim()
              : "");
          const email = decoded.email || "";
          setUser({ name, email });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Inactivity tracking
  useEffect(() => {
    if (user) {
      resetInactivityTimer();
      const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
      events.forEach((ev) => document.addEventListener(ev, handleUserActivity, true));
      return () => {
        events.forEach((ev) =>
          document.removeEventListener(ev, handleUserActivity, true)
        );
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [user]);

  const login = (token, userData) => {
    // If a *different* user logs in, clear previous user's session data
    try {
      const prevDataRaw = localStorage.getItem("userData");
      if (prevDataRaw) {
        const prev = JSON.parse(prevDataRaw);
        if (prev?.email && prev.email !== userData.email) {
          clearUserSessionData();
        }
      }
    } catch {
      // ignore
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userData", JSON.stringify(userData));

    const userObj = {
      name: userData.name || "",
      email: userData.email || "",
      picture: userData.picture || "",
      phone: userData.phone || "",
      location: userData.location || "",
      course: userData.course || "",
      interviewsCompleted: userData.interviewsCompleted || 0,
      averageScore: userData.averageScore || 0,
    };
    setUser(userObj);
    return userObj;
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://pathwise-ai-interview-backend.onrender.com";
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const profileData = await response.json();
        const updatedUser = {
          name: profileData.name || "",
          email: profileData.email || "",
          picture: profileData.picture || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          course: profileData.course || "",
          interviewsCompleted: profileData.interviewsCompleted || 0,
          averageScore: profileData.averageScore || 0,
        };
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(profileData));
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const logout = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    clearUserSessionData();
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("signupData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthContext;