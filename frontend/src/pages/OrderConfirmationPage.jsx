import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowLeft, Truck, ShieldCheck, ClipboardList, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { baseURL } from '../main';
import axios from 'axios';
import CheckoutFooter from '../components/CheckoutFooter';

export function OrderConfirmationPage() {
  const latestOrderStorageKey = 'medVisionLatestOrderId';
  const location = useLocation();
  const [userdata, setUserData] = useState([]);
  const [latestOrder, setLatestOrder] = useState(null);
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const fetchDataFromApi = async () => {
    try {
      const token = localStorage.getItem('medVisionToken');
      const orderId = location.state?.orderId || localStorage.getItem(latestOrderStorageKey);
      const [userResponse, ordersResponse] = await Promise.all([
        axios.get(`${baseURL}/fetchdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        orderId
          ? axios.get(`${baseURL}/orders/${orderId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          : axios.get(`${baseURL}/orders/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
      ]);
      const fetchedData = userResponse.data.userData;
      setUserData(fetchedData);
      const resolvedOrder = orderId
        ? ordersResponse.data.order
        : (ordersResponse.data.orders || []).find((order) => order.status === 'Booked') || ordersResponse.data.orders?.[0] || null;
      setLatestOrder(resolvedOrder);
      if (resolvedOrder?.orderId) {
        localStorage.setItem(latestOrderStorageKey, resolvedOrder.orderId);
      }
      localStorage.setItem('userData', JSON.stringify(fetchedData));
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);


  // if (!orderDetails) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white px-4 sm:px-6 lg:px-8 pb-12" style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 3rem)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -top-16 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-cyan-300/10 blur-2xl"></div>

          <div className="relative z-10 flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Order Confirmed</h1>
                <p className="text-emerald-100 mt-2">Your order has been placed successfully and is now being prepared.</p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3 border border-white/20 min-w-[220px]">
              <p className="text-xs uppercase tracking-wide text-emerald-100">Order ID</p>
              <p className="text-lg font-semibold">#{latestOrder?.orderId || 'Pending'}</p>
            </div>
          </div>

          <div className="relative z-10 mt-4 inline-flex items-center gap-2 text-xs bg-white/20 border border-white/20 rounded-full px-3 py-1.5 text-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure order received and validated
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Order Number</p>
                <p className="text-base font-semibold text-slate-900 mt-1">#{latestOrder?.orderId || 'Pending'}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Payment Method</p>
                <p className="text-base font-semibold text-slate-900 mt-1 capitalize">{latestOrder?.payment || 'Not specified'}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Estimated Delivery</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{estimatedDelivery}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Confirmation Email</p>
                <p className="text-base font-semibold text-slate-900 mt-1 break-all">{userdata?.email || 'Not available'}</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-start gap-2">
                <Truck className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Shipping updates will be shared soon</p>
                  <p className="text-sm text-emerald-800 mt-1">You will receive status updates as your package moves from processing to doorstep delivery.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What Next?</h3>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                View My Orders
              </Link>

              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <CheckoutFooter />
    </div>
  );
}