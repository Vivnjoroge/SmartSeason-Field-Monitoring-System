// Field business logic for deriving operational status from timeline data.
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const normalizeDate = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const daysBetween = (fromDate, toDate) => {
  return Math.floor((toDate.getTime() - fromDate.getTime()) / MS_PER_DAY);
};

const computeStatus = (field, lastUpdateDate) => {
  if (field.stage === 'Harvested') {
    return 'Completed';
  }

  const today = normalizeDate(new Date());
  const plantedDate = normalizeDate(field.planting_date);
  const plantedDaysAgo = daysBetween(plantedDate, today);

  const effectiveUpdateDate = lastUpdateDate
    ? normalizeDate(lastUpdateDate)
    : plantedDate;
  const daysSinceUpdate = daysBetween(effectiveUpdateDate, today);

  if (plantedDaysAgo > 90 || daysSinceUpdate > 14) {
    return 'At Risk';
  }

  return 'Active';
};

const enrichFieldWithStatus = (field, lastUpdateDate) => {
  return {
    ...field,
    status: computeStatus(field, lastUpdateDate),
  };
};

module.exports = {
  computeStatus,
  enrichFieldWithStatus,
};
