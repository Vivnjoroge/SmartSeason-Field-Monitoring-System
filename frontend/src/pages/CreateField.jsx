// Admin form page for creating and assigning a new field.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
        setError(apiError.response?.data?.message || 'Failed to load agents');
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
      setError(apiError.response?.data?.message || 'Failed to create field');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Create Field</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Field Name" name="name" value={formData.name} onChange={handleChange} />

        <InputField label="Crop Type" name="crop_type" value={formData.crop_type} onChange={handleChange} />

        <InputField
          label="Planting Date"
          name="planting_date"
          type="date"
          value={formData.planting_date}
          onChange={handleChange}
        />

        <div>
          <label htmlFor="stage" className="mb-1 block text-sm font-medium text-slate-700">
            Stage
          </label>
          <select
            id="stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="Planted">Planted</option>
            <option value="Growing">Growing</option>
            <option value="Ready">Ready</option>
            <option value="Harvested">Harvested</option>
          </select>
        </div>

        <div>
          <label htmlFor="agent_id" className="mb-1 block text-sm font-medium text-slate-700">
            Assign Agent
          </label>
          <select
            id="agent_id"
            name="agent_id"
            value={formData.agent_id}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Field'}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = 'text' }) => {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-md border border-slate-300 px-3 py-2"
      />
    </div>
  );
};

export default CreateField;
