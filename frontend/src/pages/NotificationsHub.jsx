import { useState } from 'react';
import { Bell, Mail, MessageSquare, ShoppingBag, Pill, Tag, Heart, Save, CheckCircle, ChevronLeft, Smartphone } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PREF_KEY = 'medVisionNotifPrefs';

const defaultPrefs = {
  push: {
    orderUpdates: true,
    prescriptionReminders: true,
    offerAlerts: false,
    healthReminders: true,
  },
  email: {
    orderUpdates: true,
    prescriptionReminders: false,
    offerAlerts: false,
    healthReminders: false,
  },
  sms: {
    orderUpdates: false,
    prescriptionReminders: false,
    offerAlerts: false,
    healthReminders: false,
  },
};

const categoryMeta = [
  { key: 'orderUpdates', icon: ShoppingBag, color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-900/30' },
  { key: 'prescriptionReminders', icon: Pill, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/30' },
  { key: 'offerAlerts', icon: Tag, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  { key: 'healthReminders', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/30' },
];

const channelMeta = [
  { key: 'push', icon: Smartphone, label: 'Push Notifications', description: 'Real-time alerts on your device', color: 'from-cyan-500 to-sky-600' },
  { key: 'email', icon: Mail, label: 'Email Notifications', description: 'Updates sent to your email address', color: 'from-violet-500 to-purple-600' },
  { key: 'sms', icon: MessageSquare, label: 'SMS Notifications', description: 'Text messages to your phone', color: 'from-emerald-500 to-teal-600' },
];

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${
      checked ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-200 dark:bg-slate-600 border-slate-200 dark:border-slate-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 mt-0.5 ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const NotificationsHub = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(() => {
    try {
      const stored = localStorage.getItem(PREF_KEY);
      return stored ? JSON.parse(stored) : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  });
  const [saved, setSaved] = useState(false);
  const [activeChannel, setActiveChannel] = useState('push');

  const setChannelPref = (channel, category, value) => {
    setPrefs((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], [category]: value },
    }));
    setSaved(false);
  };

  const toggleAllChannel = (channel, value) => {
    setPrefs((prev) => ({
      ...prev,
      [channel]: Object.fromEntries(Object.keys(prev[channel]).map((k) => [k, value])),
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setSaved(true);
    toast.success(t.notifications.saved || 'Preferences saved!');
    setTimeout(() => setSaved(false), 3000);
  };

  const activeChannelMeta = channelMeta.find((c) => c.key === activeChannel);
  const activePrefs = prefs[activeChannel] || {};
  const allEnabled = Object.values(activePrefs).every(Boolean);

  // Summary counts
  const totalEnabled = Object.values(prefs).reduce((sum, ch) => {
    return sum + Object.values(ch).filter(Boolean).length;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div
        className="max-w-3xl mx-auto px-4 py-8"
        style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 1.5rem)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-emerald-600 rounded-2xl shadow-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {t.notifications.title}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {totalEnabled} notification type{totalEnabled !== 1 ? 's' : ''} enabled across all channels
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {channelMeta.map((ch) => {
            const count = Object.values(prefs[ch.key] || {}).filter(Boolean).length;
            const Icon = ch.icon;
            return (
              <button
                key={ch.key}
                onClick={() => setActiveChannel(ch.key)}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  activeChannel === ch.key
                    ? `border-transparent bg-gradient-to-br ${ch.color} text-white shadow-lg scale-[1.02]`
                    : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${activeChannel === ch.key ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <p className={`text-sm font-bold truncate ${activeChannel === ch.key ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                  {ch.label.split(' ')[0]}
                </p>
                <p className={`text-xs mt-0.5 ${activeChannel === ch.key ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {count}/4 active
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Channel Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          {/* Panel Header */}
          <div className={`px-5 py-4 bg-gradient-to-r ${activeChannelMeta?.color} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              {activeChannelMeta && <activeChannelMeta.icon className="w-5 h-5 text-white" />}
              <div>
                <p className="text-sm font-bold text-white">{activeChannelMeta?.label}</p>
                <p className="text-[11px] text-white/80">{activeChannelMeta?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-medium">{allEnabled ? 'All On' : 'Manage'}</span>
              <Toggle
                checked={allEnabled}
                onChange={(v) => toggleAllChannel(activeChannel, v)}
              />
            </div>
          </div>

          {/* Category Toggles */}
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {categoryMeta.map(({ key, icon: Icon, color, bg }) => {
              const label = t.notifications[key] || key;
              return (
                <div
                  key={key}
                  className="flex items-center px-5 py-4 gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {activeChannel === 'push' && 'In-app & browser notification'}
                      {activeChannel === 'email' && 'Sent to your registered email'}
                      {activeChannel === 'sms' && 'Text to your registered phone'}
                    </p>
                  </div>
                  <Toggle
                    checked={activePrefs[key] ?? false}
                    onChange={(v) => setChannelPref(activeChannel, key, v)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* All Channels Overview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">All Channels Overview</p>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {categoryMeta.map(({ key, icon: Icon, color, bg }) => {
              const label = t.notifications[key] || key;
              return (
                <div key={key} className="flex items-center px-5 py-3 gap-4">
                  <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 font-medium">{label}</p>
                  <div className="flex items-center gap-3">
                    {channelMeta.map((ch) => (
                      <div key={ch.key} className="flex flex-col items-center gap-0.5">
                        <ch.icon className="w-3 h-3 text-slate-400" />
                        <div className={`w-2 h-2 rounded-full ${prefs[ch.key]?.[key] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={savePreferences}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              {t.notifications.saved}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t.notifications.save}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationsHub;
