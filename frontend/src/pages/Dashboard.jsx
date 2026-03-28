import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Activity, Calendar, Pill, FileText, Clock, User, Mail, Phone, Menu, X, Home, CircleUser as UserCircle, ShoppingBag, Syringe, Bell, MessageSquare, Mail as MailIcon, Pencil, ClipboardList, IndianRupee, Package, Truck, ChevronDown, ChevronUp, CreditCard } from 'lucide-react';
import { baseURL } from '../main';
import Loader from '../components/Loader';
import PrescriptionDialog from '../components/PrescriptionDialog';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
    const [showPrescriptions, setShowPrescriptions] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showRaiseQuery, setShowRaiseQuery] = useState(false);
    const [showMyOrders, setShowMyOrders] = useState(false);
    const [showMyVaccinations, setShowMyVaccinations] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [expandedDashboardOrder, setExpandedDashboardOrder] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '', mobile: '' });
    const [profileErrors, setProfileErrors] = useState({});
    const [profileImage, setProfileImage] = useState('');
    const [queryForm, setQueryForm] = useState({ subject: '', message: '' });
    const [queryErrors, setQueryErrors] = useState({});
    const [querySubmitted, setQuerySubmitted] = useState(false);

    const querySubjects = [
        'Order & Delivery Issue',
        'Prescription Upload Support',
        'Medicine Availability Query',
        'Refund / Return Request',
        'Emergency Medicine Help',
        'Feedback & Suggestions',
        'Other',
    ];

    const dummyVaccinations = [
        {
            id: 1,
            name: 'COVID-19 (Pfizer)',
            date: '2024-02-15',
            status: 'Completed',
            dose: 'Dose 3'
        },
        {
            id: 2,
            name: 'Tetanus Toxoid',
            date: '2024-01-10',
            status: 'Completed',
            dose: 'Single Dose'
        },
        {
            id: 3,
            name: 'Influenza (Flu)',
            date: '2024-03-20',
            status: 'Completed',
            dose: 'Single Dose'
        }
    ];

    const handleQueryChange = (e) => {
        setQueryForm({ ...queryForm, [e.target.name]: e.target.value });
        setQueryErrors({ ...queryErrors, [e.target.name]: undefined });
    };

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!queryForm.subject) errs.subject = 'Please select a subject.';
        if (queryForm.message.trim().length < 20) errs.message = 'Minimum 20 characters required.';
        if (Object.keys(errs).length > 0) { setQueryErrors(errs); return; }
        setQuerySubmitted(true);
        setQueryForm({ subject: '', message: '' });
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
        setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setProfileImage(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleProfileEdit = () => {
        setProfileForm({
            name: userData?.name || '',
            email: userData?.email || '',
            mobile: userData?.mobile || '',
        });
        setProfileErrors({});
        setIsEditingProfile(true);
    };

    const handleProfileCancel = () => {
        setProfileForm({
            name: userData?.name || '',
            email: userData?.email || '',
            mobile: userData?.mobile || '',
        });
        setProfileErrors({});
        setIsEditingProfile(false);
    };

    const handleProfileSave = () => {
        const errors = {};
        const trimmedName = profileForm.name.trim();
        const trimmedEmail = profileForm.email.trim();
        const trimmedMobile = profileForm.mobile.trim();

        if (!trimmedName) errors.name = 'Name is required.';
        if (!trimmedEmail) {
            errors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = 'Enter a valid email address.';
        }
        if (trimmedMobile && !/^\d{10,15}$/.test(trimmedMobile)) {
            errors.mobile = 'Enter a valid phone number.';
        }

        if (Object.keys(errors).length > 0) {
            setProfileErrors(errors);
            return;
        }

        setUserData((prev) => ({
            ...prev,
            name: trimmedName,
            email: trimmedEmail,
            mobile: trimmedMobile,
        }));
        setProfileErrors({});
        setIsEditingProfile(false);
    };

    const navigate = useNavigate();
    const location = useLocation();

    const [notifications, setNotifications] = useState({
        sms: true,
        email: true
    });

    const fetchDataFromApi = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('medVisionToken');
            const response = await axios.get(`${baseURL}/fetchdata`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const userDataFromApi = response.data.userData;

            // Add dummy prescriptions for demo
            const dummyPrescriptions = [
                {
                    id: 1,
                    medicineName: "Amoxicillin 500mg",
                    dosage: "500mg",
                    frequency: "3 times daily",
                    duration: "7 days",
                    prescriber: "Pharmacy Team",
                    date: "2024-03-15",
                    status: "active"
                },
                {
                    id: 2,
                    medicineName: "Ibuprofen 200mg",
                    dosage: "200mg",
                    frequency: "As needed",
                    duration: "30 days",
                    prescriber: "Pharmacy Team",
                    date: "2024-03-10",
                    status: "active"
                },
                {
                    id: 3,
                    medicineName: "Lisinopril 10mg",
                    dosage: "10mg",
                    frequency: "Once daily",
                    duration: "Ongoing",
                    prescriber: "Pharmacy Team",
                    date: "2024-02-28",
                    status: "expired"
                }
            ];

            setUserData({
                ...userDataFromApi,
                prescriptions: dummyPrescriptions
            });
        } catch (error) {
            console.error("Error fetching data:", error.message);
            // Set dummy data even if API fails for demo
            setUserData({
                name: "John Doe",
                email: "john.doe@example.com",
                mobile: "1234567890",
                prescriptions: [
                    {
                        id: 1,
                        medicineName: "Amoxicillin 500mg",
                        dosage: "500mg",
                        frequency: "3 times daily",
                        duration: "7 days",
                        prescriber: "Pharmacy Team",
                        date: "2024-03-15",
                        status: "active"
                    },
                    {
                        id: 2,
                        medicineName: "Ibuprofen 200mg",
                        dosage: "200mg",
                        frequency: "As needed",
                        duration: "30 days",
                        prescriber: "Pharmacy Team",
                        date: "2024-03-10",
                        status: "active"
                    },
                    {
                        id: 3,
                        medicineName: "Lisinopril 10mg",
                        dosage: "10mg",
                        frequency: "Once daily",
                        duration: "Ongoing",
                        prescriber: "Pharmacy Team",
                        date: "2024-02-28",
                        status: "expired"
                    }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataFromApi();
    }, []);

    useEffect(() => {
        if (!userData) return;

        setProfileForm({
            name: userData.name || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
        });
    }, [userData]);

    const resetDashboardPanels = () => {
        setShowPrescriptions(false);
        setShowNotifications(false);
        setShowRaiseQuery(false);
        setShowMyOrders(false);
        setShowMyVaccinations(false);
        setShowProfile(false);
        setIsEditingProfile(false);
        setProfileErrors({});
        setExpandedDashboardOrder(null);
    };

    useEffect(() => {
        if (location.state?.openSection === 'prescriptions') {
            resetDashboardPanels();
            setShowPrescriptions(true);
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location, navigate]);

    const hasActivePanel = showPrescriptions || showNotifications || showRaiseQuery || showMyOrders || showMyVaccinations || showProfile;

    const getDashboardOrderAmount = (order) => {
        if (!order) return 0;
        if (order.totalPrice) return Number(order.totalPrice) || 0;
        if (order.total) return Number(String(order.total).replace(/[^\d]/g, '')) || 0;
        if (Array.isArray(order.items)) {
            return order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        }
        return 0;
    };

    const dashboardOrders = (userData?.order || [])
        .filter((order) => order.status === 'Booked')
        .map((order) => ({
            ...order,
            id: order.orderId,
            date: order.date || order.createdAt || 'N/A',
            total: `Rs ${getDashboardOrderAmount(order)}/-`,
            payment: order.payment || 'N/A',
        }));

    const toggleDashboardOrderItems = (orderId) => {
        setExpandedDashboardOrder((prev) => (prev === orderId ? null : orderId));
    };

    const sidebarItems = [
        { icon: Home,         text: "Dashboard",      onClick: () => { resetDashboardPanels(); setSidebarOpen(false); },                                                                     color: "text-blue-500"   },
        { icon: Pill,         text: "My Prescriptions",onClick: () => { const n = !showPrescriptions;  resetDashboardPanels(); setShowPrescriptions(n);  setSidebarOpen(false); },           color: "text-violet-500" },
        { icon: ShoppingBag,  text: "My Orders",       onClick: () => { const n = !showMyOrders;        resetDashboardPanels(); setShowMyOrders(n);        setSidebarOpen(false); },           color: "text-orange-500" },
        { icon: Syringe,      text: "My Vaccinations", onClick: () => { const n = !showMyVaccinations;  resetDashboardPanels(); setShowMyVaccinations(n);  setSidebarOpen(false); },           color: "text-teal-500"   },
        { icon: UserCircle,   text: "Profile",         onClick: () => { const n = !showProfile;         resetDashboardPanels(); setShowProfile(n);         setSidebarOpen(false); },           color: "text-emerald-500"},
        { icon: Bell,         text: "Notifications",   onClick: () => { const n = !showNotifications;   resetDashboardPanels(); setShowNotifications(n);   setSidebarOpen(false); },           color: "text-yellow-500" },
        { icon: MessageSquare,text: "Raise a Query",   onClick: () => { const n = !showRaiseQuery;      resetDashboardPanels(); setShowRaiseQuery(n);      setSidebarOpen(false); },           color: "text-cyan-500"   },
    ];

    const statsCards = [
        {
            icon: Pill,
            label: "Prescriptions",
            value: userData?.prescriptions?.length || 0,
            change: "Upload & manage prescriptions",
            color: "bg-gradient-to-br from-violet-400 to-purple-500",
            onClick: () => { resetDashboardPanels(); setShowPrescriptions(true); }
        },
        {
            icon: ShoppingBag,
            label: "Orders",
            value: dashboardOrders.length,
            change: "Track medicine deliveries",
            color: "bg-gradient-to-br from-amber-400 to-orange-500",
            onClick: () => { resetDashboardPanels(); setShowMyOrders(true); }
        },
        {
            icon: Syringe,
            label: "Vaccinations",
            value: dummyVaccinations.length,
            change: "Review your immunization history",
            color: "bg-gradient-to-br from-emerald-400 to-teal-500",
            onClick: () => { resetDashboardPanels(); setShowMyVaccinations(true); }
        },
    ];

    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-30 bg-blue-50 shadow-md">
                <div className="flex items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                            MedVision
                        </h1>
                        <p className="text-xs text-blue-600">Patient Dashboard</p>
                    </div>
                    <button
                        className="p-2 rounded-lg bg-gradient-to-r from-blue-300 to-blue-400 text-blue-900 hover:shadow-lg transition-shadow"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>


            <div className="flex relative">
                {/* Sidebar */}
                <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-white shadow-xl transform transition-all duration-300 z-40
${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

                    <div className="h-full flex flex-col">

                        {/* Sidebar Header - close button only on mobile */}
                        <div className="flex lg:hidden items-center justify-end px-4 pt-4">
                            <button
                                className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* User Profile Section */}
                        <div className="px-5 pt-4 pb-5 border-b border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="relative flex-shrink-0">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            userData?.name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <label className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition border-2 border-white">
                                        <Pencil size={11} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleProfileImageChange}
                                        />
                                    </label>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate text-base">
                                        {userData?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                                        Patient Account
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                            {sidebarItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-3 space-x-3 text-left rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all group"
                                    onClick={item.onClick}
                                >
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow`}>
                                        <item.icon className={`w-4 h-4 ${item.color}`} />
                                    </div>
                                    <span className="font-semibold text-slate-600 group-hover:text-slate-900 text-sm">
                                        {item.text}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-2xl shadow-xl p-8 text-blue-900">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                        Welcome back, {userData?.name?.split(' ')[0] || 'User'}!
                                    </h1>
                                    <p className="text-blue-700 text-lg">
                                        Here's your health overview for today
                                    </p>

                                </div>

                                <div className="mt-6 lg:mt-0 lg:min-w-[280px]">
                                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-5 shadow space-y-4">
                                        <div>
                                            <p className="text-sm text-blue-600">Today's Date</p>
                                            <p className="text-xl font-bold text-blue-900">
                                                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-white/70 px-4 py-3 border border-blue-100">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">Quick Exit</p>
                                            <button
                                                onClick={() => navigate('/')}
                                                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950 transition"
                                            >
                                                <Home size={16} />
                                                Return to Home Page
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Dashboard Overview */}
                        {!hasActivePanel && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {statsCards.map((stat, index) => (
                                <div
                                    key={index}
                                    onClick={stat.onClick}
                                    className="h-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative border border-white"
                                    data-prescription-card={stat.label === 'Prescriptions' ? 'true' : undefined}
                                >

                                    <div className="flex items-center justify-between mb-5">
                                        <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">Overview</span>
                                    </div>

                                    <h3 className="text-gray-500 text-sm font-medium mb-2">
                                        {stat.label}
                                    </h3>

                                    <p className="text-3xl font-bold text-gray-800 mb-2">
                                        {stat.value}
                                    </p>

                                    {stat.change && (
                                        <p className="text-sm text-gray-500 font-medium leading-5">
                                            {stat.change}
                                        </p>
                                    )}

                                </div>
                            ))}
                        </div>}

                        {!hasActivePanel && (
                            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
                                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-8 text-white shadow-2xl">
                                    <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                                    <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
                                    <div className="relative z-10">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">Dashboard Focus</p>
                                        <h2 className="mt-3 text-2xl lg:text-3xl font-bold leading-tight">
                                            Keep your medicines, orders, and support requests in one place.
                                        </h2>
                                        <p className="mt-4 max-w-2xl text-sm lg:text-base text-blue-100 leading-7">
                                            This dashboard is now built as a clean patient workspace. Open the panels you need from the left side and keep the rest of the screen distraction-free.
                                        </p>

                                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <button
                                                onClick={() => { resetDashboardPanels(); setShowMyOrders(true); }}
                                                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition"
                                            >
                                                <ShoppingBag className="mb-3 text-orange-300" size={20} />
                                                <p className="font-semibold">Track Orders</p>
                                                <p className="mt-1 text-xs text-blue-100">See delivery status and items.</p>
                                            </button>
                                            <button
                                                onClick={() => { resetDashboardPanels(); setShowPrescriptions(true); }}
                                                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition"
                                            >
                                                <Pill className="mb-3 text-violet-200" size={20} />
                                                <p className="font-semibold">Open Prescriptions</p>
                                                <p className="mt-1 text-xs text-blue-100">Review current medicines quickly.</p>
                                            </button>
                                            <button
                                                onClick={() => { resetDashboardPanels(); setShowRaiseQuery(true); }}
                                                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-left hover:bg-white/15 transition"
                                            >
                                                <MessageSquare className="mb-3 text-cyan-200" size={20} />
                                                <p className="font-semibold">Raise a Query</p>
                                                <p className="mt-1 text-xs text-blue-100">Contact pharmacy support directly.</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-100">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Quick Snapshot</p>
                                                <h3 className="mt-2 text-xl font-bold text-gray-800">Today at a glance</h3>
                                            </div>
                                            <Activity className="text-cyan-500" size={22} />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-sky-900">Active Prescriptions</p>
                                                    <p className="text-xs text-sky-700">Medicines currently visible in your account</p>
                                                </div>
                                                <span className="text-2xl font-bold text-sky-900">{userData?.prescriptions?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-amber-900">Orders in history</p>
                                                    <p className="text-xs text-amber-700">Recent pharmacy purchases</p>
                                                </div>
                                                <span className="text-2xl font-bold text-amber-900">{dashboardOrders.length}</span>
                                            </div>
                                            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-emerald-900">Vaccination records</p>
                                                    <p className="text-xs text-emerald-700">Immunization entries available</p>
                                                </div>
                                                <span className="text-2xl font-bold text-emerald-900">{dummyVaccinations.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Prescriptions List */}
                        {showPrescriptions && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">My Prescriptions</h2>
                                    <button
                                        onClick={() => setIsPrescriptionDialogOpen(true)}
                                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                                    >
                                        <Pill size={16} />
                                        <span>Upload New</span>
                                    </button>
                                </div>

                                {userData?.prescriptions && userData.prescriptions.length > 0 ? (
                                    <div className="space-y-4">
                                        {userData.prescriptions.map((prescription) => (
                                            <div
                                                key={prescription.id}
                                                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                                <Pill className="text-purple-600" size={20} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                                    {prescription.medicineName}
                                                                </h3>
                                                                <p className="text-purple-600 font-medium">
                                                                    {prescription.dosage}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Clock className="text-gray-400" size={16} />
                                                                <span className="text-sm text-gray-600">
                                                                    {prescription.frequency}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="text-gray-400" size={16} />
                                                                <span className="text-sm text-gray-600">
                                                                    Duration: {prescription.duration}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <User className="text-gray-400" size={16} />
                                                                <span className="text-sm text-gray-600">
                                                                    {prescription.prescriber || 'Pharmacy Team'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <FileText className="text-gray-400" size={16} />
                                                                <span className="text-sm text-gray-600">
                                                                    {prescription.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="ml-4 flex items-center space-x-2">
                                                        <span className={`w-3 h-3 rounded-full ${
                                                            prescription.status === 'active'
                                                                ? 'bg-green-500'
                                                                : 'bg-red-500'
                                                        }`} />
                                                        <span className={`text-xs font-semibold ${
                                                            prescription.status === 'active'
                                                                ? 'text-green-800'
                                                                : 'text-red-800'
                                                        }`}>
                                                            {prescription.status === 'active' ? 'Active' : 'Expired'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Pill className="text-gray-300 mx-auto mb-4" size={48} />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Prescriptions Yet</h3>
                                        <p className="text-gray-500 mb-6">Upload your first prescription to get started</p>
                                        <button
                                            onClick={() => setIsPrescriptionDialogOpen(true)}
                                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                                        >
                                            Upload Prescription
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {showNotifications && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Notification Settings</h2>
                                    <Bell className="text-yellow-500" size={24} />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <MessageSquare className="text-blue-600" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">SMS Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive delivery reminders and updates via SMS</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications.sms}
                                                onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <MailIcon className="text-green-600" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive prescription updates and health reports via email</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications.email}
                                                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                        <h4 className="font-semibold text-blue-800 mb-2">What you'll receive:</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>• Prescription Refill Notifications</li>
                                        
                                            <li>• Health Reports</li>
                                            <li>• Important updates from your Healthcare Provider</li>
                                        </ul>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                // Here you could save the preferences to backend
                                                alert(`Notification preferences saved!\nSMS: ${notifications.sms ? 'Enabled' : 'Disabled'}\nEmail: ${notifications.email ? 'Enabled' : 'Disabled'}`);
                                            }}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                                        >
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Raise a Query Panel */}
                        {showRaiseQuery && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                                            <MessageSquare className="text-cyan-600" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">Raise a Query</h2>
                                            <p className="text-sm text-gray-500">We typically respond within 24 hours.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setShowRaiseQuery(false); setQuerySubmitted(false); }} className="text-gray-400 hover:text-gray-600 transition">
                                        <X size={20} />
                                    </button>
                                </div>

                                {querySubmitted ? (
                                    <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Activity className="text-emerald-600" size={36} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Query Submitted!</h3>
                                        <p className="text-gray-500 text-sm max-w-sm">Our pharmacy support team will get back to you within 24 hours. Check your registered email for updates.</p>
                                        <button
                                            onClick={() => setQuerySubmitted(false)}
                                            className="mt-2 px-6 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition"
                                        >
                                            Raise Another Query
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleQuerySubmit} noValidate className="space-y-6">
                                        {/* Pre-filled patient info banner */}
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                                                <User className="text-blue-700" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-blue-900 text-sm">{userData?.name || 'Patient'}</p>
                                                <p className="text-blue-600 text-xs">{userData?.email || ''}</p>
                                            </div>
                                            <span className="ml-auto text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-medium">Logged In</span>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Subject <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="subject"
                                                value={queryForm.subject}
                                                onChange={handleQueryChange}
                                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-gray-50 ${
                                                    queryErrors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200'
                                                }`}
                                            >
                                                <option value="">Select a subject…</option>
                                                {querySubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            {queryErrors.subject && <p className="text-red-500 text-xs mt-1">{queryErrors.subject}</p>}
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Your Message <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                name="message"
                                                value={queryForm.message}
                                                onChange={handleQueryChange}
                                                rows={5}
                                                placeholder="Describe your query or concern in detail…"
                                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none ${
                                                    queryErrors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                                                }`}
                                            />
                                            <div className="flex justify-between mt-1">
                                                {queryErrors.message
                                                    ? <p className="text-red-500 text-xs">{queryErrors.message}</p>
                                                    : <span />}
                                                <p className="text-gray-400 text-xs">{queryForm.message.length} chars</p>
                                            </div>
                                        </div>

                                        {/* Quick help */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <p className="text-sm font-semibold text-amber-800 mb-2">💡 Quick Tips</p>
                                            <ul className="text-xs text-amber-700 space-y-1">
                                                <li>• For order issues, include your Order ID in the message.</li>
                                                <li>• For prescription help, mention the medicine name.</li>
                                                <li>• Urgent? Call 1800-000-0000 (Toll Free).</li>
                                            </ul>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[.98] transition flex items-center justify-center gap-2 text-sm shadow-md"
                                        >
                                            <MessageSquare size={16} /> Submit Query
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Profile Panel */}
                        {showProfile && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                            <UserCircle className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                                            <p className="text-sm text-gray-500">View and manage your personal information</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setShowProfile(false); setIsEditingProfile(false); setProfileErrors({}); }} className="text-gray-400 hover:text-gray-600 transition">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Profile Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            {isEditingProfile ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={profileForm.name}
                                                        onChange={handleProfileChange}
                                                        className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${profileErrors.name ? 'border-red-400' : 'border-gray-200'}`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
                                                </div>
                                            ) : (
                                                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                                                    {userData?.name || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            {isEditingProfile ? (
                                                <div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={profileForm.email}
                                                        onChange={handleProfileChange}
                                                        className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${profileErrors.email ? 'border-red-400' : 'border-gray-200'}`}
                                                        placeholder="Enter your email address"
                                                    />
                                                    {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                                                </div>
                                            ) : (
                                                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                                                    {userData?.email || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            {isEditingProfile ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        name="mobile"
                                                        value={profileForm.mobile}
                                                        onChange={handleProfileChange}
                                                        className={`w-full px-4 py-3 rounded-xl border bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 ${profileErrors.mobile ? 'border-red-400' : 'border-gray-200'}`}
                                                        placeholder="Enter your phone number"
                                                    />
                                                    {profileErrors.mobile && <p className="text-red-500 text-xs mt-1">{profileErrors.mobile}</p>}
                                                </div>
                                            ) : (
                                                <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                                                    {userData?.mobile || 'Not provided'}
                                                </div>
                                            )}
                                        </div>

                                        {/* Member Since */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                                            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800">
                                                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Stats */}
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-green-800 mb-4">Account Summary</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">{userData?.prescriptions?.length || 0}</p>
                                                <p className="text-sm text-green-700">Active Prescriptions</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">{dashboardOrders.length}</p>
                                                <p className="text-sm text-green-700">Total Orders</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-green-600">{dummyVaccinations.length}</p>
                                                <p className="text-sm text-green-700">Vaccinations</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        {isEditingProfile ? (
                                            <>
                                                <button
                                                    onClick={handleProfileSave}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleProfileCancel}
                                                    className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={handleProfileEdit}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
                                                >
                                                    Edit Profile
                                                </button>
                                                <button
                                                    onClick={() => setShowProfile(false)}
                                                    className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
                                                >
                                                    Close
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* My Orders Panel */}
                        {showMyOrders && (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-cyan-600 text-white p-6 md:p-7 relative overflow-hidden">
                                    <div className="absolute -top-16 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                                    <div className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-cyan-300/10 blur-2xl"></div>
                                    <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                                        <div>
                                            <h2 className="text-2xl font-bold">My Orders</h2>
                                            <p className="text-blue-100 text-sm mt-1">Track your medicine orders with full status updates</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
                                            <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3 min-w-[150px] border border-white/20">
                                                <p className="text-[11px] uppercase tracking-wide text-blue-100">Total Orders</p>
                                                <p className="text-lg font-semibold flex items-center gap-1.5">
                                                    <ClipboardList className="w-4 h-4" />
                                                    {dashboardOrders.length}
                                                </p>
                                            </div>
                                            <div className="bg-white/15 backdrop-blur rounded-2xl px-4 py-3 min-w-[150px] border border-white/20">
                                                <p className="text-[11px] uppercase tracking-wide text-blue-100">Total Spent</p>
                                                <p className="text-lg font-semibold flex items-center gap-1.5">
                                                    <IndianRupee className="w-4 h-4" />
                                                    {dashboardOrders.reduce((sum, order) => sum + getDashboardOrderAmount(order), 0)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowMyOrders(false)}
                                        className="absolute top-5 right-5 text-white/80 hover:text-white transition"
                                    >
                                        <X size={20} className="text-white/80 hover:text-white" />
                                    </button>
                                </div>

                                {dashboardOrders && dashboardOrders.length > 0 ? (
                                    <div className="space-y-4 p-6">
                                        {dashboardOrders.map((order, index) => (
                                            <div
                                                key={`${order.id}-${index}`}
                                                className="p-5 bg-white rounded-2xl shadow-sm border border-gray-200"
                                            >
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-medium text-sky-700">
                                                                <Package className="w-3.5 h-3.5" />
                                                                Order #{order.id || 'N/A'}
                                                            </span>
                                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                order.status === 'Delivered'
                                                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                                                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                                                            }`}>
                                                                <Truck className="w-3.5 h-3.5" />
                                                                {order.status}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-medium">Date:</span> {order.date ? new Date(order.date).toLocaleDateString('en-IN') : 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-gray-700 inline-flex items-center gap-1.5">
                                                            <CreditCard className="w-4 h-4 text-gray-500" />
                                                            <span><span className="font-medium">Payment:</span> {order.payment || 'N/A'}</span>
                                                        </p>
                                                        <p className="text-lg font-bold text-gray-900">{order.total || 'Rs 0/-'}</p>
                                                    </div>

                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <button
                                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl shadow transition-colors"
                                                            onClick={() => navigate(`/tracking/${order.id}`)}
                                                        >
                                                            Track Order
                                                        </button>
                                                        <button
                                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 px-4 rounded-xl shadow transition-colors inline-flex items-center gap-1.5"
                                                            onClick={() => toggleDashboardOrderItems(order.id)}
                                                        >
                                                            {expandedDashboardOrder === order.id ? (
                                                                <>
                                                                    <ChevronUp className="w-4 h-4" /> Hide Items
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronDown className="w-4 h-4" /> View Items
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {expandedDashboardOrder === order.id && (
                                                    <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                        <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
                                                        <ul className="space-y-2 text-sm text-gray-700">
                                                            {order.items?.length > 0 ? (
                                                                order.items.map((item, idx) => (
                                                                    <li key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                                                                                <span>{item.name || 'Unnamed Item'}</span>
                                                                                <span className="text-gray-600">Qty {item.quantity || 1} • Rs {item.price || 0}</span>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="text-gray-500">No items available for this order.</li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-6">
                                        <ShoppingBag className="text-gray-300 mx-auto mb-4" size={48} />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Orders Yet</h3>
                                        <p className="text-gray-500 mb-6">Browse our pharmacy and place your first order</p>
                                        <button
                                            onClick={() => navigate('/onlinepharmacy')}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* My Vaccinations Panel */}
                        {showMyVaccinations && (
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                            <Syringe className="text-orange-600" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">My Vaccinations</h2>
                                            <p className="text-sm text-gray-500">View your vaccination records</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowMyVaccinations(false)} className="text-gray-400 hover:text-gray-600 transition">
                                        <X size={20} />
                                    </button>
                                </div>

                                {dummyVaccinations && dummyVaccinations.length > 0 ? (
                                    <div className="space-y-4">
                                        {dummyVaccinations.map((vaccination) => (
                                            <div
                                                key={vaccination.id}
                                                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                                                            <Syringe className="text-orange-600" size={18} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">{vaccination.name}</h3>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">{vaccination.dose}</span>
                                                                <span className="text-xs text-gray-500">{vaccination.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                                                        vaccination.status === 'Completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : vaccination.status === 'Pending'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {vaccination.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Syringe className="text-gray-300 mx-auto mb-4" size={48} />
                                        <h3 className="text-lg font-medium text-gray-600 mb-2">No Vaccinations Recorded</h3>
                                        <p className="text-gray-500">Your vaccination records will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <PrescriptionDialog
                isOpen={isPrescriptionDialogOpen}
                onClose={() => setIsPrescriptionDialogOpen(false)}
            />
        </div>
    );
};

export default Dashboard;

