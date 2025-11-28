import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, History, Award, Edit, X } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [attempts, setAttempts] = useState([]);

  // Load real data
  useEffect(() => {
    const loadData = () => {
      const raw = localStorage.getItem("interview_attempts_v1"); // Use session-specific key logic in real app, but here localstorage is managed by sessionManager
      if (raw) setAttempts(JSON.parse(raw).reverse().slice(0, 5)); // Get last 5
    };
    loadData();
    window.addEventListener('attempts-updated', loadData);
    return () => window.removeEventListener('attempts-updated', loadData);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-white pt-24 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-bg-secondary border border-slate-700 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
            <p className="text-sky-400 mt-2">{user?.location || "Location not set"}</p>
          </div>
          <button onClick={() => setShowEditPopup(true)} className="px-6 py-2 border border-slate-600 rounded-lg hover:bg-slate-800">
            Edit Profile
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Interviews - REAL DATA */}
          <div className="bg-bg-secondary border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="text-sky-400" /> Recent Interviews
            </h2>
            <div className="space-y-4">
              {attempts.length === 0 ? (
                <p className="text-slate-500">No interviews taken yet.</p>
              ) : (
                attempts.map((att, i) => (
                  <div key={i} className="flex justify-between p-3 bg-bg-tertiary rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{att.type} ({att.mode})</p>
                      <p className="text-xs text-slate-400">{new Date(att.timestamp).toLocaleDateString()}</p>
                    </div>
                    <span className="text-teal-400 font-bold">{att.scorePercent}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Performance Stats - REAL DATA */}
          <div className="bg-bg-secondary border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="text-violet-400" /> Performance
            </h2>
            <div className="space-y-4">
               <div className="p-4 bg-bg-tertiary rounded-lg">
                 <p className="text-slate-400 text-sm">Total Interviews</p>
                 <p className="text-3xl font-bold text-white">{attempts.length}</p>
               </div>
               <div className="p-4 bg-bg-tertiary rounded-lg">
                 <p className="text-slate-400 text-sm">Average Score</p>
                 <p className="text-3xl font-bold text-teal-400">
                   {attempts.length ? Math.round(attempts.reduce((a,b)=>a+b.scorePercent,0)/attempts.length) : 0}%
                 </p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}