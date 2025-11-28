import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Home,
  UserCircle,
  ChevronDown,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const isAuthPage = location.pathname === "/auth";
  const loggedIn = !!user;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate("/auth");
  };

  const navLinks = loggedIn ? [
    { name: "Home", icon: <Home size={18} />, to: "/" },
    { name: "Interview", icon: <Users size={18} />, to: "/interview" },
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/dashboard" },
    { name: "About", icon: <BookOpen size={18} />, to: "/about" },
  ] : [
    { name: "Home", icon: <Home size={18} />, to: "/" },
    { name: "About", icon: <BookOpen size={18} />, to: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Subtitle wrapped and sized */}
          <div className="flex flex-col justify-center items-start h-full" style={{ minWidth: '120px', maxWidth: '180px' }}>
            <Link to="/" className="group inline-block cursor-pointer" style={{ textDecoration: 'none' }}>
              <span className="text-[#43bfc7] font-bold" style={{ fontSize: '1.35rem', letterSpacing: '1.5px', textShadow: '0 2px 8px rgba(38,79,78,0.3)', fontFamily: 'Montserrat, Arial, sans-serif', filter: 'contrast(1.5) brightness(1.2)', lineHeight: 1.1, display: 'block', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <span className="inline-block transform transition-transform duration-200 group-hover:-rotate-3">Pathwise</span>
              </span>
              <span className="text-[#43bfc7]" style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8, marginTop: '2px', letterSpacing: '1px', fontFamily: 'Montserrat, Arial, sans-serif', lineHeight: 1.1, display: 'block', textAlign: 'left', whiteSpace: 'nowrap' }}>
                <span className="inline-block transition-colors duration-200 group-hover:opacity-100 group-hover:text-white/90">AI Job Portal</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`cursor-pointer group relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                    ${isActive ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"}
                  `}
                >
                  {link.icon}
                  <span className="font-semibold">{link.name}</span>
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 
                    ${isActive ? "w-3/4" : "w-0 group-hover:w-3/4"}`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Account Section */}
<div className="hidden lg:flex items-center w-32 justify-end">
  <div className="w-full flex justify-end">
    {(!loggedIn && (location.pathname === "/" || location.pathname === "/about")) && (
      <Link to="/auth">
        <button
          className="cursor-pointer px-6 py-2.5 rounded-full
          bg-transparent border border-white/20
          text-white font-semibold tracking-wide
          transition-all duration-300
          hover:bg-white/10
          hover:border-white/40"
        >
          Login
        </button>
      </Link>
    )}
    {loggedIn && !isAuthPage && (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdown((prev) => !prev)}
          className={`group cursor-pointer flex items-center gap-3 px-6 py-2.5
            rounded-full
            bg-transparent border border-white/20
            text-white font-semibold tracking-wide
            transition-all duration-300
            hover:bg-white/10
            hover:border-white/40
          `}
          aria-label="Profile menu"
        >
          {/* Profile Icon with glow on hover */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
            <UserCircle size={20} className="text-white/90" />
          </div>

          <span className="hidden sm:inline tracking-wide">Account</span>

          <ChevronDown
            size={16}
            className={`ml-1 transition-transform duration-300 ${
              dropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdown && (
          <div className="absolute right-0 mt-3 w-72 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            <button
              onClick={() => {
                setDropdown(false);
                navigate("/profile");
              }}
              className="cursor-pointer w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#222] transition-colors flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <UserCircle size={18} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-100">Profile</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  View your interview history
                </div>
              </div>
            </button>
            <div className="h-px bg-white/10"></div>
            <button
              onClick={() => {
                setDropdown(false);
                navigate("/help");
              }}
              className="cursor-pointer w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#222] transition-colors flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <HelpCircle size={18} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-100">Help & Support</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  FAQs and documentation
                </div>
              </div>
            </button>
            <div className="h-px bg-white/10"></div>
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full px-5 py-4 text-left text-white bg-[#1a1a1a] hover:bg-[#2a0000] transition-colors flex items-start gap-3 group"
            >
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
                <LogOut size={18} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-100">Logout</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Sign out of your account
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</div>


          {/* Mobile Navigation Icons */}
          <div className="flex lg:hidden items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  className={`cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  aria-label={link.name}
                >
                  {React.cloneElement(link.icon, { size: 22 })}
                </Link>
              );
            })}

            <button
  onClick={() => setIsOpen(!isOpen)}
  className={`cursor-pointer text-gray-300 hover:text-white 
  p-2.5 rounded-2xl 
  backdrop-blur-lg border border-white/10
  bg-white/5 
  hover:bg-white/10
  hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]
  transition-all duration-300 ml-2`}
  aria-label="Toggle menu"
>
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>

          </div>
        </div>
      </div>

      {/* Mobile Slide-in Account Menu */}
      <div
        className={`fixed inset-0 bg-black/80 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        <div
          className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-[#0d0d0d] border-l border-white/10 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
           {/* Header */}
<div className="flex items-center justify-between p-3 border-b border-white/10 backdrop-blur-xl">
  <h2
    className="text-lg font-extrabold tracking-wider 
    bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400
    text-transparent bg-clip-text
    select-none
    uppercase
    drop-shadow-sm"
  >
    Account
  </h2>
  <button
    onClick={() => setIsOpen(false)}
    className="cursor-pointer p-2 text-gray-400 hover:text-white 
    hover:bg-white/5 rounded-lg transition-all duration-300"
    aria-label="Close menu"
  >
    <X size={22} />
  </button>
</div>


           {/* Account actions */}
<div className="flex-1 flex flex-col p-5 gap-2 bg-[#0d0d0d]">
  {loggedIn && !isAuthPage ? (
    <>
      <button
        onClick={() => {
          setIsOpen(false);
          navigate("/profile");
        }}
        className="cursor-pointer w-full px-4 py-3 text-left text-white
        rounded-xl bg-[#1a1a1a] border border-white/10
        hover:bg-[#222] hover:shadow-[0_0_10px_rgba(59,130,246,0.25)]
        transition-all duration-300 flex items-start gap-2 group"
      >
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
          <UserCircle size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-100 text-sm">Profile</div>
          <div className="text-xs text-gray-400">Interview history</div>
        </div>
      </button>

      <button
        onClick={() => {
          setIsOpen(false);
          navigate("/help");
        }}
        className="cursor-pointer w-full px-4 py-3 text-left text-white
        rounded-xl bg-[#1a1a1a] border border-white/10
        hover:bg-[#222] hover:shadow-[0_0_10px_rgba(168,85,247,0.25)]
        transition-all duration-300 flex items-start gap-2 group"
      >
        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
          <HelpCircle size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-100 text-sm">Help & Support</div>
          <div className="text-xs text-gray-400">FAQs and docs</div>
        </div>
      </button>

      <button
        onClick={() => {
          handleLogout();
          setIsOpen(false);
        }}
        className="cursor-pointer w-full px-4 py-3 text-left text-white
        rounded-xl bg-[#1a1a1a] border border-white/10
        hover:bg-[#2a0000] hover:shadow-[0_0_10px_rgba(239,68,68,0.35)]
        transition-all duration-300 flex items-start gap-2 group"
      >
        <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
          <LogOut size={18} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-100 text-sm">Logout</div>
          <div className="text-xs text-gray-400">Sign out</div>
        </div>
      </button>
    </>
  ) : !loggedIn && (location.pathname === "/" || location.pathname === "/about") ? (
    <Link
      to="/auth"
      className="cursor-pointer flex items-center justify-center gap-2 w-full px-6 py-3
      rounded-xl bg-gradient-to-r from-gray-200 to-gray-400
      text-black font-semibold text-sm
      hover:scale-[1.02] hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-300"
      onClick={() => setIsOpen(false)}
    >
      <UserCircle size={18} />
      <span>Login</span>
    </Link>
  ) : null}
</div>

          </div>
        </div>
      </div>
    </nav>
  );
}
