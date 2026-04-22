// Admin dashboard showing all fields with summary and management actions.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const AdminDashboard = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const summary = useMemo(() => {
    const total = fields.length;
    const active = fields.filter((field) => field.status === 'Active').length;
    const atRisk = fields.filter((field) => field.status === 'At Risk').length;
    const completed = fields.filter((field) => field.status === 'Completed').length;

    return { total, active, atRisk, completed };
  }, [fields]);

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <Link
          to="/fields/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add Field
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total Fields" value={summary.total} />
        <SummaryCard label="Active" value={summary.active} />
        <SummaryCard label="At Risk" value={summary.atRisk} />
        <SummaryCard label="Completed" value={summary.completed} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Field Name</th>
                <th className="px-4 py-3 font-semibold">Crop</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Agent</th>
                <th className="px-4 py-3 font-semibold">Planting Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map((field) => (
                <tr key={field.id}>
                  <td className="px-4 py-3">{field.name}</td>
                  <td className="px-4 py-3">{field.crop_type}</td>
                  <td className="px-4 py-3">{field.stage}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={field.status} />
                  </td>
                  <td className="px-4 py-3">{field.agent_name || 'Unassigned'}</td>
                  <td className="px-4 py-3">{new Date(field.planting_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/fields/${field.id}`}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default AdminDashboard;
