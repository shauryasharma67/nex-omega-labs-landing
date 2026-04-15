import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Lock, Code, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      // Simple hardcoded check for demo purposes
      if (email === 'admin@nexomega.ai' && password === 'admin123') {
        // Store simple auth flag in localStorage
        localStorage.setItem('nex_admin_auth', 'true');
        navigate('/admin-dashboard');
      } else {
        setError('Invalid credentials. Hint: admin@nexomega.ai / admin123');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="admin-root flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-[#0e1118]">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-[#7c5cfc]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-[#06d6a0]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center mb-8"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cfc] to-[#06d6a0] flex items-center justify-center mb-4 shadow-lg shadow-[#7c5cfc]/20">
          <Bot size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Nex<span className="gradient-text">Ω</span> Access
        </h1>
        <p className="text-[#a1a1aa] text-sm mt-2">Secure Administrator Gateway</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-[#a1a1aa] uppercase ml-1">Work Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#18181b]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50 transition-all"
                  placeholder="admin@nexomega.ai"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-[#a1a1aa] uppercase ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52525b]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#18181b]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#7c5cfc]/50 focus:ring-1 focus:ring-[#7c5cfc]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm font-medium text-center bg-red-400/10 rounded-lg py-2"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#6345de] hover:from-[#6d4eed] hover:to-[#5538ce] text-white font-medium rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7c5cfc]/25 hover:shadow-[#7c5cfc]/40 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-[#52525b]">
            <ShieldCheck size={14} className="text-[#06d6a0]" />
            End-to-End Encrypted Session
          </div>
        </div>
      </motion.div>
      
      {/* Decorative floating code snippets or dots can go here */}
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[10%] hidden lg:block text-[#52525b]/40 font-mono text-xs"
      >
        <Code size={24} />
      </motion.div>
    </div>
  );
}
