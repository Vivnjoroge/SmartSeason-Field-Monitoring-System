// Login page for authenticating admin and agent users.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Mail, Lock, ArrowRight, RefreshCw } from 'lucide-react';

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
      setError(apiError.response?.data?.message || 'Login details are incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-6">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2s]"
        style={{ backgroundImage: 'url("/home/ubuntu/.gemini/antigravity/brain/06bc7eff-800c-45b8-aaf5-20df8019f890/lush_modern_agri_field_1777023725141.png")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0 z-0 bg-forest-900/10 mix-blend-color" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-10 shadow-premium backdrop-blur-2xl"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-forest-500 text-white shadow-premium"
          >
            <Sprout size={40} />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">SmartSeason</h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-forest-200/60 uppercase">Track your fields easily</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-forest-400 transition-colors">
                <Mail size={18} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none ring-forest-500/20 transition-all placeholder:text-slate-600 focus:bg-white/10 focus:ring-4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-forest-400 transition-colors">
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
                className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 pl-12 pr-4 text-white outline-none ring-forest-500/20 transition-all placeholder:text-slate-600 focus:bg-white/10 focus:ring-4"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-red-400/10 p-3 text-xs font-bold text-red-400 border border-red-400/20 text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-forest-600 py-4 font-bold text-white shadow-premium transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-10 pt-6 text-center">
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
            &copy; 2026 SmartSeason Labs
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
