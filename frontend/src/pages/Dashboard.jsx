import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Activity, Calendar, Heart, Pill, FileText, TrendingUp, Clock, User, Mail, Phone, MapPin, AlertCircle, Menu, X, Home, CircleUser as UserCircle, Stethoscope, ShoppingBag, History, Syringe, Bell, MessageSquare, Mail as MailIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
    const [notifications, setNotifications] = useState({
        sms: true,
        email: true
    });
    const navigate = useNavigate();

    const healthData = [
        { month: 'Jan', heartRate: 72, weight: 70 },
        { month: 'Feb', heartRate: 75, weight: 69 },
        { month: 'Mar', heartRate: 71, weight: 68 },
        { month: 'Apr', heartRate: 73, weight: 68 },
        { month: 'May', heartRate: 70, weight: 67 },
        { month: 'Jun', heartRate: 72, weight: 67 },
    ];

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
                    doctorName: "Dr. Sarah Johnson",
                    date: "2024-03-15",
                    status: "active"
                },
                {
                    id: 2,
                    medicineName: "Ibuprofen 200mg",
                    dosage: "200mg",
                    frequency: "As needed",
                    duration: "30 days",
                    doctorName: "Dr. Michael Chen",
                    date: "2024-03-10",
                    status: "active"
                },
                {
                    id: 3,
                    medicineName: "Lisinopril 10mg",
                    dosage: "10mg",
                    frequency: "Once daily",
                    duration: "Ongoing",
                    doctorName: "Dr. Emily Davis",
                    date: "2024-02-28",
                    status: "active"
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
                appointments: [],
                prescriptions: [
                    {
                        id: 1,
                        medicineName: "Amoxicillin 500mg",
                        dosage: "500mg",
                        frequency: "3 times daily",
                        duration: "7 days",
                        doctorName: "Dr. Sarah Johnson",
                        date: "2024-03-15",
                        status: "active"
                    },
                    {
                        id: 2,
                        medicineName: "Ibuprofen 200mg",
                        dosage: "200mg",
                        frequency: "As needed",
                        duration: "30 days",
                        doctorName: "Dr. Michael Chen",
                        date: "2024-03-10",
                        status: "active"
                    },
                    {
                        id: 3,
                        medicineName: "Lisinopril 10mg",
                        dosage: "10mg",
                        frequency: "Once daily",
                        duration: "Ongoing",
                        doctorName: "Dr. Emily Davis",
                        date: "2024-02-28",
                        status: "active"
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

    const sidebarItems = [
        { icon: Home, text: "Home", onClick: () => navigate('/'), color: "text-blue-500" },
        { icon: Pill, text: "My Prescriptions", onClick: () => {
            // Toggle prescription list display on the dashboard
            setShowPrescriptions(!showPrescriptions);
        }, color: "text-purple-500" },
        { icon: Bell, text: "Notifications", onClick: () => {
            // Toggle notifications settings display on the dashboard
            setShowNotifications(!showNotifications);
        }, color: "text-yellow-500" },
        { icon: UserCircle, text: "Profile", onClick: () => navigate('/patientProfile'), color: "text-green-500" },
        { icon: Pill, text: "Search Medicine", onClick: () => navigate('/onlinepharmacy'), color: "text-pink-500" },
        { icon: ShoppingBag, text: "My Orders", onClick: () => navigate('/orders'), color: "text-orange-500" },
        { icon: Syringe, text: "My Vaccinations", onClick: () => navigate('/myvaccinations'), color: "text-orange-500" }
    ];

    const statsCards = [
        {
            icon: Calendar,
            label: "Appointments",
            value: userData?.appointments?.length || 0,
            change: `+${userData?.appointments?.length} current appointments`,
            color: "bg-gradient-to-br from-blue-300 to-blue-400",
            onClick: () => navigate('/searchdoctor')
        },
        {
            icon: Pill,
            label: "Prescriptions",
            value: userData?.prescriptions?.length || 0,
            change: "Upload & manage prescriptions",
            color: "bg-gradient-to-br from-blue-200 to-blue-300",
            onClick: () => setIsPrescriptionDialogOpen(true)
        },
          {
            icon: Syringe,
            label: "Vaccinations",
            change: "",
            color: "bg-gradient-to-br from-blue-300 to-blue-400",
            onClick: () => navigate('/myvaccinations')
        },
    ];


    const quickActions = [
        {
            icon: Pill,
            title: "Order Medicine",
            desc: "Browse pharmacy",
            color: "from-blue-200 to-blue-300",
            onClick: () => navigate('/onlinepharmacy')
        },
        {
            icon: History,
            title: "Your Orders",
            desc: "View past orders",
            color: "from-blue-300 to-blue-400",
            onClick: () => navigate('/orders')
        },
        {
            icon: Activity,
            title: "Track Medicines",
            desc: "Coming Soon",
            color: "from-blue-100 to-blue-200",
            comingSoon: true
        }
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

                        {/* Sidebar Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-900">MedVision</h2>
                                    <p className="text-blue-700 text-sm">Patient Portal</p>
                                </div>

                                <button
                                    className="lg:hidden text-blue-900 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* User Profile Section */}
                        <div className="p-6 border-b border-blue-100 bg-blue-50/40">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 flex items-center justify-center text-blue-900 font-bold text-lg">
                                    {userData?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">
                                        {userData?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {userData?.email || 'user@example.com'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            {sidebarItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-3 space-x-3 text-left rounded-xl
                    hover:bg-blue-50 transition-all group"
                                    onClick={item.onClick}
                                >
                                    <item.icon
                                        className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`}
                                    />
                                    <span className="font-medium text-gray-700 group-hover:text-blue-700">
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

                                <div className="mt-4 lg:mt-0">
                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl px-6 py-3 shadow">
                                        <p className="text-sm text-blue-600">Today's Date</p>
                                        <p className="text-xl font-bold text-blue-900">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Stats Cards */}
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statsCards.map((stat, index) => (
                                <div
                                    key={index}
                                    onClick={stat.onClick}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
                                    data-prescription-card={stat.label === 'Prescriptions' ? 'true' : undefined}
                                >

                                    {/* Coming Soon Badge */}
                                    {stat.comingSoon && (
                                        <span className="absolute top-3 right-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            Coming Soon
                                        </span>
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                            <stat.icon size={24} />
                                        </div>
                                    </div>

                                    <h3 className="text-gray-500 text-sm font-medium mb-1">
                                        {stat.label}
                                    </h3>

                                    <p className="text-2xl font-bold text-gray-800 mb-1">
                                        {stat.value}
                                    </p>

                                    {stat.change && (
                                        <p className="text-xs text-green-500 font-medium">
                                            {stat.change}
                                        </p>
                                    )}

                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Quick Actions
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={!action.comingSoon ? action.onClick : undefined}
                                        className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white text-left relative
                ${action.comingSoon ? "opacity-60 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105"}
                transition-all duration-300`}
                                    >

                                        {/* Coming Soon Badge */}
                                        {action.comingSoon && (
                                            <span className="absolute top-3 right-3 text-xs bg-white/80 text-blue-700 px-2 py-1 rounded-full">
                                                Coming Soon
                                            </span>
                                        )}

                                        <action.icon size={32} className="mb-4" />

                                        <h3 className="font-bold text-lg mb-1">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-white/80">
                                            {action.desc}
                                        </p>

                                    </button>
                                ))}
                            </div>
                        </div>

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
                                                                    Dr. {prescription.doctorName}
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

                                                    <div className="ml-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            prescription.status === 'active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {prescription.status}
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
                                                <p className="text-sm text-gray-600">Receive appointment reminders and updates via SMS</p>
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
                                            <li>• Appointment confirmations and reminders</li>
                                            <li>• Prescription refill notifications</li>
                                            <li>• Lab test results availability</li>
                                            <li>• Health reports and summaries</li>
                                            <li>• Important updates from your healthcare provider</li>
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

                        {/* Health Trends */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Health Trends</h2>
                                <TrendingUp className="text-green-500" size={24} />
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={healthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Line type="monotone" dataKey="heartRate" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Health Profile */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Health Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-blue-50">
                                    <User className="text-blue-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Name</p>
                                        <p className="font-semibold text-gray-800">{userData?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-green-50">
                                    <Mail className="text-green-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-semibold text-gray-800 truncate">{userData?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-purple-50">
                                    <Phone className="text-purple-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-semibold text-gray-800">{userData?.mobile || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-pink-50">
                                    <Calendar className="text-pink-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Date of Birth</p>
                                        <p className="font-semibold text-gray-800">{userData?.dob || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-orange-50">
                                    <Activity className="text-orange-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Weight</p>
                                        <p className="font-semibold text-gray-800">{userData?.weight ? `${userData.weight} kg` : 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-4 rounded-xl bg-teal-50">
                                    <TrendingUp className="text-teal-600" size={20} />
                                    <div>
                                        <p className="text-xs text-gray-500">Height</p>
                                        <p className="font-semibold text-gray-800">{userData?.height ? `${userData.height} ft` : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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

