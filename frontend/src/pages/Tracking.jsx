import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, ClipboardList, ShieldCheck, Home } from 'lucide-react';
import { baseURL } from '../main';
import axios from 'axios';
import CheckoutFooter from '../components/CheckoutFooter';

function Tracking() {
  const { id } = useParams();
  const [userdata, setUserData] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
                <p className="text-base font-semibold text-slate-900 mt-1">{order.trackingStatus || 'Order Placed'}</p>
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
              
              {/* Map Placeholder */}
              <div className="w-full h-80 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-200 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="400" fill="url(#grid)" />
                  </svg>
                </div>
                
                <div className="relative z-10 text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm font-semibold text-gray-700">Live Tracking</p>
                  <p className="text-xs text-gray-500 mt-1">Map integration coming soon</p>
                </div>
              </div>

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
                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">✓ Delivered</p>
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
      `}</style>
    </div>
  );
}

export default Tracking;
