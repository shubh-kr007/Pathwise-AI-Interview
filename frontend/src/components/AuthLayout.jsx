import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import LiquidEther from "./LiquidEther";
import Navbar from "./Navbar";

export default function AuthLayout({
  isLogin,
  form,
  showPassword,
  message,
  handleChange,
  handleSubmit,
  setShowPassword,
  toggleAuthMode,
  onGoogleSuccess,
  onGoogleError,
  isLoading,
}) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const parent = googleBtnRef.current;
    if (parent && parent.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google?.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: onGoogleSuccess,
        });
        window.google?.accounts.id.renderButton(parent, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 240,
        });
      };
      document.body.appendChild(script);
    }
  }, [onGoogleSuccess]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-y-auto font-[Montserrat]">
      <div className="absolute inset-0 z-0">
        <LiquidEther />
      </div>

      <div className="relative z-10">
        <Navbar />

        <div className="flex items-center justify-center min-h-screen p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gradient-to-b from-gray-900/80 to-black/70 border border-blue-500/30 shadow-[0_0_20px_rgba(0,0,0,0.5),0_0_20px_rgba(37,99,235,0.3)] rounded-2xl p-10 backdrop-blur-md"
          >
            <h1 className="text-3xl font-black mb-6 text-center bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-lg bg-black/60 border border-gray-700 text-white placeholder-gray-400 w-full pr-10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold shadow-lg shadow-blue-700/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
              </motion.button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black rounded-full shadow-lg hover:shadow-xl border border-gray-200 px-4 py-2 flex items-center gap-3 transition-all duration-300 cursor-pointer relative"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <div className="text-sm font-semibold tracking-wide">
                  Continue with Google
                </div>
                <div
                  ref={googleBtnRef}
                  className="absolute inset-0 opacity-0 pointer-events-auto"
                ></div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="button"
              className="w-full text-center mt-6 text-blue-300 hover:text-cyan-400 font-medium transition-all"
              onClick={toggleAuthMode}
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </motion.button>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 text-center text-sm font-medium ${
                    message.startsWith("✅") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}