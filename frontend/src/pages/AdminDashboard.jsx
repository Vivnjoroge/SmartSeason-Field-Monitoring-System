// Admin dashboard showing all fields with summary and management actions.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calendar,
  User as UserIcon,
  Search,
  Sprout
} from 'lucide-react';

const AdminDashboard = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fields');
      setFields(response.data);
      setError('');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const filteredFields = useMemo(() => {
    return fields.filter(field =>
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.crop_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (field.agent_name && field.agent_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [fields, searchTerm]);

  const summary = useMemo(() => {
    const total = fields.length;
    const active = fields.filter((field) => field.status === 'Active').length;
    const atRisk = fields.filter((field) => field.status === 'At Risk').length;
    const completed = fields.filter((field) => field.status === 'Completed').length;

    return { total, active, atRisk, completed };
  }, [fields]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-600 border-t-transparent"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.05, ease: "easeOut", duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-12"
    >
      {/* Executive Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">Field Dashboard</h1>
          <p className="mt-2 text-slate-500 font-medium tracking-tight">Overview of all field progress and status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/fields/new"
            className="flex h-11 items-center gap-2 rounded-xl bg-forest-800 px-6 text-sm font-semibold text-white shadow-soft transition-all hover:bg-forest-700 hover:shadow-premium active:scale-95"
          >
            <Plus size={18} />
            Add New Field
          </Link>
        </div>
      </div>

      {/* Modern Insight Cards */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          label="Total Fields"
          value={summary.total}
          icon={<Layers size={20} />}
          trend="All Fields"
          color="text-slate-600"
          bg="bg-slate-100"
          variants={itemVariants}
        />
        <InsightCard
          label="Healthy"
          value={summary.active}
          icon={<CheckCircle2 size={20} />}
          trend="Progressing"
          color="text-forest-600"
          bg="bg-forest-50"
          variants={itemVariants}
        />
        <InsightCard
          label="Needs Help"
          value={summary.atRisk}
          icon={<AlertTriangle size={20} />}
          trend="Delayed"
          color="text-amber-600"
          bg="bg-amber-50"
          variants={itemVariants}
        />
        <InsightCard
          label="Harvested"
          value={summary.completed}
          icon={<LayoutDashboard size={20} />}
          trend="Lifecycle End"
          color="text-blue-600"
          bg="bg-blue-50"
          variants={itemVariants}
        />
      </div>

      {/* Simplified Inventory */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-slate-900">All Fields</h2>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-forest-600 transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search for a field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-xl border-none bg-slate-100/50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-forest-500/10"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white/50 shadow-soft backdrop-blur-sm">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
              <tr>
                <th className="px-8 py-5">Field Name</th>
                <th className="px-8 py-5">Crop</th>
                <th className="px-8 py-5">Stage</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Agent</th>
                <th className="px-8 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFields.map((field) => (
                <tr key={field.id} className="group transition-colors hover:bg-white">
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900">{field.name}</div>
                    <div className="text-[10px] text-slate-400">ID: {field.id.toString().padStart(4, '0')}</div>
                  </td>
                  <td className="px-8 py-6 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Sprout size={14} className="text-forest-500" />
                      {field.crop_type}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-semibold text-slate-500">{field.stage}</span>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={field.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {field.agent_name ? field.agent_name.charAt(0) : '?'}
                      </div>
                      <span className="text-xs font-medium">{field.agent_name || 'Pending'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      to={`/fields/${field.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-forest-50 hover:text-forest-600"
                    >
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFields.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Search size={32} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 text-lg">No Results found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filter or search query.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InsightCard = ({ label, value, icon, trend, color, bg, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="group relative rounded-[2rem] border border-slate-100 bg-white p-7 shadow-soft transition-all hover:shadow-premium"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <span className={`h-1 w-1 rounded-full ${bg} ${color}`}></span>
            {trend}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;


