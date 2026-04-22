// Top navigation bar with app branding, user identity, and logout action.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Sprout, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-xl font-bold text-[#1a4d2e]"
        >
          <Sprout className="h-6 w-6 text-emerald-600" />
          <span className="tracking-tight">SmartSeason</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">{user?.role}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 hover:shadow-lg active:scale-95"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
