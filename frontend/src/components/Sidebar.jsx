// Shared sidebar navigation for Admin and Agent dashboards.
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Sprout,
  LayoutDashboard,
  Plus,
  LogOut,
  User,
  Leaf,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-forest-900 text-white shadow-soft'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white/80 backdrop-blur-xl"
      style={{ position: 'sticky', top: 0 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-slate-50">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-900 text-white shadow-soft">
          <Sprout size={22} />
        </div>
        <div>
          <p className="text-base font-bold tracking-tight text-slate-900 font-outfit leading-none">SmartSeason</p>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-forest-600 mt-0.5">Agri-Care</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <p className="mb-3 ml-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300">Navigation</p>

        {user?.role === 'admin' && (
          <>
            <NavLink to="/dashboard/admin" className={navLinkClass}>
              <LayoutDashboard size={18} />
              Overview
            </NavLink>
            <NavLink to="/fields/new" className={navLinkClass}>
              <Plus size={18} />
              Initialize Field
            </NavLink>
          </>
        )}

        {user?.role === 'agent' && (
          <NavLink to="/dashboard/agent" className={navLinkClass}>
            <Leaf size={18} />
            My Fields
          </NavLink>
        )}
      </nav>

      {/* User Card + Logout */}
      <div className="border-t border-slate-50 p-4 space-y-2">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-soft">
            <User size={18} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-bold text-slate-900 font-outfit">{user?.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-forest-600">{user?.role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} className="transition-transform group-hover:translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
