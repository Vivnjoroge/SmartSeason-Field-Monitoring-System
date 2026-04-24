// Status badge component with refined colors and borders.
const STATUS_STYLES = {
  Active: 'bg-forest-50 text-forest-700 border-forest-200',
  'At Risk': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-slate-50 text-slate-600 border-slate-200',
};

const StatusBadge = ({ status }) => {
  const classes = STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-xl border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${classes}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
