// Login page for authenticating admin and agent users.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sprout, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      login(token, user);

      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/agent');
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-900 px-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-overlay"
        style={{ backgroundImage: 'url("/home/ubuntu/.gemini/antigravity/brain/ef7365fd-7588-468b-9251-71fbcaa9724d/login_bg_agricultural_field_1776859204687.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a4d2e]/40 to-slate-900/90" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Sprout size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">SmartSeason</h1>
          <p className="mt-2 text-sm text-slate-300">Agricultural Field Monitoring System</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@company.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white outline-none ring-emerald-500/50 transition-all focus:border-emerald-500 focus:bg-white/10 focus:ring-4"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock size={18} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-white outline-none ring-emerald-500/50 transition-all focus:border-emerald-500 focus:bg-white/10 focus:ring-4"
              />
            </div>
          </div>

          {error ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center"
            >
              {error}
            </motion.div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-slate-500">
            &copy; 2026 SmartSeason. Optimized Field Monitoring.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
