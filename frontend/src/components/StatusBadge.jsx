// Status badge component with Tailwind color variants per field health.
const STATUS_STYLES = {
  Active: 'bg-green-100 text-green-800',
  'At Risk': 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-gray-100 text-gray-600',
};

const StatusBadge = ({ status }) => {
  const classes = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
