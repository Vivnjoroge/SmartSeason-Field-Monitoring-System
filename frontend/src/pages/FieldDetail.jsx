// Detailed field page with timeline and agent update/note actions.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const FieldDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [field, setField] = useState(null);
  const [stage, setStage] = useState('Planted');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

    try {
      await api.patch(`/fields/${id}/stage`, { stage });
      await fetchField();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to update stage');
    }
  };

  const handleAddNote = async (event) => {
    event.preventDefault();

    try {
      await api.post(`/fields/${id}/notes`, { note });
      setNote('');
      await fetchField();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Failed to add note');
    }
  };

  if (loading) {
    return <p className="text-slate-600">Loading field...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!field) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{field.name}</h1>
        <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold">Crop:</span> {field.crop_type}
          </p>
          <p>
            <span className="font-semibold">Planting Date:</span>{' '}
            {new Date(field.planting_date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Stage:</span> {field.stage}
          </p>
          <p>
            <span className="font-semibold">Agent:</span> {field.agent_name || 'Unassigned'}
          </p>
          <p className="sm:col-span-2">
            <span className="font-semibold">Status:</span> <StatusBadge status={field.status} />
          </p>
        </div>
      </div>

      {isOwner ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleUpdateStage}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Update Stage</h2>
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            >
              <option value="Planted">Planted</option>
              <option value="Growing">Growing</option>
              <option value="Ready">Ready</option>
              <option value="Harvested">Harvested</option>
            </select>
            <button
              type="submit"
              className="mt-3 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Save Stage
            </button>
          </form>

          <form
            onSubmit={handleAddNote}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Add Note</h2>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              required
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="Add a field observation note..."
            />
            <button
              type="submit"
              className="mt-3 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save Note
            </button>
          </form>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Update History</h2>

        {field.updates.length === 0 ? (
          <p className="text-sm text-slate-600">No updates yet.</p>
        ) : (
          <ul className="space-y-3">
            {field.updates.map((update) => (
              <li key={update.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-xs text-slate-500">
                  {new Date(update.created_at).toLocaleString()} {update.agent_name ? `by ${update.agent_name}` : ''}
                </p>
                {update.stage ? (
                  <p className="mt-1 text-sm text-slate-800">Stage changed to: {update.stage}</p>
                ) : null}
                {update.note ? <p className="mt-1 text-sm text-slate-700">Note: {update.note}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FieldDetail;
