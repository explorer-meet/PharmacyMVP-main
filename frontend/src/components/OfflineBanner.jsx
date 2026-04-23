import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import useOnlineStatus from '../hooks/useOnlineStatus';
const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      setWasOffline(true);
      setBackOnline(false);
    } else if (wasOffline) {
      setBackOnline(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setBackOnline(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 ${
        backOnline
          ? 'bg-emerald-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {backOnline ? (
        <>
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Back online! Reconnected successfully.</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>You are offline. Some features may be unavailable.</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline underline-offset-2 hover:no-underline"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
