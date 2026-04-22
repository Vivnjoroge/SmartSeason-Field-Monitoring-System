// Status badge component with refined colors and borders.
const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'At Risk': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-slate-50 text-slate-600 border-slate-200',
};

const StatusBadge = ({ status }) => {
  const classes = STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight ${classes}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
