import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, AlertTriangle, Package, FileText, CheckCircle } from 'lucide-react';
import { baseURL } from '../main';

const REASON_OPTIONS = [
  { value: 'wrong_item', label: 'Wrong item received', icon: '📦' },
  { value: 'damaged_pack', label: 'Damaged or broken packaging', icon: '⚠️' },
  { value: 'delayed_delivery', label: 'Significantly delayed delivery', icon: '🕐' },
  { value: 'other', label: 'Other reason', icon: '💬' },
];

const ReturnRequestModal = ({ order, onClose, onSuccess }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = (item) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.itemId === (item.id || item._id || item.name));
      if (exists) return prev.filter((i) => i.itemId !== (item.id || item._id || item.name));
      return [
        ...prev,
        {
          itemId: item.id || item._id || item.name,
          name: item.name,
          quantity: item.quantity || 1,
        },
      ];
    });
  };

  const isItemSelected = (item) =>
    selectedItems.some((i) => i.itemId === (item.id || item._id || item.name));

  const canSubmit =
    selectedItems.length > 0 &&
    reason &&
    description.trim().length >= 20;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('medVisionToken');
      await axios.post(
        `${baseURL}/returns`,
        {
          orderId: order._id,
          items: selectedItems,
          reason,
          description: description.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSubmitted(true);
      toast.success('Return request submitted successfully');
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Raise Return / Refund</h2>
              <p className="text-xs text-rose-100">Order #{order.orderId || 'N/A'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Request Submitted</h3>
            <p className="text-sm leading-6 text-slate-600">
              Your return request has been sent to the store. You will receive a response within 4 business hours.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-rose-600 hover:to-orange-600 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="max-h-[72vh] overflow-y-auto px-6 py-5 space-y-5">
            {/* Step 1: Select Items */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-rose-500" />
                Select items to return
              </label>
              <div className="space-y-2">
                {(order.items || []).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleItem(item)}
                    className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      isItemSelected(item)
                        ? 'border-rose-400 bg-rose-50 text-rose-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-slate-500">Qty {item.quantity || 1}</span>
                  </button>
                ))}
              </div>
              {selectedItems.length === 0 && (
                <p className="mt-1.5 text-xs text-rose-500">Select at least one item</p>
              )}
            </div>

            {/* Step 2: Reason */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Return reason
              </label>
              <div className="grid grid-cols-2 gap-2">
                {REASON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setReason(opt.value)}
                    className={`rounded-2xl border px-3 py-3 text-left text-xs font-medium transition ${
                      reason === opt.value
                        ? 'border-rose-400 bg-rose-50 text-rose-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-base mb-1">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
              {!reason && (
                <p className="mt-1.5 text-xs text-rose-500">Please select a reason</p>
              )}
            </div>

            {/* Step 3: Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-rose-500" />
                Describe the issue
                <span className="text-xs font-normal text-slate-400">(min 20 characters)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe what happened with your order…"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition"
              />
              <p className={`mt-1 text-xs ${description.trim().length < 20 ? 'text-rose-500' : 'text-emerald-600'}`}>
                {description.trim().length} / 20 min characters
              </p>
            </div>

            {/* SLA note */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-semibold text-amber-700">⏱ What happens next?</p>
              <ul className="mt-1.5 space-y-1 text-xs text-amber-700">
                <li>• Store will respond within <strong>4 business hours</strong></li>
                <li>• Final decision within <strong>24 hours</strong></li>
                <li>• Refund processing and closure are handled directly by the Store team</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:from-rose-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnRequestModal;
