const pincodeCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

const getCachedPincode = (code) => {
  const entry = pincodeCache.get(code);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    pincodeCache.delete(code);
    return null;
  }

  return entry.data;
};

const setCachedPincode = (code, data) => {
  pincodeCache.set(code, {
    data,
    timestamp: Date.now(),
  });
};

const normalizePincodePayload = (payload, code) => {
  const record = Array.isArray(payload) ? payload[0] : null;
  const postOffices = Array.isArray(record?.PostOffice) ? record.PostOffice : [];

  if (!record || String(record.Status).toLowerCase() !== 'success' || !postOffices.length) {
    return null;
  }

  const firstOffice = postOffices[0];
  const localities = Array.from(
    new Set(
      postOffices
        .map((office) => String(office?.Name || '').trim())
        .filter(Boolean)
    )
  );

  return {
    pincode: String(code),
    district: String(firstOffice?.District || '').trim(),
    state: String(firstOffice?.State || '').trim(),
    country: String(firstOffice?.Country || 'India').trim(),
    localities,
  };
};

const getPincodeDetails = async (req, res) => {
  const code = String(req.params?.pincode || '').trim();

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ message: 'Enter a valid 6-digit pincode.' });
  }

  const cached = getCachedPincode(code);
  if (cached) {
    return res.status(200).json(cached);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${code}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({ message: 'Unable to validate pincode right now.' });
    }

    const payload = await response.json();
    const normalized = normalizePincodePayload(payload, code);

    if (!normalized) {
      return res.status(404).json({ message: 'Pincode not found.' });
    }

    setCachedPincode(code, normalized);
    return res.status(200).json(normalized);
  } catch (error) {
    clearTimeout(timeout);
    return res.status(502).json({ message: 'Unable to validate pincode right now.' });
  }
};

module.exports = {
  getPincodeDetails,
};
