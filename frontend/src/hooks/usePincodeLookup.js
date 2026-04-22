import { useRef, useState } from 'react';
import { fetchPincodeDetails } from '../services/pincodeApi';

export function usePincodeLookup() {
  const cacheRef = useRef(new Map());
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [pincodeOptions, setPincodeOptions] = useState([]);
  const [lookupDetails, setLookupDetails] = useState(null);

  const lookupPincode = async (pincode) => {
    const sanitized = String(pincode || '').trim();

    if (!/^\d{6}$/.test(sanitized)) {
      setLookupError('');
      setPincodeOptions([]);
      setLookupDetails(null);
      return null;
    }

    const cached = cacheRef.current.get(sanitized);
    if (cached) {
      setLookupError('');
      setPincodeOptions(cached.localities || []);
      setLookupDetails(cached);
      return cached;
    }

    setLookupLoading(true);
    setLookupError('');
    setLookupDetails(null);

    try {
      const details = await fetchPincodeDetails(sanitized);
      cacheRef.current.set(sanitized, details);
      setPincodeOptions(details.localities || []);
      setLookupDetails(details);
      return details;
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to validate pincode.';
      setLookupError(message);
      setPincodeOptions([]);
      setLookupDetails(null);
      return null;
    } finally {
      setLookupLoading(false);
    }
  };

  const resetPincodeLookup = () => {
    setLookupError('');
    setPincodeOptions([]);
    setLookupDetails(null);
  };

  return {
    lookupPincode,
    lookupLoading,
    lookupError,
    lookupDetails,
    pincodeOptions,
    resetPincodeLookup,
  };
}
