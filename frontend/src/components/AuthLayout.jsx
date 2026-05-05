import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Github, Sparkles, CheckCircle2 } from "lucide-react";
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
    
    // Initialize Google Login
    const initGoogle = () => {
      if (window.google?.accounts?.id && parent && parent.children.length === 0) {
        try {
          console.log("🌐 Initializing Google Identity Services...");
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: onGoogleSuccess,
          });
          window.google.accounts.id.renderButton(parent, {
            theme: "outline",
            size: "large",
            shape: "pill",
            text: "continue_with",
            width: 320,
          });
          console.log("✅ Google Button Rendered.");
        } catch (err) {
          console.error("❌ Google Initialization Error:", err);
        }
      }
    };

    // If script already loaded, init. Otherwise wait.
    if (window.google) {
      initGoogle();
    } else {
      console.log("⏳ Waiting for Google GIS script...");
      const interval = setInterval(() => {
        if (window.google) {
          initGoogle();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [onGoogleSuccess]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-[Montserrat]">
      {/* 🌌 Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <LiquidEther />
      </div>

      <div className="relative z-10 w-full h-screen lg:overflow-hidden flex flex-col">
        <Navbar />

        <div className="flex-1 flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden pt-20 lg:pt-0">
          
          {/* ⬅️ Left Panel (Marketing & Viz) - Desktop Only */}
          <div className="hidden lg:flex flex-col justify-center items-start w-7/12 p-24 space-y-12 relative overflow-hidden h-full">
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="relative z-10"
             >
               <h2 className="text-6xl font-black leading-[1.1] tracking-tighter mb-8 italic">
                 Accelerate Your <br />
                 <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 pr-4">
                   Career Trajectory
                 </span>
               </h2>
               <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed mb-10">
                 Join the elite ranks of professionals using Pathwise AI to decode their dream roles.
               </p>

               <div className="space-y-4">
                 {[
                   "Precision AI Mock Interviews",
                   "Deep-Scan Resume Intelligence",
                   "Real-time Industry Data Access"
                 ].map((text, i) => (
                   <div key={text} className="flex items-center gap-3">
                     <CheckCircle2 className="text-teal-400 w-5 h-5" />
                     <span className="text-slate-200 font-bold tracking-tight">{text}</span>
                   </div>
                 ))}
               </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/40 backdrop-blur-xl"
             >
                <img 
                  src="/auth-hero.png" 
                  alt="AI Career Growth"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
             </motion.div>
          </div>

          {/* ➡️ Right Panel (Dark Auth Card) */}
          <div className="w-full lg:w-5/12 flex items-center justify-center p-6 lg:p-10 h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-sm w-full bg-[#0d0d0d] border border-slate-800 shadow-2xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-10 backdrop-blur-3xl relative overflow-hidden group"
            >
              {/* ⚡ Perpetual Border Beam (Full Perimeter) */}
              <div className="absolute inset-0 rounded-[2rem] pointer-events-none">
                {/* Top */}
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent z-20"
                />
                {/* Bottom */}
                <motion.div 
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-0 left-0 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent z-20"
                />
                {/* Right */}
                <motion.div 
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="absolute top-0 right-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent via-teal-400 to-transparent z-20"
                />
                {/* Left */}
                <motion.div 
                  animate={{ y: ["100%", "-100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                  className="absolute top-0 left-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent via-teal-400 to-transparent z-20"
                />
              </div>

              <div className="mb-6 md:mb-8 text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                  <span className="text-teal-400 font-black text-xl tracking-tighter font-['Outfit']">Pathwise</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight mb-1">
                  {isLogin ? "Sign in" : "Get Started"}
                </h3>
                <p className="text-slate-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">
                  Secure Gateway
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Identity</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-4 md:px-5 py-2.5 md:py-3.5 rounded-xl bg-zinc-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-all font-bold text-xs md:text-sm"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-xl bg-zinc-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-all font-bold text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key</label>
                    {isLogin && <button type="button" className="text-[10px] font-black text-teal-400 hover:text-white uppercase tracking-widest">Forgot?</button>}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 md:px-5 py-2.5 md:py-3.5 rounded-xl bg-zinc-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-all font-bold text-xs md:text-sm"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white cursor-pointer"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -2, backgroundColor: '#ffffff', color: '#000000' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-3 md:py-4 bg-teal-600 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Validating..." : "Continue"}
                </motion.button>
              </form>

              <div className="my-8 flex items-center">
                <div className="flex-grow border-t border-slate-800/50"></div>
                <span className="mx-4 text-slate-600 text-[10px] font-black tracking-widest uppercase">OR</span>
                <div className="flex-grow border-t border-slate-800/50"></div>
              </div>

               <div className="space-y-3">
                <div className="relative group overflow-hidden rounded-xl p-[1px] transition-all duration-300 cursor-pointer h-12">
                   {/* Google Brand Gradient Border (Visible on Hover) */}
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] transition-opacity duration-300 pointer-events-none"></div>
                   
                   <div className="relative w-full h-full bg-white rounded-[calc(0.75rem-1px)] text-xs font-black uppercase tracking-widest text-black flex items-center justify-center gap-3 transition-all duration-300 group-hover:scale-[1.01] active:scale-[0.98] pointer-events-none z-10">
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
                      Continue with Google
                   </div>
                   
                   {/* The actual Google Identity Service button (Invisible but clickable) */}
                   <div 
                    ref={googleBtnRef} 
                    className="absolute inset-0 opacity-[0.01] cursor-pointer z-50 flex justify-center w-full h-full"
                   ></div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {isLogin ? "New here?" : "Joined before?"}
                  <button
                    type="button"
                    className="ml-2 text-teal-400 hover:text-white transition-colors"
                    onClick={toggleAuthMode}
                  >
                    {isLogin ? "Join Now" : "Login Now"}
                  </button>
                </p>
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-3 rounded-xl text-center text-xs font-black uppercase tracking-widest ${
                      message.startsWith("✅") ? "bg-teal-500/10 text-teal-400" : "bg-red-500/10 text-red-500"
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
    </div>
  );
}