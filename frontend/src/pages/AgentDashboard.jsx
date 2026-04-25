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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-600 border-t-transparent"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, y: 0,
      transition: { staggerChildren: 0.1, duration: 0.4 }
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
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">My Fields</h1>
          <p className="mt-2 text-slate-500 font-medium">Keep your assigned fields up to date.</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="My Fields"
          value={summary.total}
          icon={<Layers size={20} />}
          color="text-forest-800"
          bg="bg-forest-100"
          variants={itemVariants}
        />
        <SummaryCard
          label="Healthy"
          value={summary.active}
          icon={<LayoutDashboard size={20} />}
          color="text-emerald-700"
          bg="bg-emerald-50"
          variants={itemVariants}
        />
        <SummaryCard
          label="At Risk"
          value={summary.atRisk}
          icon={<AlertTriangle size={20} />}
          color="text-amber-700"
          bg="bg-amber-50"
          variants={itemVariants}
        />
        <SummaryCard
          label="Completed"
          value={summary.completed}
          icon={<CheckCircle2 size={20} />}
          color="text-slate-600"
          bg="bg-slate-100"
          variants={itemVariants}
        />
      </div>

      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
          <h2 className="text-2xl font-bold text-slate-900">Updates Needed</h2>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-forest-600 transition-colors">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search for a field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-xl border-none bg-slate-100/50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-forest-500/10"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Field Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Stage</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Update Stage</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredFields.map((field) => (
                  <tr key={field.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600 shadow-sm border border-forest-100/50 group-hover:scale-110 transition-transform">
                          <Sprout size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{field.name}</p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{field.crop_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition-all group-hover:bg-forest-50 group-hover:text-forest-700">
                        {field.stage}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={field.status} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <select
                          value={stageByField[field.id] || field.stage}
                          onChange={(event) => handleStageChange(field.id, event.target.value)}
                          className="rounded-xl border-none bg-slate-100/50 px-3 py-1.5 text-[10px] font-bold text-slate-700 shadow-sm outline-none ring-forest-500/10 transition-all focus:bg-white focus:ring-4"
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
                          className="flex h-8 items-center justify-center rounded-xl bg-forest-800 px-4 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-forest-700 disabled:bg-slate-100 disabled:text-slate-300 active:scale-95"
                        >
                          {updatingId === field.id ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            'Update'
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        to={`/fields/${field.id}`}
                        className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-forest-600 transition-colors uppercase tracking-widest"
                      >
                        VIEW
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFields.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                <Search size={32} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 text-lg">No Fields Found</h3>
              <p className="text-sm text-slate-400">You don't have any matching fields right now.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SummaryCard = ({ label, value, icon, color, bg, variants }) => {
  return (
    <motion.div
      variants={variants}
      className="group relative rounded-[2rem] border border-slate-100 bg-white p-7 shadow-soft transition-all hover:shadow-premium"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default AgentDashboard;


