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
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
          onClick={() => navigate('/')}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-900 text-white shadow-soft">
            <Sprout size={24} />
          </div>
          <div className="flex flex-col cursor-pointer">
            <span className="text-xl font-bold tracking-tight text-slate-900 font-outfit leading-none">SmartSeason</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-forest-600">Premium Agri-Care</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <div className="hidden items-center gap-4 border-r border-slate-100 pr-8 sm:flex">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 font-outfit">{user?.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-forest-500">{user?.role}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 ring-2 ring-white shadow-soft">
              <User size={20} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex h-11 items-center gap-2 rounded-xl bg-slate-50 px-5 text-sm font-bold text-slate-600 transition-all hover:bg-forest-50 hover:text-forest-700 active:scale-95"
          >
            <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
            <span className="hidden sm:inline">Terminate</span>
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
