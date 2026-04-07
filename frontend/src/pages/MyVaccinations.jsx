import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Syringe, Calendar, CheckCircle2, XCircle, Loader2, ShieldCheck } from 'lucide-react';
import { baseURL } from '../main';

function MyVaccinations() {
    // master list from DB (VaccinationMaster)
    const [master, setMaster] = useState([]);
    // map of vaccinationId -> { status, vaccinationDate }
    const [userMap, setUserMap] = useState({});
    // tracks which rows are currently saving
    const [saving, setSaving] = useState({});
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('medVisionToken');
    const authHeader = { Authorization: `Bearer ${token}` };

    // ── Fetch master list + user records ─────────────────────────────────────
    const loadData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [masterRes, userRes] = await Promise.all([
                axios.get(`${baseURL}/vaccination-master`, { headers: authHeader }),
                axios.get(`${baseURL}/user-vaccinations`, { headers: authHeader }),
            ]);

            setMaster(masterRes.data.vaccines || []);

            // Build a fast lookup map  vaccinationId -> record
            const map = {};
            (userRes.data.records || []).forEach(r => {
                map[r.vaccinationId._id] = {
                    status: r.status,
                    vaccinationDate: r.vaccinationDate
                        ? r.vaccinationDate.substring(0, 10) // "YYYY-MM-DD"
                        : '',
                };
            });
            setUserMap(map);
        } catch {
            toast.error('Failed to load vaccination data.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { loadData(); }, [loadData]);

    // ── Helpers to read current row state ────────────────────────────────────
    const getStatus = (id) => userMap[id]?.status ?? 'not_vaccinated';
    const getDate   = (id) => userMap[id]?.vaccinationDate ?? '';

    // ── Optimistic local update ───────────────────────────────────────────────
    const updateLocal = (id, patch) => {
        setUserMap(prev => ({
            ...prev,
            [id]: { ...prev[id], ...patch },
        }));
    };

    // ── Persist one change to the backend ────────────────────────────────────
    const persist = async (vaccinationId, status, vaccinationDate) => {
        setSaving(prev => ({ ...prev, [vaccinationId]: true }));
        try {
            await axios.put(
                `${baseURL}/user-vaccinations/${vaccinationId}`,
                { status, vaccinationDate: vaccinationDate || null },
                { headers: authHeader }
            );
        } catch {
            toast.error('Could not save. Please try again.');
            // revert optimistic update on failure
            loadData();
        } finally {
            setSaving(prev => ({ ...prev, [vaccinationId]: false }));
        }
    };

    // ── Event handlers ────────────────────────────────────────────────────────
    const handleStatusChange = (id, newStatus) => {
        const date = newStatus === 'vaccinated' ? getDate(id) : '';
        updateLocal(id, { status: newStatus, vaccinationDate: date });
        persist(id, newStatus, date);
    };

    const handleDateChange = (id, newDate) => {
        updateLocal(id, { vaccinationDate: newDate });
        persist(id, 'vaccinated', newDate);
    };

    // ── Summary counters ─────────────────────────────────────────────────────
    const vaccinatedCount = master.filter(v => getStatus(v._id) === 'vaccinated').length;
    const totalCount = master.length;

    // ── Render ────────────────────────────────────────────────────────────────
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
                            <Syringe className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Vaccination Tracker</h1>
                            <p className="text-sm text-gray-500">Manage and track your vaccination status</p>
                        </div>
                    </div>

                    {/* Progress pill */}
                    {!loading && totalCount > 0 && (
                        <div className="flex items-center gap-2 bg-white border border-blue-100 shadow-sm px-4 py-2 rounded-full">
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-semibold text-blue-700">
                                {vaccinatedCount} / {totalCount} vaccinated
                            </span>
                            <div className="ml-2 w-24 h-2 bg-blue-100 rounded-full overflow-hidden">
                                <div
                                    className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                                    style={{ width: `${totalCount ? (vaccinatedCount / totalCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Table card ── */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="text-sm">Loading vaccinations…</p>
                        </div>
                    ) : master.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
                            <Syringe className="w-10 h-10" />
                            <p className="text-sm">No vaccination records found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="p-4 text-left w-1/2">Vaccine</th>
                                        <th className="p-4 text-left w-1/4">Status</th>
                                        <th className="p-4 text-left">Vaccination Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {master.map((vaccine, index) => {
                                        const status = getStatus(vaccine._id);
                                        const date   = getDate(vaccine._id);
                                        const isSaving = !!saving[vaccine._id];
                                        const isVaccinated = status === 'vaccinated';

                                        return (
                                            <tr
                                                key={vaccine._id}
                                                className={`border-b last:border-none transition-colors
                                                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}
                                                    hover:bg-blue-50/30`}
                                            >
                                                {/* Name + category */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {isVaccinated
                                                            ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                                            : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                                        }
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{vaccine.name}</p>
                                                            <p className="text-xs text-gray-400">{vaccine.category} · {vaccine.recommendedFor}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Status dropdown */}
                                                <td className="p-4">
                                                    <div className="relative flex items-center gap-2">
                                                        <select
                                                            disabled={isSaving}
                                                            value={status}
                                                            onChange={e => handleStatusChange(vaccine._id, e.target.value)}
                                                            className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-semibold border
                                                                focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer
                                                                disabled:opacity-60 disabled:cursor-not-allowed transition-colors
                                                                ${isVaccinated
                                                                    ? 'bg-green-100 text-green-700 border-green-300 focus:ring-green-400'
                                                                    : 'bg-red-100 text-red-700 border-red-300 focus:ring-red-400'
                                                                }`}
                                                        >
                                                            <option value="not_vaccinated">Not Vaccinated</option>
                                                            <option value="vaccinated">Vaccinated</option>
                                                        </select>
                                                        {isSaving && (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0" />
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Date picker – only when vaccinated */}
                                                <td className="p-4">
                                                    {isVaccinated ? (
                                                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg w-fit">
                                                            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                                                            <input
                                                                type="date"
                                                                disabled={isSaving}
                                                                value={date}
                                                                max={new Date().toISOString().substring(0, 10)}
                                                                onChange={e => handleDateChange(vaccine._id, e.target.value)}
                                                                className="bg-transparent outline-none text-sm text-gray-700 disabled:opacity-60"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-blue-500 text-xs font-medium">
                                                            Stay protected — get vaccinated!
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer note */}
                <p className="mt-5 text-xs text-gray-400">
                    * Changes are saved automatically. Keep your records up to date for better health tracking.
                </p>
            </div>
        </div>
    );
}

export default MyVaccinations;