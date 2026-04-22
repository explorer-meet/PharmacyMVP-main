const TONE_CLASS_MAP = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  progress: 'border-blue-200 bg-blue-50 text-blue-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
};

const SIZE_CLASS_MAP = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

const normalizeStatusValue = (value) => String(value || '').trim().toLowerCase();

export const getStatusTone = (value) => {
  const normalized = normalizeStatusValue(value);

  if (!normalized) return 'neutral';

  if (/delivered|approved|active|verified|success|completed|picked up|done/.test(normalized)) {
    return 'success';
  }

  if (/rejected|failed|error|expired|inactive|cancelled|canceled|blocked/.test(normalized)) {
    return 'danger';
  }

  if (/pending|review|queued|waiting|hold/.test(normalized)) {
    return 'warning';
  }

  if (/order placed|booking|packed|shipped|in transit|out for delivery|processing/.test(normalized)) {
    return 'progress';
  }

  return 'info';
};

const formatLabel = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return 'Unknown';

  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function StatusBadge({
  value,
  label,
  tone,
  size = 'sm',
  className = '',
}) {
  const resolvedTone = tone || getStatusTone(value || label);
  const toneClasses = TONE_CLASS_MAP[resolvedTone] || TONE_CLASS_MAP.info;
  const sizeClasses = SIZE_CLASS_MAP[size] || SIZE_CLASS_MAP.sm;

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${sizeClasses} ${toneClasses} ${className}`.trim()}>
      {label || formatLabel(value)}
    </span>
  );
}
