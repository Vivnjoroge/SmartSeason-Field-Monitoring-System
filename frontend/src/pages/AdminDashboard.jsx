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
  Search
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Admin Dashboard</h1>
          <p className="text-slate-500">Overview of all active monitoring fields.</p>
        </div>
        <Link
          to="/fields/new"
          className="btn-premium group flex items-center justify-center gap-2"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90" />
          Add New Field
        </Link>
      </div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          label="Total Fields" 
          value={summary.total} 
          icon={<Layers size={24} />} 
          color="bg-blue-500" 
          variants={itemVariants}
        />
        <SummaryCard 
          label="Active" 
          value={summary.active} 
          icon={<LayoutDashboard size={24} />} 
          color="bg-emerald-500" 
          variants={itemVariants}
        />
        <SummaryCard 
          label="At Risk" 
          value={summary.atRisk} 
          icon={<AlertTriangle size={24} />} 
          color="bg-amber-500" 
          variants={itemVariants}
        />
        <SummaryCard 
          label="Completed" 
          value={summary.completed} 
          icon={<CheckCircle2 size={24} />} 
          color="bg-slate-500" 
          variants={itemVariants}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 font-outfit">Field Inventory</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </span>
            <input 
              type="text"
              placeholder="Search fields, crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 w-64"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Field Name</th>
                  <th className="px-6 py-4">Crop Detail</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assigned Agent</th>
                  <th className="px-6 py-4">Planting Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic-none">
                {filteredFields.map((field) => (
                  <tr key={field.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{field.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Sprout size={14} className="text-emerald-500" />
                        {field.crop_type}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600">{field.stage}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={field.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <UserIcon size={14} className="text-slate-400" />
                        {field.agent_name || <span className="text-slate-400 italic">Unassigned</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(field.planting_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/fields/${field.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-emerald-600 group-hover:border-emerald-200"
                      >
                        <Eye size={14} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFields.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">No fields found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SummaryCard = ({ label, value, icon, color, variants }) => {
  return (
    <motion.div 
      variants={variants}
      className="card-hover group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 ${color}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 font-outfit">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} bg-opacity-10 text-slate-900`}>
          <div className={`text-white p-2 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
