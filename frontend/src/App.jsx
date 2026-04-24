// Application router and protected layout wiring for SmartSeason frontend.
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
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
    <div
      className="flex min-h-screen"
      style={{ background: 'radial-gradient(ellipse at top left, #f1f8f3 0%, #f8fafc 50%, #f1f5f9 100%)' }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-10 lg:px-12 lg:py-14">
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
