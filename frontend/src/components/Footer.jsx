"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Animation variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2, // delay between child animations
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.footer
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="bg-black text-gray-400 py-16 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl -z-10"></div>

      <motion.div
        variants={container}
        className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10"
      >
        {/* About / Branding */}
        <motion.div variants={item} className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-1">
            <h2 style={{
              color: '#43bfc7',
              fontWeight: 'bold',
              fontSize: '2rem',
              letterSpacing: '2px',
              textShadow: '0 2px 8px rgba(67,191,199,0.3)',
              fontFamily: 'Montserrat, Arial, sans-serif',
              filter: 'contrast(1.5) brightness(1.2)',
              marginBottom: '2px',
            }}>
              Pathwise
            </h2>
            <span style={{
              color: '#43bfc7',
              fontSize: '0.85rem',
              fontWeight: '500',
              opacity: 0.8,
              letterSpacing: '1px',
              fontFamily: 'Montserrat, Arial, sans-serif',
            }}>
              AI Job Portal
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Helping you crack interviews with AI-powered mock sessions, resume tips, 
            and progress tracking. Stay ahead and level up your career!
          </p>
          <div className="flex gap-4 mt-2 text-sm">
            <a href="https://github.com/risshhubh/Pathwise" className="hover:text-blue-400 transition-colors duration-300">GitHub</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">LinkedIn</a>
            <a href="#" className="hover:text-blue-400 transition-colors duration-300">Twitter</a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={item} className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <Link to="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link>
          <Link to="/interview" className="hover:text-blue-400 transition-colors duration-300">Interview</Link>
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors duration-300">Dashboard</Link>
          <Link to="/about" className="hover:text-blue-400 transition-colors duration-300">About</Link>
        </motion.div>

        {/* Newsletter / Contact */}
        <motion.div variants={item} className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Subscribe to get the latest updates, tips, and AI features.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-l-xl bg-black border border-gray-700 focus:outline-none focus:border-blue-400 text-gray-200 text-sm"
            />
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 rounded-r-xl text-white font-semibold transition-transform hover:scale-105 cursor-pointer">
              Subscribe
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom copyright */}
      <motion.div
        variants={item}
        className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm"
      >
        © {new Date().getFullYear()} AI Interview Assistant. All rights reserved.
      </motion.div>
    </motion.footer>
  );
}
