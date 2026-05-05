"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiRefreshCw, FiMic, FiMessageSquare } from "react-icons/fi";
import { Bot } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { findResponse, getQuickLinks, startVoiceInput } from "../utils/chatbotUtils";


import { API_BASE } from "../config/api";

const DEFAULT_MESSAGES = [];



export default function ChatbotPopup() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("chat_messages_v1");
      return raw ? JSON.parse(raw) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for click outside

  // Auto-open on login
  useEffect(() => {
    if (user && localStorage.getItem("justLoggedIn") === "true") {
      localStorage.removeItem("justLoggedIn");
      // Clear previous messages on login
      setMessages([]);
      try { localStorage.removeItem("chat_messages_v1"); } catch { }
      const hour = new Date().getHours();
      let greeting = "Good morning";
      if (hour >= 12 && hour < 17) greeting = "Good afternoon";
      else if (hour >= 17) greeting = "Good evening";
      
      const systemPrompt = {
        role: "system",
        content: `You are InterviewBot, the official AI assistant of Pathwise — an advanced AI-powered career growth and interview preparation platform.
        
        Key Pathwise Features You Know About:
        1. Mock Interviews: Technical MCQ-based assessments for 4 key tracks: Data Analyst (Python/SQL), Full Stack (MERN), Java Developer (Core Java), and DSA (Easy-Medium). 
        2. Difficulty Tiers: Every test has Easy, Medium, and Hard tiers with AI-generated questions specific to that level.
        3. Resume Intelligence: Uses LlamaParse to provide deep resume analysis, ATS scores, and personalized 100-point roadmaps.
        4. Performance Tracking: A dynamic dashboard with historical graphs showing performance trends (ups and downs).
        5. Personalized Roadmaps: Career paths generated uniquely for every user based on their uploaded resume.
        
        Guidelines:
        - Be professional, encouraging, and concise.
        - If asked about how Pathwise works, explain the features mentioned above.
        - Help users with interview tips, resume formatting advice, and general career guidance.`
      };

      pushMessage({ sender: "bot", text: `${greeting}, ${user.name || "there"}! 👋 I'm InterviewBot — ask me about interviews, resumes, or Pathwise features!` });
      setOpen(true);

      
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [user]);

  // Persist messages & Scroll to bottom
  useEffect(() => {
    try {
      localStorage.setItem("chat_messages_v1", JSON.stringify(messages));
    } catch { }
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  function pushMessage(msg) {
    setMessages(prev => [...prev, msg]);
  }

  async function send() {
    const text = input.trim();
    if (!text) return;

    pushMessage({ sender: "user", text });
    setInput("");
    setTyping(true);

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      if (response.ok && data.response) {
        pushMessage({ sender: "bot", text: data.response });
      } else {
        pushMessage({ sender: "bot", text: "🤔 Sorry, I'm having a bit of trouble thinking right now. Let's try again!" });
      }
    } catch (error) {
      pushMessage({ sender: "bot", text: "📡 Connection lost. Please check your internet and try again." });
    } finally {
      setTyping(false);
    }
  }

  function handleVoiceInput() {
    startVoiceInput((transcript) => {
      setInput(transcript);
      send(); // Auto-send after voice input
    });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={chatContainerRef}>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
            <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 50, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0, originX: 1, originY: 1 }}
            exit={{ opacity: 0, scale: 0.7, y: 50, originX: 1, originY: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-0 right-0 w-[calc(100vw-32px)] sm:w-[350px] h-[500px] max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col
                       bg-blue-900/10 backdrop-blur-3xl border border-white/10 ring-1 ring-white/5 origin-bottom-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-teal-900 flex items-center justify-center text-xl shadow-lg shadow-teal-900/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Pathwise AI</div>
                  <div className="text-xs flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMessages(DEFAULT_MESSAGES);
                    try { localStorage.removeItem("chat_messages_v1"); } catch { }
                  }}
                  title="Clear chat"
                  className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FiRefreshCw size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={listRef} className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2 opacity-60">
                  <FiMessageSquare size={32} />
                  <p className="text-sm">Start a conversation!</p>
                </div>
              )}

              {messages.map((m, i) => {
                const links = m.sender === "bot" ? getQuickLinks(m.text) : [];
                const isBot = m.sender === "bot";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col max-w-[85%] ${isBot ? "items-start" : "items-end ml-auto"}`}
                  >
                    <div
                      className={`px-4 py-3 text-sm shadow-md ${isBot
                        ? "bg-gray-800/80 text-gray-100 rounded-2xl rounded-tl-none border border-white/5"
                        : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tr-none"
                        }`}
                    >
                      {m.text}
                    </div>

                    {/* Timestamp */}
                    <div className={`text-[10px] text-gray-500 mt-1 px-1 ${isBot ? "text-left" : "text-right"}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {links.map((link, idx) => (
                          <button
                            key={idx}
                            onClick={() => window.location.href = link.url}
                            className="px-3 py-1.5 text-xs font-medium bg-gray-800 border border-violet-500/30 text-violet-300 rounded-full hover:bg-violet-500/10 hover:border-violet-500 transition-all"
                          >
                            {link.text}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {typing && (
                <div className="flex items-center gap-2 text-xs text-gray-400 ml-1">
                  <div className="flex gap-1 bg-gray-800/50 px-3 py-2 rounded-full">
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 border-t border-white/10 backdrop-blur-md">
              <div className="flex gap-2 items-center bg-gray-800/50 p-1.5 rounded-full border border-white/5 focus-within:border-violet-500/50 focus-within:bg-gray-800 transition-all">
                <button
                  onClick={handleVoiceInput}
                  className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Voice input"
                >
                  <FiMic size={18} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-gray-500 min-w-0"
                />
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="p-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg 
                             hover:shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                >
                  <FiSend size={16} className={input.trim() ? "ml-0.5" : ""} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            aria-label="Open chat"
            onClick={() => setOpen(true)}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-0 right-0 w-14 h-14 flex items-center justify-center rounded-full 
                       bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 
                       text-white text-2xl shadow-lg shadow-teal-900/40 
                       border border-white/20 z-50"
          >
            <Bot className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
