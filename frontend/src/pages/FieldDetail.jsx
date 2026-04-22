// Detailed field page with timeline and agent update/note actions.
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sprout, 
  Calendar, 
  User as UserIcon, 
  Activity, 
  FileText, 
  Clock,
  Send,
  Save
} from 'lucide-react';

const FieldDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [field, setField] = useState(null);
  const [stage, setStage] = useState('Planted');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchField = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/fields/${id}`);
      setField(response.data);
      setStage(response.data.stage);
      setError('');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to load field');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchField();
  }, [id]);

  const isOwner = user?.role === 'agent' && field?.agent_id === user?.id;

  const handleUpdateStage = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch(`/fields/${id}/stage`, { stage });
      await fetchField();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to update stage');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/fields/${id}/notes`, { note });
      setNote('');
      await fetchField();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !field) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !field) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-red-600">
        <Activity size={48} className="mb-4 opacity-20" />
        <p className="font-bold">{error}</p>
        <Link to="/" className="mt-4 text-emerald-600 font-semibold hover:underline">Go back to Dashboard</Link>
      </div>
    );
  }

  if (!field) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <Link 
          to="/" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">{field.name}</h1>
          <p className="text-slate-500">Field ID: #{field.id}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Field Overview Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-slate-900 font-outfit">
                <Activity size={18} className="text-emerald-500" />
                Field Overview
              </h2>
              <StatusBadge status={field.status} />
            </div>
            <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <StatItem icon={<Sprout className="text-emerald-500" />} label="Crop Type" value={field.crop_type} />
              <StatItem icon={<Calendar className="text-blue-500" />} label="Planting Date" value={new Date(field.planting_date).toLocaleDateString(undefined, { dateStyle: 'long' })} />
              <StatItem icon={<Activity className="text-amber-500" />} label="Growth Stage" value={field.stage} />
              <StatItem icon={<UserIcon className="text-slate-500" />} label="Assigned Agent" value={field.agent_name || 'Unassigned'} />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900 font-outfit text-xl">
              <Clock size={20} className="text-emerald-500" />
              Monitoring History
            </h2>
            
            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200">
              {field.updates.length === 0 ? (
                <div className="ml-12 italic text-slate-400">No activity logged for this field yet.</div>
              ) : (
                field.updates.map((update, idx) => (
                  <motion.div 
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative ml-12"
                  >
                    <div className="absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow-sm">
                      {update.stage ? <Activity size={16} /> : <FileText size={16} />}
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                      <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {new Date(update.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        {update.agent_name && (
                          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                             <UserIcon size={10} />
                             {update.agent_name}
                          </div>
                        )}
                      </div>
                      {update.stage && (
                        <p className="mb-2 inline-block rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                          STAGE: {update.stage}
                        </p>
                      )}
                      {update.note && (
                        <p className="text-sm leading-relaxed text-slate-700">{update.note}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {isOwner ? (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Update Stage Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-slate-900 font-outfit">Update Stage</h3>
                  <form onSubmit={handleUpdateStage} className="space-y-4">
                    <div className="relative">
                      <select
                        value={stage}
                        onChange={(event) => setStage(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none ring-emerald-500/10 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4"
                      >
                        <option value="Planted">Planted</option>
                        <option value="Growing">Growing</option>
                        <option value="Ready">Ready</option>
                        <option value="Harvested">Harvested</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                        <Activity size={16} />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || stage === field.stage}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 active:scale-95"
                    >
                      <Save size={18} className="transition-transform group-hover:scale-110" />
                      Save Environment Data
                    </button>
                  </form>
                </div>

                {/* Add Note Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-slate-900 font-outfit">Field Observations</h3>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <textarea
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      required
                      rows={5}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-emerald-500/10 transition-all focus:border-emerald-500 focus:bg-white focus:ring-4"
                      placeholder="Enter detailed observations about the current field status..."
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !note.trim()}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <Send size={18} className="transition-transform group-hover:translate-x-1" />
                      Submit Note
                    </button>
                  </form>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-emerald-50/50 p-6 text-center shadow-sm">
              <Activity size={40} className="mx-auto mb-4 text-emerald-300" />
              <h3 className="text-lg font-bold text-[#1a4d2e] font-outfit tracking-tight">Read-Only Access</h3>
              <p className="mt-2 text-xs leading-relaxed text-emerald-800 opacity-70">
                You are viewing this field record as an authorized observer. Only the assigned agent can submit monitoring updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon, label, value }) => (
  <div className="flex gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 shadow-sm border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-base font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

export default FieldDetail;
