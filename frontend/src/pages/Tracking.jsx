import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, ClipboardList, ShieldCheck, Home } from 'lucide-react';
import { baseURL } from '../main';
import axios from 'axios';
import CheckoutFooter from '../components/CheckoutFooter';
import StatusBadge from '../components/StatusBadge';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'destination-marker-icon',
});

const GEOCODE_CACHE_KEY = 'trackingGeocodeCacheV1';
const GEOCODE_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const readGeocodeCache = () => {
  try {
    const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeGeocodeCache = (cache) => {
  try {
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage failures and continue without cache persistence.
  }
};

function FitRouteBounds({ points = [] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, points]);

  return null;
}

function Tracking() {
  const { id } = useParams();
  const [userdata, setUserData] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState('');
  const [storeCoords, setStoreCoords] = useState(null);
  const [shippingCoords, setShippingCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeMeta, setRouteMeta] = useState({ distanceKm: null, durationMin: null });

  const getTrackingSteps = (deliveryType) => {
    if (deliveryType === 'pickup') {
      return [
        { id: 1, status: "Order Placed", icon: "Clock" },
        { id: 2, status: "Packed", icon: "Package" },
        { id: 3, status: "Ready for Pick Up", icon: "MapPin" },
        { id: 4, status: "Picked Up", icon: "CheckCircle" }
      ];
    } else {
      return [
        { id: 1, status: "Order Placed", icon: "Clock" },
        { id: 2, status: "Packed", icon: "Package" },
        { id: 3, status: "Out for Delivery", icon: "Truck" },
        { id: 4, status: "Delivered", icon: "CheckCircle" }
      ];
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      Clock,
      Package,
      Truck,
      MapPin,
      CheckCircle
    };
    return iconMap[iconName] || Package;
  };

  const fetchDataFromApi = async () => {
    try {
      const token = localStorage.getItem('medVisionToken');
      const [userResponse, orderResponse] = await Promise.all([
        axios.get(`${baseURL}/fetchdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${baseURL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      const fetchedData = userResponse.data.userData;
      const fetchedOrder = orderResponse.data.order;
      setUserData(fetchedData);
      setOrder(fetchedOrder);
      localStorage.setItem('userData', JSON.stringify(fetchedData));
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, [id]);

  const geocodeAddress = async (query, countryHint = 'in') => {
    const cacheKey = `${countryHint}:${String(query || '').trim().toLowerCase()}`;
    const cache = readGeocodeCache();
    const cachedEntry = cache[cacheKey];

    if (cachedEntry?.lat && cachedEntry?.lng && Date.now() - cachedEntry.timestamp < GEOCODE_CACHE_TTL_MS) {
      return { lat: cachedEntry.lat, lng: cachedEntry.lng };
    }

    const photonController = new AbortController();
    const photonTimeout = setTimeout(() => photonController.abort(), 4500);

    try {
      const photonResponse = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1`,
        { signal: photonController.signal }
      );
      clearTimeout(photonTimeout);

      if (photonResponse.ok) {
        const photonPayload = await photonResponse.json();
        const feature = photonPayload?.features?.[0];
        const coordinates = feature?.geometry?.coordinates;

        if (Array.isArray(coordinates) && coordinates.length === 2) {
          const result = {
            lat: Number(coordinates[1]),
            lng: Number(coordinates[0]),
          };

          cache[cacheKey] = { ...result, timestamp: Date.now() };
          writeGeocodeCache(cache);
          return result;
        }
      }
    } catch {
      clearTimeout(photonTimeout);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    let response;

    try {
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&countrycodes=${encodeURIComponent(countryHint)}&q=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
    } catch {
      clearTimeout(timeout);
      throw new Error(`Request failed for query: "${query}"`);
    }

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Geocoder error for query: "${query}"`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error(`Location not found for query: "${query}"`);
    }

    const result = {
      lat: Number(payload[0].lat),
      lng: Number(payload[0].lon),
    };

    cache[cacheKey] = { ...result, timestamp: Date.now() };
    writeGeocodeCache(cache);
    return result;
  };

  const normalizeAddressText = (text) => {
    return String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/^\s*[A-Za-z]{1,3}\s*[-/]\s*\d+[A-Za-z0-9/-]*\s*,?/i, '')
      .replace(/^(flat|apt|apartment|unit|room|block|bldg|building)\s*[-:#]?\s*[a-z0-9-]+\s*,?/i, '')
      .trim();
  };

  const isUnitLikeSegment = (segment) => {
    const value = String(segment || '').trim();
    if (!value) return true;
    if (/^(flat|apt|apartment|unit|room|home|house|shop|plot|door)\b/i.test(value)) return true;
    if (/^[a-z]{1,4}\s*[-/]\s*\d+[a-z0-9/-]*$/i.test(value)) return true;
    if (/^[a-z]?\d+[a-z0-9/-]*$/i.test(value)) return true;
    return false;
  };

  const isRoadLikeSegment = (segment) => {
    const value = String(segment || '').trim().toLowerCase();
    if (!value) return false;
    return /\b(road|rd|street|st|marg|highway|hwy|cross road|char rasta|circle)\b/.test(value);
  };

  const uniqueTokens = (values = []) => {
    const seen = new Set();
    const result = [];

    values.forEach((item) => {
      const cleaned = normalizeAddressText(item);
      if (!cleaned) return;

      const key = cleaned.toLowerCase();
      if (seen.has(key)) return;

      seen.add(key);
      result.push(cleaned);
    });

    return result;
  };

  const getLocalitySegments = (address) => {
    return String(address || '')
      .split(',')
      .map((part) => normalizeAddressText(part))
      .filter(Boolean)
      .filter((segment) => !isUnitLikeSegment(segment));
  };

  const buildLocalityCandidates = (segments = []) => {
    const safeSegments = segments.filter(Boolean);
    if (!safeSegments.length) return [];

    const first = safeSegments[0] || '';
    const last = safeSegments[safeSegments.length - 1] || '';
    const withoutRoad = safeSegments.filter((segment) => !isRoadLikeSegment(segment));

    const candidates = [
      [first, last].filter(Boolean).join(', '),
      withoutRoad.join(', '),
      safeSegments.join(', '),
      safeSegments.slice(0, 2).join(', '),
      safeSegments.slice(0, 3).join(', '),
      safeSegments.slice(-2).join(', '),
      first,
      last,
    ];

    return Array.from(new Set(candidates.filter(Boolean)));
  };

  const buildQueriesForTarget = ({
    primaryAddress,
    name,
    city,
    state,
    pincode,
  }) => {
    const localitySegments = getLocalitySegments(primaryAddress);
    const localityCandidates = buildLocalityCandidates(localitySegments);
    const contextParts = uniqueTokens([city, state, pincode]);
    const entityName = normalizeAddressText(name);
    const normalizedPrimaryAddress = normalizeAddressText(primaryAddress);

    const queries = [];

    if (normalizedPrimaryAddress) {
      queries.push([normalizedPrimaryAddress, ...contextParts, 'India'].filter(Boolean).join(', '));
    }

    localityCandidates.forEach((locality) => {
      const mergedLocality = uniqueTokens(locality.split(',').map((part) => part.trim()));
      queries.push([...mergedLocality, ...contextParts, 'India'].filter(Boolean).join(', '));
      if (entityName) {
        queries.push([entityName, ...mergedLocality, ...contextParts, 'India'].filter(Boolean).join(', '));
      }
    });

    if (!queries.length) {
      queries.push([normalizeAddressText(primaryAddress), ...contextParts, 'India'].filter(Boolean).join(', '));
    }

    return Array.from(new Set(queries.filter(Boolean)));
  };

  const geocodeFromQueries = async (label, queries = []) => {
    const attempted = [];

    for (const query of queries) {
      try {
        return await geocodeAddress(query);
      } catch {
        attempted.push(query);
      }
    }

    const attemptedList = attempted.slice(0, 3).join(' | ');
    throw new Error(`${label} location not found. Tried: ${attemptedList}`);
  };

  useEffect(() => {
    const loadRoute = async () => {
      if (!order) return;

      const storeAddress = String(order.storeAddress || '').trim();
      const shippingAddress = String(order.address || '').trim();

      if (!storeAddress || !shippingAddress) {
        setMapError('Store or shipping address is missing for route display.');
        return;
      }

      try {
        setMapLoading(true);
        setMapError('');

        const storeQueries = buildQueriesForTarget({
          primaryAddress: storeAddress,
          name: order.storeName,
          city: order.storeCity,
          state: order.storeState,
          pincode: order.storePincode,
        });

        const shippingQueries = buildQueriesForTarget({
          primaryAddress: shippingAddress,
          name: userdata?.name,
          city: userdata?.city,
          state: userdata?.state,
          pincode: userdata?.pincode,
        });

        const [storePoint, destinationPoint] = await Promise.all([
          geocodeFromQueries('Store', storeQueries),
          geocodeFromQueries('Shipping', shippingQueries),
        ]);

        setStoreCoords(storePoint);
        setShippingCoords(destinationPoint);

        const routeResponse = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${storePoint.lng},${storePoint.lat};${destinationPoint.lng},${destinationPoint.lat}?overview=full&geometries=geojson`
        );

        if (!routeResponse.ok) {
          throw new Error('Unable to fetch route');
        }

        const routePayload = await routeResponse.json();
        const route = routePayload?.routes?.[0];

        if (!route?.geometry?.coordinates?.length) {
          setRouteCoords([
            [storePoint.lat, storePoint.lng],
            [destinationPoint.lat, destinationPoint.lng],
          ]);
          setRouteMeta({ distanceKm: null, durationMin: null });
          setMapError('Driving route unavailable, showing direct line.');
          return;
        }

        const points = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteCoords(points);
        setRouteMeta({
          distanceKm: Number(route.distance || 0) / 1000,
          durationMin: Number(route.duration || 0) / 60,
        });
      } catch (error) {
        setRouteCoords([]);
        setRouteMeta({ distanceKm: null, durationMin: null });
        setMapError(error.message || 'Unable to resolve map locations.');
      } finally {
        setMapLoading(false);
      }
    };

    loadRoute();
  }, [order, userdata]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white px-4 sm:px-6 lg:px-8 pb-8" style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 2rem)' }}>
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white px-4 sm:px-6 lg:px-8 pb-8" style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 2rem)' }}>
        <div className="max-w-5xl mx-auto text-center py-12">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  const steps = getTrackingSteps(order.deliveryType || 'delivery');
  const currentStatusIndex = steps.findIndex(step => step.status === order.trackingStatus);
  const progressPercent = Math.round(((currentStatusIndex + 1) / steps.length) * 100);
  const isOutForDelivery = order.trackingStatus === 'Out for Delivery';

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white px-4 sm:px-6 lg:px-8 pb-8" style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 2rem)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 rounded-3xl text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-cyan-300/10 blur-2xl"></div>

          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Track Your Order</h1>
              <p className="text-blue-100 mt-2">Stay updated with your shipment progress in real time.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-auto">
              <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3 min-w-[150px] border border-white/20">
                <p className="text-[11px] uppercase tracking-wide text-blue-100">Order ID</p>
                <p className="text-lg font-semibold flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4" />
                  {order?.orderId || id}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3 min-w-[150px] border border-white/20">
                <p className="text-[11px] uppercase tracking-wide text-blue-100">Progress</p>
                <p className="text-lg font-semibold">{progressPercent}%</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-4 inline-flex items-center gap-2 text-xs bg-emerald-400/20 border border-emerald-200/30 rounded-full px-3 py-1.5 text-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Shipment updates are synced securely
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Status Timeline */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Current Status</p>
                <div className="mt-1">
                  <StatusBadge value={order.trackingStatus || 'Order Placed'} size="md" />
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Delivery Type</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{order.deliveryType === 'pickup' ? 'Store Pick Up' : 'Home Delivery'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Pharmacy Store</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{order?.storeName || 'N/A'}</p>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="flow-root">
              <ul className="-mb-8">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const IconComponent = getIconComponent(step.icon);
                  return (
                    <li key={step.id}>
                      <div className="relative pb-8">
                        {index !== steps.length - 1 && (
                          <span
                            className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`}
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            {isCurrent && isOutForDelivery ? (
                              <span className="h-9 w-9 rounded-full flex items-center justify-center ring-8 ring-white bg-emerald-500 text-2xl animate-bounce">
                                🏍️
                              </span>
                            ) : (
                              <span className={`h-9 w-9 rounded-full flex items-center justify-center ring-8 ring-white ${isCompleted ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                <IconComponent className="h-5 w-5 text-white" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5">
                            <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{step.status}</p>
                            {isCompleted && isCurrent && (
                              <p className="mt-1 text-xs text-emerald-600 font-medium">
                                {isOutForDelivery ? '🚚 On the way to you' : 'Current Status'}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-gray-900">Shipping Updates</h3>
              <p className="mt-2 text-sm text-gray-600">
                You will receive email updates about your package status. If you need help, please contact our support team.
              </p>
            </div>

            <div className="mt-5">
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Back to Orders
              </Link>
            </div>
          </div>

          {/* Right side - Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Tracking Map</h3>
              <div className="w-full h-80 rounded-xl border-2 border-blue-200 overflow-hidden">
                {mapLoading ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <p className="text-sm font-semibold text-gray-700">Loading route map...</p>
                  </div>
                ) : mapError && (!storeCoords || !shippingCoords) ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex flex-col items-center justify-center px-4 text-center">
                    <MapPin className="w-10 h-10 text-blue-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">Live route unavailable</p>
                    <p className="text-xs text-gray-500 mt-1">{mapError}</p>
                  </div>
                ) : storeCoords && shippingCoords ? (
                  <MapContainer
                    center={[storeCoords.lat, storeCoords.lng]}
                    zoom={12}
                    scrollWheelZoom
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {routeCoords.length > 0 ? (
                      <>
                        <Polyline positions={routeCoords} pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.75 }} />
                        <FitRouteBounds points={routeCoords} />
                      </>
                    ) : (
                      <FitRouteBounds points={[[storeCoords.lat, storeCoords.lng], [shippingCoords.lat, shippingCoords.lng]]} />
                    )}

                    <Marker position={[storeCoords.lat, storeCoords.lng]} icon={defaultMarkerIcon}>
                      <Popup>
                        <div className="text-xs">
                          <p className="font-semibold">Store</p>
                          <p>{order?.storeName || 'Pharmacy Store'}</p>
                        </div>
                      </Popup>
                    </Marker>

                    <Marker position={[shippingCoords.lat, shippingCoords.lng]} icon={destinationMarkerIcon}>
                      <Popup>
                        <div className="text-xs">
                          <p className="font-semibold">Shipping Address</p>
                          <p>{order?.address || 'N/A'}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex flex-col items-center justify-center">
                    <MapPin className="w-10 h-10 text-blue-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">Waiting for location data</p>
                  </div>
                )}
              </div>

              {mapError && storeCoords && shippingCoords && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
                  {mapError}
                </div>
              )}

              {(routeMeta.distanceKm || routeMeta.durationMin) && (
                <div className="mt-3 rounded-lg bg-blue-50 p-3 border border-blue-200 text-xs text-blue-900">
                  {routeMeta.distanceKm ? <p>Distance: {routeMeta.distanceKm.toFixed(1)} km</p> : null}
                  {routeMeta.durationMin ? <p>ETA (approx): {Math.ceil(routeMeta.durationMin)} mins</p> : null}
                </div>
              )}

              {/* Delivery Info */}
              <div className="mt-6 space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Pharmacy Store</p>
                  <p className="text-sm text-gray-800 mt-2 font-semibold">
                    {order?.storeName || 'Your Pharmacy Store'}
                  </p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Delivery Address</p>
                  <p className="text-sm text-gray-800 mt-2">
                    {order?.address || 'NA'}
                  </p>
                </div>

                {isOutForDelivery && (
                  <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200 animate-pulse">
                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      On The Way
                    </p>
                    <p className="text-sm text-gray-800 mt-2">
                      Your order from <span className="font-semibold">{userdata?.storeName}</span> is on the way to your address
                    </p>
                  </div>
                )}

                {order.trackingStatus === 'Delivered' && (
                  <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
                    <StatusBadge value="Delivered" tone="success" />
                    <p className="text-sm text-gray-800 mt-2">
                      Your order from <span className="font-semibold">{userdata?.storeName}</span> has been successfully delivered
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutFooter />

      <style>{`
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-bounce {
          animation: bounce-custom 1.5s infinite;
        }

        .destination-marker-icon {
          filter: hue-rotate(120deg) saturate(1.2);
        }
      `}</style>
    </div>
  );
}

export default Tracking;
