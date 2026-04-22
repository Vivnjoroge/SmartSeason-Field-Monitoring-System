// Application router and protected layout wiring for SmartSeason frontend.
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import CreateField from './pages/CreateField';
import FieldDetail from './pages/FieldDetail';
import Login from './pages/Login';
import ProtectedRoute from './routes/ProtectedRoute';

const RoleRedirect = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <Navigate to="/dashboard/agent" replace />;
};

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/fields/:id" element={<FieldDetail />} />

            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/fields/new" element={<CreateField />} />
            </Route>

            <Route element={<ProtectedRoute role="agent" />}>
              <Route path="/dashboard/agent" element={<AgentDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
