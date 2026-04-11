import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, History, Award, Edit, X, MapPin, Phone, Mail, Calendar, Save, Loader2, TrendingUp, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    picture: user?.picture || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg-secondary border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-fuchsia-400" /> Edit Profile
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="relative w-24 h-24 group cursor-pointer">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-fuchsia-500/50 bg-bg-tertiary">
                {formData.picture ? (
                  <img src={formData.picture} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-slate-400">Click to change photo</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-bg-tertiary border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-bg-tertiary border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-bg-tertiary border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                placeholder="New York, USA"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-medium hover:from-fuchsia-500 hover:to-purple-500 transition-all shadow-lg shadow-fuchsia-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [attempts, setAttempts] = useState([]);

  // Load real data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getAttempts();
        setAttempts(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load attempts", err);
        const raw = localStorage.getItem("interview_attempts_v1");
        if (raw) setAttempts(JSON.parse(raw).reverse().slice(0, 5));
      }
    };
    loadData();
    window.addEventListener('attempts-updated', loadData);
    return () => window.removeEventListener('attempts-updated', loadData);
  }, []);

  const handleUpdateProfile = async (data) => {
    await api.updateProfile(data);
    await refreshUserData();
  };

  const stats = [
    { label: 'Total Interviews', value: attempts.length, icon: History, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Average Score', value: `${attempts.length ? Math.round(attempts.reduce((a, b) => a + b.scorePercent, 0) / attempts.length) : 0}%`, icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Highest Score', value: `${attempts.length ? Math.max(...attempts.map(a => a.scorePercent)) : 0}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-white pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-bg-secondary border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 p-1 shadow-xl shadow-fuchsia-500/20">
                <div className="w-full h-full rounded-full bg-bg-secondary flex items-center justify-center overflow-hidden">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <button
                      onClick={() => setShowEditPopup(true)}
                      className="w-full h-full flex flex-col items-center justify-center gap-2 bg-bg-tertiary hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-slate-400 group-hover:text-fuchsia-400 transition-colors" />
                      <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">Add Photo</span>
                    </button>
                  )}
                </div>
              </div>
              {/* Edit button overlay - only show if picture exists, otherwise the whole area is a button */}
              {user?.picture && (
                <button
                  onClick={() => setShowEditPopup(true)}
                  className="absolute bottom-0 right-0 p-2 bg-white text-bg-primary rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{user?.name}</h1>
                <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Mail className="w-4 h-4" /> {user?.email}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="w-4 h-4 text-fuchsia-400" />
                  {user?.location || "Add location"}
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-blue-400" />
                  {user?.phone || "Add phone number"}
                </div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-green-400" />
                  Joined {new Date().getFullYear()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowEditPopup(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all flex items-center gap-2 group"
            >
              <Edit className="w-4 h-4 group-hover:text-fuchsia-400 transition-colors" />
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg-secondary border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-white/20 transition-colors"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-secondary border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="text-fuchsia-400" /> Recent Activity
            </h2>
            <button className="text-sm text-slate-400 hover:text-white transition-colors">View All</button>
          </div>

          <div className="space-y-4">
            {attempts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <History className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No interviews taken yet.</p>
                <button
                  onClick={() => navigate('/interview')}
                  className="mt-4 px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start your first interview
                </button>
              </div>
            ) : (
              attempts.map((att, i) => (
                <div key={i} className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white capitalize group-hover:text-fuchsia-400 transition-colors">
                        {att.type} Interview
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{att.mode} Mode</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span>{new Date(att.timestamp).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${att.scorePercent >= 80 ? 'text-green-400' :
                      att.scorePercent >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                      {att.scorePercent}%
                    </span>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEditPopup && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditPopup(false)}
            onSave={handleUpdateProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}