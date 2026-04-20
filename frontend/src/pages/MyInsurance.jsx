import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ShieldCheck, Plus, Pencil, Trash2, Download, Bell,
  Loader2, X, CheckCircle2, AlertTriangle, Clock, XCircle
} from 'lucide-react';
import { baseURL } from '../main';

const EMPTY_FORM = {
  provider: '',
  planName: '',
  policyNumber: '',
  groupNumber: '',
  holderName: '',
  relationship: 'self',
  coveragePercent: 80,
  maxCoverageAmount: '',
  validFrom: '',
  validTo: '',
  isPrimary: false,
  isActive: true,
};

const RELATIONSHIP_OPTIONS = ['self', 'spouse', 'child', 'parent', 'other'];

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function statusBadge(policy) {
  const days = daysUntil(policy.validTo);
  if (!policy.isActive || days < 0)
    return { label: 'Expired', cls: 'bg-red-100 text-red-700 border-red-300', Icon: XCircle };
  if (days <= 30)
    return { label: `Expires in ${days}d`, cls: 'bg-red-100 text-red-700 border-red-300', Icon: AlertTriangle };
  if (days <= 90)
    return { label: `Expires in ${days}d`, cls: 'bg-amber-100 text-amber-700 border-amber-300', Icon: Clock };
  return { label: 'Active', cls: 'bg-green-100 text-green-700 border-green-300', Icon: CheckCircle2 };
}

export default function MyInsurance() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [reminderLoading, setReminderLoading] = useState(false);

  const token = localStorage.getItem('medVisionToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  const loadPolicies = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/insurance`, { headers: authHeader });
      setPolicies(res.data.policies || []);
    } catch {
      toast.error('Failed to load insurance policies.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadPolicies(); }, [loadPolicies]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (policy) => {
    setEditingId(policy._id);
    setForm({
      provider: policy.provider,
      planName: policy.planName || '',
      policyNumber: policy.policyNumber,
      groupNumber: policy.groupNumber || '',
      holderName: policy.holderName,
      relationship: policy.relationship,
      coveragePercent: policy.coveragePercent,
      maxCoverageAmount: policy.maxCoverageAmount || '',
      validFrom: policy.validFrom ? policy.validFrom.substring(0, 10) : '',
      validTo: policy.validTo ? policy.validTo.substring(0, 10) : '',
      isPrimary: policy.isPrimary,
      isActive: policy.isActive,
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        coveragePercent: Number(form.coveragePercent),
        maxCoverageAmount: form.maxCoverageAmount !== '' ? Number(form.maxCoverageAmount) : 0,
      };

      if (editingId) {
        const res = await axios.put(`${baseURL}/insurance/${editingId}`, payload, { headers: authHeader });
        setPolicies(prev => prev.map(p => p._id === editingId ? res.data.policy : p));
        toast.success('Policy updated.');
      } else {
        const res = await axios.post(`${baseURL}/insurance`, payload, { headers: authHeader });
        setPolicies(prev => [res.data.policy, ...prev]);
        toast.success('Insurance policy added.');
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save policy.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this insurance policy?')) return;
    try {
      await axios.delete(`${baseURL}/insurance/${id}`, { headers: authHeader });
      setPolicies(prev => prev.filter(p => p._id !== id));
      toast.success('Policy deleted.');
    } catch {
      toast.error('Failed to delete policy.');
    }
  };

  // ── PDF Download ───────────────────────────────────────────────────────────
  const handleDownload = async (policy) => {
    setDownloadingId(policy._id);
    try {
      const res = await axios.get(`${baseURL}/insurance/${policy._id}/download`, {
        headers: authHeader,
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `insurance_${policy.policyNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Policy PDF downloaded.');
    } catch {
      toast.error('Failed to download PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  // ── Reminders ──────────────────────────────────────────────────────────────
  const handleCheckReminders = async () => {
    setReminderLoading(true);
    try {
      const res = await axios.post(`${baseURL}/insurance/check-reminders`, {}, { headers: authHeader });
      const { message, reminders } = res.data;
      if (reminders?.length) {
        toast.success(`Reminder sent for ${reminders.length} policy(s).`);
      } else {
        toast(message || 'No policies expiring within 90 days.', { icon: '✅' });
      }
    } catch {
      toast.error('Failed to check reminders.');
    } finally {
      setReminderLoading(false);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const activeCount = policies.filter(p => p.isActive && daysUntil(p.validTo) >= 0).length;
  const expiringCount = policies.filter(p => p.isActive && daysUntil(p.validTo) >= 0 && daysUntil(p.validTo) <= 90).length;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6"
      style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 1.5rem)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Insurance Manager</h1>
              <p className="text-sm text-gray-500">Manage your health insurance policies and get renewal reminders</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCheckReminders}
              disabled={reminderLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors text-sm font-medium disabled:opacity-60"
            >
              {reminderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
              Check Reminders
            </button>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-semibold shadow"
            >
              <Plus className="w-4 h-4" />
              Add Policy
            </button>
          </div>
        </div>

        {/* ── Stats strip ── */}
        {!loading && policies.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Policies', value: policies.length, cls: 'text-blue-600' },
              { label: 'Active', value: activeCount, cls: 'text-green-600' },
              { label: 'Expiring Soon', value: expiringCount, cls: expiringCount > 0 ? 'text-amber-600' : 'text-gray-400' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Policy Cards ── */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <p className="text-sm">Loading insurance policies…</p>
            </div>
          ) : policies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <ShieldCheck className="w-12 h-12 text-gray-200" />
              <p className="font-medium">No insurance policies added yet</p>
              <button onClick={openAdd} className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Add Your First Policy
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {policies.map((policy) => {
                const { label, cls, Icon } = statusBadge(policy);
                const days = daysUntil(policy.validTo);
                return (
                  <div key={policy._id} className="p-5 hover:bg-blue-50/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                      {/* Left: info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 text-base">{policy.provider}</h3>
                          {policy.isPrimary && (
                            <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">PRIMARY</span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full ${cls}`}>
                            <Icon className="w-3 h-3" />
                            {label}
                          </span>
                        </div>

                        {policy.planName && (
                          <p className="text-sm text-gray-500 mb-2">{policy.planName}</p>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm mt-2">
                          <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Policy #</span>
                            <p className="font-medium text-gray-800">{policy.policyNumber}</p>
                          </div>
                          {policy.groupNumber && (
                            <div>
                              <span className="text-gray-400 text-xs uppercase tracking-wide">Group #</span>
                              <p className="font-medium text-gray-800">{policy.groupNumber}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Holder</span>
                            <p className="font-medium text-gray-800">{policy.holderName} ({policy.relationship})</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Coverage</span>
                            <p className="font-medium text-gray-800">{policy.coveragePercent}%
                              {policy.maxCoverageAmount > 0 && <span className="text-gray-400"> up to ${policy.maxCoverageAmount.toLocaleString()}</span>}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Valid From</span>
                            <p className="font-medium text-gray-800">{new Date(policy.validFrom).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Valid To</span>
                            <p className={`font-medium ${days <= 30 ? 'text-red-600' : days <= 90 ? 'text-amber-600' : 'text-gray-800'}`}>
                              {new Date(policy.validTo).toLocaleDateString()}
                              {days > 0 && days <= 90 && <span className="ml-1 font-normal">({days}d left)</span>}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button
                          onClick={() => handleDownload(policy)}
                          disabled={downloadingId === policy._id}
                          title="Download PDF"
                          className="p-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-60"
                        >
                          {downloadingId === policy._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Download className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEdit(policy)}
                          title="Edit"
                          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(policy._id)}
                          title="Delete"
                          className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Insurance Policy' : 'Add Insurance Policy'}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Provider & Plan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Provider *</label>
                  <input name="provider" required value={form.provider} onChange={handleChange}
                    placeholder="e.g. Blue Cross" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Plan Name</label>
                  <input name="planName" value={form.planName} onChange={handleChange}
                    placeholder="e.g. Gold Plan" className="input-field" />
                </div>
              </div>

              {/* Policy # & Group # */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Policy Number *</label>
                  <input name="policyNumber" required value={form.policyNumber} onChange={handleChange}
                    placeholder="POL-123456" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Group Number</label>
                  <input name="groupNumber" value={form.groupNumber} onChange={handleChange}
                    placeholder="GRP-789" className="input-field" />
                </div>
              </div>

              {/* Holder & Relationship */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Policy Holder Name *</label>
                  <input name="holderName" required value={form.holderName} onChange={handleChange}
                    placeholder="Full name" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Relationship</label>
                  <select name="relationship" value={form.relationship} onChange={handleChange} className="input-field">
                    {RELATIONSHIP_OPTIONS.map(r => (
                      <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Coverage */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Coverage % *</label>
                  <input name="coveragePercent" type="number" min="0" max="100" required
                    value={form.coveragePercent} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Coverage ($)</label>
                  <input name="maxCoverageAmount" type="number" min="0"
                    value={form.maxCoverageAmount} onChange={handleChange}
                    placeholder="0 = Unlimited" className="input-field" />
                </div>
              </div>

              {/* Validity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Valid From *</label>
                  <input name="validFrom" type="date" required value={form.validFrom} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Valid To *</label>
                  <input name="validTo" type="date" required value={form.validTo} onChange={handleChange} className="input-field" />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 pt-1">
                {[
                  { name: 'isPrimary', label: 'Set as Primary Policy' },
                  { name: 'isActive', label: 'Active' },
                ].map(t => (
                  <label key={t.name} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                    <input type="checkbox" name={t.name} checked={form[t.name]} onChange={handleChange}
                      className="w-4 h-4 accent-blue-600 rounded" />
                    {t.label}
                  </label>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Update Policy' : 'Add Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared input style */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
          background: white;
        }
        .input-field:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
      `}</style>
    </div>
  );
}
