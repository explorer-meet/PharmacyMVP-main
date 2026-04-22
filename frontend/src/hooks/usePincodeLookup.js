import { useRef, useState } from 'react';
import { fetchPincodeDetails } from '../services/pincodeApi';

export function usePincodeLookup() {
  const cacheRef = useRef(new Map());
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [pincodeOptions, setPincodeOptions] = useState([]);

  const lookupPincode = async (pincode) => {
    const sanitized = String(pincode || '').trim();

    if (!/^\d{6}$/.test(sanitized)) {
      setLookupError('');
      setPincodeOptions([]);
      return null;
    }

    const cached = cacheRef.current.get(sanitized);
    if (cached) {
      setLookupError('');
      setPincodeOptions(cached.localities || []);
      return cached;
    }

    setLookupLoading(true);
    setLookupError('');

    try {
      const details = await fetchPincodeDetails(sanitized);
      cacheRef.current.set(sanitized, details);
      setPincodeOptions(details.localities || []);
      return details;
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to validate pincode.';
      setLookupError(message);
      setPincodeOptions([]);
      return null;
    } finally {
      setLookupLoading(false);
    }
  };

  const resetPincodeLookup = () => {
    setLookupError('');
    setPincodeOptions([]);
  };

  return {
    lookupPincode,
    lookupLoading,
    lookupError,
    pincodeOptions,
    resetPincodeLookup,
  };
}
