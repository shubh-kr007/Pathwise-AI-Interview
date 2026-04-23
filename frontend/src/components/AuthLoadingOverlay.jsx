import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

const quotes = [
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Innovation distinguishes between a leader and a follower. – Steve Jobs",
  "First, solve the problem. Then, write the code. – John Johnson",
  "Code is like humor. When you have to explain it, it’s bad. – Cory House",
  "Simplicity is the soul of efficiency. – Austin Freeman",
  "Software is a great combination between artistry and engineering. – Bill Gates",
  "Believe you can and you're halfway there. – Theodore Roosevelt",
  "Stay hungry, stay foolish. – Steve Jobs",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Accuracy is the twin brother of honesty. – Charles Simmons"
];

export default function AuthLoadingOverlay({ isVisible }) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (isVisible) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black flex flex-center items-center justify-center p-6 text-center"
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]" />
             <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-lg space-y-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative inline-block">
                <Loader2 className="w-20 h-20 text-blue-500 animate-spin" strokeWidth={1} />
                <Sparkles className="absolute top-0 right-0 text-yellow-400 animate-pulse" size={24} />
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold tracking-tighter"
              >
                Signing you in to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Pathwise</span>
              </motion.h2>
              <motion.div
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.6 }}
                 className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"
              />
            </div>

            <motion.p
              key={quote}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-gray-400 text-lg font-medium italic leading-relaxed"
            >
              "{quote}"
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold"
            >
              Initializing Session Securely
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
