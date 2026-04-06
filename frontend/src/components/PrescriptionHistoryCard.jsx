import { FileText, Trash2, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const PrescriptionHistoryCard = ({
  prescription,
  onExtract,
  onDelete,
  isLoading,
}) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      uploaded: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Clock,
        label: 'Uploaded',
      },
      processing: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Clock,
        label: 'Processing',
      },
      extracted: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Extracted',
      },
      error: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: AlertCircle,
        label: 'Error',
      },
    };

    const statusInfo = statusMap[status] || statusMap.uploaded;
    const Icon = statusInfo.icon;

    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
      >
        <Icon size={14} />
        {statusInfo.label}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 p-3">
          <FileText className="text-cyan-600" size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 truncate">
                {prescription.fileName}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Uploaded: {formatDate(prescription.createdAt)}
              </p>
            </div>
            {getStatusBadge(prescription.status)}
          </div>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
            <span>{formatFileSize(prescription.fileSize)}</span>
            {prescription.extractedMedicines?.length > 0 && (
              <span>
                💊 {prescription.extractedMedicines.length} medicine
                {prescription.extractedMedicines.length !== 1 ? 's' : ''}
              </span>
            )}
            {prescription.addedToCart && (
              <span className="text-emerald-600">✓ Added to cart</span>
            )}
          </div>

          {/* Error message */}
          {prescription.errorMessage && (
            <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">
              {prescription.errorMessage}
            </div>
          )}
        </div>

        {/* Actions */}
        {prescription.status === 'extracted' && !prescription.addedToCart && (
          <button
            onClick={() => onExtract(prescription._id)}
            disabled={isLoading}
            className="mt-1 inline-flex items-center gap-1 rounded-lg bg-cyan-50 px-3 py-2 text-sm font-medium text-cyan-600 hover:bg-cyan-100 disabled:opacity-50 transition"
          >
            <ChevronRight size={16} />
            Select
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={() => onDelete(prescription._id)}
          disabled={isLoading}
          className="text-slate-400 hover:text-red-600 disabled:opacity-50 transition"
          title="Delete prescription"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionHistoryCard;
