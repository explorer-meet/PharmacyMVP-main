import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  Package,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { baseURL } from '../main';

const REASON_LABELS = {
  wrong_item: 'Wrong item received',
  damaged_pack: 'Damaged packaging',
  delayed_delivery: 'Delayed delivery',
  other: 'Other',
};

const STATUS_META = {
  open: { label: 'Open', color: 'bg-sky-50 border-sky-200 text-sky-700', icon: <Clock className="h-3.5 w-3.5" /> },
  evidence_requested: { label: 'Evidence Needed', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  evidence_submitted: { label: 'Evidence Sent', color: 'bg-blue-50 border-blue-200 text-blue-700', icon: <Upload className="h-3.5 w-3.5" /> },
  store_review: { label: 'Store Reviewing', color: 'bg-violet-50 border-violet-200 text-violet-700', icon: <RefreshCcw className="h-3.5 w-3.5" /> },
  admin_review: { label: 'Under Review', color: 'bg-orange-50 border-orange-200 text-orange-700', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  approved: { label: 'Approved', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: 'Rejected', color: 'bg-rose-50 border-rose-200 text-rose-700', icon: <XCircle className="h-3.5 w-3.5" /> },
  refunded: { label: 'Refunded', color: 'bg-teal-50 border-teal-200 text-teal-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  closed: { label: 'Closed', color: 'bg-slate-100 border-slate-200 text-slate-600', icon: <XCircle className="h-3.5 w-3.5" /> },
};

const STATUS_FILTERS = [
  { value: 'all', label: 'All', icon: <RotateCcw className="h-3.5 w-3.5" /> },
  { value: 'open', label: 'Open', icon: <Clock className="h-3.5 w-3.5" /> },
  { value: 'evidence_requested', label: 'Evidence Needed', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  { value: 'store_review', label: 'Store Review', icon: <RefreshCcw className="h-3.5 w-3.5" /> },
  { value: 'approved', label: 'Approved', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { value: 'rejected', label: 'Rejected', icon: <XCircle className="h-3.5 w-3.5" /> },
  { value: 'refunded', label: 'Refunded', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { value: 'closed', label: 'Closed', icon: <XCircle className="h-3.5 w-3.5" /> },
];

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const StatusChip = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, color: 'bg-slate-100 border-slate-200 text-slate-600', icon: null };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.color}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
};

const EvidenceForm = ({ requestId, onSuccess }) => {
  const [urls, setUrls] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const evidenceUrls = urls.split('\n').map((entry) => entry.trim()).filter(Boolean);
    if (evidenceUrls.length === 0) {
      toast.error('Please enter at least one image/document URL');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('medVisionToken');
      await axios.post(
        `${baseURL}/returns/${requestId}/evidence`,
        { evidenceUrls, note },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success('Evidence submitted');
      onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit evidence');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-amber-800">Submit Evidence</p>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-amber-700">Image / document URLs (one per line)</label>
        <textarea
          value={urls}
          onChange={(event) => setUrls(event.target.value)}
          rows={3}
          placeholder="https://..."
          className="w-full resize-none rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-amber-700">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add a note for the store..."
          className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
        />
      </div>
      <button
        disabled={submitting}
        onClick={handleSubmit}
        className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Evidence'}
      </button>
    </div>
  );
};

const ReturnCard = ({ request, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const isEvidenceRequested = request.status === 'evidence_requested';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
              <RotateCcw className="h-3 w-3" />
              Return #{String(request._id).slice(-6).toUpperCase()}
            </span>
            <StatusChip status={request.status} />
            {request.escalatedAt && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                <ShieldCheck className="h-3 w-3" /> Escalated
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-900">Order #{request.orderRefId}</p>
          <p className="text-xs text-slate-500">
            Reason: <span className="font-medium text-slate-700">{REASON_LABELS[request.reason] || request.reason}</span>
          </p>
          <p className="text-xs text-slate-400">Submitted: {formatDate(request.createdAt)}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {request.refundAmount > 0 && (
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
              Rs. {request.refundAmount} refund
            </span>
          )}
          <button
            onClick={() => setExpanded((value) => !value)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-slate-700">{request.description}</p>
          </div>

          {request.items?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Items</p>
              <div className="space-y-1.5">
                {request.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-xs text-slate-500">Qty {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(request.storeNote || request.adminNote || request.rejectionReason) && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                {request.status === 'rejected' ? 'Rejection Reason' : 'Store / Admin Note'}
              </p>
              <p className="text-sm text-slate-700">{request.rejectionReason || request.storeNote || request.adminNote}</p>
            </div>
          )}

          {request.evidenceUrls?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Evidence Submitted</p>
              <div className="space-y-1">
                {request.evidenceUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-xs text-cyan-700 underline hover:text-cyan-900"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {request.timeline?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Timeline</p>
              <ol className="relative border-l border-slate-200 ml-2 space-y-3">
                {request.timeline.map((event, index) => (
                  <li key={index} className="ml-4">
                    <div className="absolute -left-1.5 mt-0.5 h-3 w-3 rounded-full border border-slate-300 bg-white" />
                    <p className="text-xs font-semibold text-slate-800">{event.action}</p>
                    {event.note && <p className="text-xs text-slate-500 mt-0.5">{event.note}</p>}
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(event.timestamp)}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {isEvidenceRequested && <EvidenceForm requestId={request._id} onSuccess={onRefresh} />}
        </div>
      )}
    </div>
  );
};

const ReturnsPanel = ({ embedded = false, onClose }) => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadReturns = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('medVisionToken');
      const response = await axios.get(`${baseURL}/returns/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturns(response.data.returns || []);
    } catch (error) {
      console.error('Failed to load returns:', error);
      toast.error('Failed to load return requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const filteredReturns = statusFilter === 'all'
    ? returns
    : returns.filter((request) => {
      if (statusFilter === 'store_review') {
        return ['store_review', 'evidence_submitted'].includes(request.status);
      }
      return request.status === statusFilter;
    });

  const getFilterCount = (filterValue) => {
    if (filterValue === 'all') return returns.length;
    if (filterValue === 'store_review') {
      return returns.filter((request) => ['store_review', 'evidence_submitted'].includes(request.status)).length;
    }
    return returns.filter((request) => request.status === filterValue).length;
  };

  const shellClassName = embedded
    ? 'overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-xl'
    : 'mx-auto max-w-4xl';

  return (
    <div className={shellClassName}>
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 p-6 text-white shadow-xl">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <RotateCcw className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold">My Returns & Refunds</h1>
            </div>
            <p className="text-sm text-rose-100">Track your return requests, submit evidence, and view refund status.</p>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-rose-200">Total</p>
                <p className="text-lg font-bold">{returns.length}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-rose-200">Open</p>
                <p className="text-lg font-bold">{returns.filter((request) => ['open', 'evidence_requested', 'store_review', 'evidence_submitted'].includes(request.status)).length}</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wide text-rose-200">Refunded</p>
                <p className="text-lg font-bold">{returns.filter((request) => request.status === 'refunded').length}</p>
              </div>
            </div>

            {embedded && onClose && (
              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white transition hover:bg-white/30"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={embedded ? 'space-y-5 p-6' : 'space-y-5'}>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === filter.value
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${statusFilter === filter.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {getFilterCount(filter.value)}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
              <Package className="h-8 w-8 text-slate-300" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">No return requests found</p>
              <p className="mt-1 text-sm text-slate-500">
                {statusFilter === 'all'
                  ? 'You have not raised any return or refund requests yet.'
                  : `No requests with status "${statusFilter}".`}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReturns.map((request) => (
              <ReturnCard key={request._id} request={request} onRefresh={loadReturns} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnsPanel;