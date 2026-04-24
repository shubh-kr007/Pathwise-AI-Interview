// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import AuthLoadingOverlay from "../components/AuthLoadingOverlay";
import { API_BASE } from "../config/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const body = isLogin
        ? { email: form.email, password: form.password }
        : form;

      // ✅ Use API_BASE and always include /api here
      const res = await fetch(`${API_BASE}/api${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      login(data.token, data.user);
      localStorage.setItem("justLoggedIn", "true");
      setShowLoadingOverlay(true);
      
      // Reduced delay to 1000ms to improve responsiveness
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Auth error:", err);
      setMessage("❌ Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    setIsLoading(true);
    setShowLoadingOverlay(true); // Show overlay immediately for better feedback
    
    try {
      const res = await fetch(`${API_BASE}/api/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.user);
        localStorage.setItem("justLoggedIn", "true");
        
        // Reduced delay from 2500ms to 1000ms
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setShowLoadingOverlay(false);
        setIsLoading(false);
        setMessage(data.message || "❌ Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setShowLoadingOverlay(false);
      setIsLoading(false);
      setMessage("❌ Google login failed");
    }
  };

  const handleGoogleError = () => setMessage("❌ Google Login Failed");

  return (
    <>
      <AuthLoadingOverlay isVisible={showLoadingOverlay} />
      <AuthLayout
        isLogin={isLogin}
        form={form}
        showPassword={showPassword}
        message={message}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setShowPassword={setShowPassword}
        toggleAuthMode={() => {
          setIsLogin(!isLogin);
          setMessage("");
        }}
        onGoogleSuccess={handleGoogleSuccess}
        onGoogleError={handleGoogleError}
        isLoading={isLoading}
      />
    </>
  );
}