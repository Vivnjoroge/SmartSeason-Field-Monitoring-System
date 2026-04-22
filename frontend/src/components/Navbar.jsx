// Top navigation bar with app branding, user identity, and logout action.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="text-xl font-bold text-slate-900">SmartSeason</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            {user?.name} ({user?.role})
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
