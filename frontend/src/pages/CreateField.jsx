// Admin form page for creating and assigning a new field.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import { ArrowLeft, Plus, Sprout, Calendar, User as UserIcon, Activity, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CreateField = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    planting_date: '',
    stage: 'Planted',
    agent_id: '',
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/users');
        setAgents(response.data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Failed to initialize agent registry');
      }
    };

    fetchAgents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/fields', {
        ...formData,
        agent_id: Number(formData.agent_id),
      });

      navigate('/dashboard/admin');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Field initialization protocols failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl pb-12"
    >
      <div className="mb-10 flex items-center gap-6">
        <Link 
          to="/" 
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-soft transition-all hover:bg-forest-50 hover:text-forest-600 active:scale-90"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Add New Field</h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Enter field details below</p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <InputField 
              label="Field Name" 
              name="name" 
              placeholder="e.g. North Field"
              value={formData.name} 
              onChange={handleChange} 
              icon={<Plus size={18} />}
            />

            <InputField 
              label="Crop Type" 
              name="crop_type" 
              placeholder="e.g. Corn"
              value={formData.crop_type} 
              onChange={handleChange} 
              icon={<Sprout size={18} />}
            />

            <InputField
              label="Planting Date"
              name="planting_date"
              type="date"
              value={formData.planting_date}
              onChange={handleChange}
              icon={<Calendar size={18} />}
            />

            <div className="space-y-2">
              <label htmlFor="stage" className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Current Stage
              </label>
              <div className="relative group">
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
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
          </div>

          <div className="space-y-2">
            <label htmlFor="agent_id" className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Assign to Agent
            </label>
            <div className="relative group">
              <select
                id="agent_id"
                name="agent_id"
                value={formData.agent_id}
                onChange={handleChange}
                required
                className="w-full appearance-none rounded-2xl border-none bg-slate-100/50 px-5 py-3.5 text-sm font-bold text-slate-700 outline-none ring-forest-500/10 transition-all focus:bg-white focus:ring-4"
              >
                <option value="">Select an agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} — {agent.email}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-slate-400">
                 <UserIcon size={18} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="rounded-xl bg-red-400/10 p-4 text-xs font-bold text-red-400 border border-red-400/20 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-forest-800 py-4 text-sm font-bold text-white shadow-soft transition-all hover:bg-forest-700 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
          >
            {loading ? (
              <RefreshCw size={22} className="animate-spin" />
            ) : (
              <>
                Save Field
                <ArrowLeft size={20} className="rotate-180 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, icon, type = 'text' }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="ml-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      <div className="relative group">
         <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400 group-focus-within:text-forest-600 transition-colors">
            {icon}
         </span>
         <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required
            placeholder={placeholder}
            className="w-full rounded-2xl border-none bg-slate-100/50 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none ring-forest-500/10 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4"
         />
      </div>
    </div>
  );
};

export default CreateField;
