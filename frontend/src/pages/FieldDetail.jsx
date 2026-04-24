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
  Save,
  RefreshCw
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
      setError(apiError.response?.data?.message || 'Failed to load intelligence report');
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
      setError(apiError.response?.data?.message || 'Failed to synchronize stage data');
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
      setError(apiError.response?.data?.message || 'Failed to archive field observation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !field) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error && !field) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-red-600">
        <Activity size={48} className="mb-4 opacity-20" />
        <p className="text-xl font-bold">{error}</p>
        <Link to="/" className="mt-6 text-forest-600 font-bold hover:underline">Return to Hub</Link>
      </div>
    );
  }

  if (!field) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12"
    >
      <div className="mb-8 flex items-center gap-6">
        <Link 
          to="/" 
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-soft transition-all hover:bg-forest-50 hover:text-forest-600 active:scale-90"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{field.name}</h1>
          <p className="mt-2 text-slate-500 tracking-wide uppercase text-[10px] font-bold">Field Asset Identification: {field.id.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {/* Executive Overview Card */}
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-soft">
            <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-50 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900">
                <Activity size={20} className="text-forest-600" />
                Intelligence Summary
              </h2>
              <StatusBadge status={field.status} />
            </div>
            <div className="p-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <StatItem icon={<Sprout size={24} className="text-forest-500" />} label="Plant Classification" value={field.crop_type} />
              <StatItem icon={<Calendar size={24} className="text-blue-500" />} label="Initialization Date" value={new Date(field.planting_date).toLocaleDateString(undefined, { dateStyle: 'long' })} />
              <StatItem icon={<Activity size={24} className="text-amber-500" />} label="Active Status" value={field.stage} />
              <StatItem icon={<UserIcon size={24} className="text-slate-500" />} label="Field Custodian" value={field.agent_name || 'Awaiting Assignment'} />
            </div>
          </div>

          {/* Chronological Monitoring Feed */}
          <div className="space-y-8">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 px-2">
              <Clock size={24} className="text-forest-600" />
              Monitoring Log Feed
            </h2>
            
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-7 before:h-full before:w-0.5 before:bg-slate-100">
              {field.updates.length === 0 ? (
                <div className="ml-16 py-10 italic text-slate-400 font-medium">No intelligence activity recorded for this asset.</div>
              ) : (
                field.updates.map((update, idx) => (
                  <motion.div 
                    key={update.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative ml-16"
                  >
                    <div className="absolute -left-16 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-slate-50 bg-white text-forest-600 shadow-soft">
                      {update.stage ? <Activity size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-soft transition-all hover:shadow-premium group">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                          {new Date(update.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        {update.agent_name && (
                          <div className="flex items-center gap-2 rounded-xl bg-forest-50 px-3 py-1.5 text-[10px] font-bold text-forest-700">
                             <UserIcon size={12} />
                             {update.agent_name}
                          </div>
                        )}
                      </div>
                      {update.stage && (
                        <div className="mb-3">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 tracking-wider">
                            <RefreshCw size={10} />
                            STAGE UPDATE: {update.stage.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {update.note && (
                        <p className="text-sm leading-relaxed text-slate-600 font-medium">{update.note}</p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Intelligence Hub */}
        <div className="space-y-8">
          {isOwner ? (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Stage Sync Control */}
                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-soft">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Precision Sync</h3>
                  <form onSubmit={handleUpdateStage} className="space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Lifecycle Stage</p>
                       <div className="relative group">
                          <select
                            value={stage}
                            onChange={(event) => setStage(event.target.value)}
                            className="w-full appearance-none rounded-2xl border-none bg-slate-100/50 px-5 py-3.5 text-sm font-bold text-slate-700 outline-none ring-forest-500/10 transition-all focus:bg-white focus:ring-4"
                          >
                            <option value="Planted">Planted</option>
                            <option value="Growing">Growing</option>
                            <option value="Ready">Ready</option>
                            <option value="Harvested">Harvested</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400">
                            <Activity size={18} />
                          </div>
                       </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || stage === field.stage}
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-forest-800 py-4 text-sm font-bold text-white shadow-soft transition-all hover:bg-forest-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
                    >
                      <Save size={20} className="transition-transform group-hover:scale-110" />
                      Synchronize Stage
                    </button>
                  </form>
                </div>

                {/* Observation Archive */}
                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-soft">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Archive Observation</h3>
                  <form onSubmit={handleAddNote} className="space-y-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Observation Data</p>
                       <textarea
                          value={note}
                          onChange={(event) => setNote(event.target.value)}
                          required
                          rows={6}
                          className="w-full rounded-2xl border-none bg-slate-100/50 p-5 text-sm font-medium outline-none ring-forest-500/10 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4"
                          placeholder="Document key physiological indicators or environmental stressors..."
                       />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !note.trim()}
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white shadow-soft transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
                    >
                      <Send size={20} className="transition-transform group-hover:translate-x-1" />
                      Archive Intelligence
                    </button>
                  </form>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="rounded-[2.5rem] border border-slate-100 bg-forest-50/30 p-10 text-center shadow-soft ring-1 ring-forest-100">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-forest-300 shadow-soft">
                 <Activity size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Observer Access Only</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-500 font-medium px-2">
                Your privileges are restricted to intelligence review. Monitoring updates are reserved for the assigned Field Custodian.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 group">
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all group-hover:bg-forest-50 group-hover:text-forest-600 group-hover:shadow-soft border border-slate-50">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 group-hover:text-forest-400 transition-colors">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default FieldDetail;
