export default function PincodeStatusLabels({ loading, error, details, localities = [], className = '' }) {
  const hasSuccess = Boolean(details && !loading && !error);
  const hasMultipleLocalities = Array.isArray(localities) && localities.length > 1;

  if (!loading && !error && !hasSuccess && !hasMultipleLocalities) {
    return null;
  }

  return (
    <div className={`mt-2 flex flex-wrap items-center gap-2 text-[11px] ${className}`.trim()}>
      {loading && (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-semibold text-amber-700">
          Validating PIN code...
        </span>
      )}

      {error && (
        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">
          {error}
        </span>
      )}

      {hasSuccess && (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
          PIN verified: {details.district}, {details.state}
        </span>
      )}

      {hasMultipleLocalities && (
        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 font-semibold text-sky-700">
          {localities.length} locality options available in City
        </span>
      )}
    </div>
  );
}
