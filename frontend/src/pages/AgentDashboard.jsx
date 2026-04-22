// Agent dashboard showing assigned fields and stage update actions.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sprout, 
  Calendar, 
  Eye, 
  RefreshCw,
  Search,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

const AgentDashboard = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stageByField, setStageByField] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fields');
      setFields(response.data);
      setError('');

      const nextStageMap = {};
      response.data.forEach((field) => {
        nextStageMap[field.id] = field.stage;
      });
      setStageByField(nextStageMap);
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
      field.crop_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fields, searchTerm]);

  const summary = useMemo(() => {
    const total = fields.length;
    const active = fields.filter((field) => field.status === 'Active').length;
    const atRisk = fields.filter((field) => field.status === 'At Risk').length;
    const completed = fields.filter((field) => field.status === 'Completed').length;

    return { total, active, atRisk, completed };
  }, [fields]);

  const handleStageChange = (fieldId, value) => {
    setStageByField((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleUpdateStage = async (fieldId) => {
    try {
      setUpdatingId(fieldId);
      await api.patch(`/fields/${fieldId}/stage`, {
        stage: stageByField[fieldId],
      });

      await fetchFields();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to update stage');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && fields.length === 0) {
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Agent Dashboard</h1>
          <p className="text-slate-500">Manage your assigned agricultural monitoring fields.</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          label="My Fields" 
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
          <h2 className="text-xl font-bold text-slate-900 font-outfit">Assigned Fields</h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={16} />
            </span>
            <input 
              type="text"
              placeholder="Filter fields..."
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
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-4 py-4">Current Stage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Planting Date</th>
                  <th className="px-6 py-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFields.map((field) => (
                  <tr key={field.id} className="group transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{field.name}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Sprout size={14} className="text-emerald-500" />
                        {field.crop_type}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <div className="flex items-center gap-2 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                        {field.stage}
                        <ChevronRight size={12} className="text-slate-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={field.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(field.planting_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/fields/${field.id}`}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                          <Eye size={16} />
                          Details
                        </Link>
                        
                        <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-1">
                          <select
                            value={stageByField[field.id] || field.stage}
                            onChange={(event) => handleStageChange(field.id, event.target.value)}
                            className="bg-transparent text-xs font-semibold text-slate-700 outline-none pr-1"
                          >
                            <option value="Planted">Planted</option>
                            <option value="Growing">Growing</option>
                            <option value="Ready">Ready</option>
                            <option value="Harvested">Harvested</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleUpdateStage(field.id)}
                            disabled={updatingId === field.id || stageByField[field.id] === field.stage}
                            className="flex h-7 items-center justify-center rounded-md bg-emerald-600 px-2 text-white transition-all hover:bg-emerald-500 disabled:bg-slate-300 active:scale-95"
                          >
                            {updatingId === field.id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <span className="text-[10px] font-bold">UPDATE</span>
                            )}
                          </button>
                        </div>
                      </div>
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
              <h3 className="mt-4 font-semibold text-slate-900">No fields assigned</h3>
              <p className="text-sm text-slate-500">You haven't been assigned any fields yet.</p>
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
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl opacity-10 ${color}`} />
        <div className={`absolute right-6 top-6 h-12 w-12 flex items-center justify-center rounded-xl ${color} bg-opacity-10`}>
          <div className={`text-white p-2 rounded-lg ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentDashboard;
