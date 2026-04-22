// Compact card view for displaying field summary information.
import StatusBadge from './StatusBadge';

const FieldCard = ({ field }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{field.name}</h3>
      <p className="mt-1 text-sm text-slate-600">Crop: {field.crop_type}</p>
      <p className="text-sm text-slate-600">Stage: {field.stage}</p>
      <div className="mt-3">
        <StatusBadge status={field.status} />
      </div>
    </div>
  );
};

export default FieldCard;
