import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseURL } from '../main';
import axios from 'axios';
import { Menu, X, LogOut, LayoutDashboard, LogIn, UserPlus, Stethoscope, Clock } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('medVisionToken');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    const scrollToElement = (id) => {
        const element = document.getElementById(id);
        const headerOffset = 70;

        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    const fetchDataFromApi = async () => {
        try {
            const response = await axios.get(`${baseURL}/fetchdata`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUserData(response.data.userData);
            localStorage.setItem('userData', JSON.stringify(response.data.userData));
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchadminDataFromApi = async () => {
        try {
            const response = await axios.get(`${baseURL}/adminfetchdata`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setAdminData(response.data.adminData);
            localStorage.setItem('adminData', JSON.stringify(response.data.adminData));
        } catch (error) {
            console.error("Error fetching admin data:", error.message);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (token) {
            fetchDataFromApi();
            fetchadminDataFromApi();
        }

        if (localStorage.getItem('userData') || localStorage.getItem('adminData')) {
            setIsLoggedIn(true);
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('medVisionToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('adminData');
        setIsLoggedIn(false);
        setMenuOpen(false);
        navigate('/');
    };

    const options = { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' };
    const formattedDate = currentTime.toLocaleDateString(undefined, options);
    const formattedTime = currentTime.toLocaleTimeString();

    return (
        <>
            <div className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/80 shadow-lg border-b border-blue-100/50">

                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 max-w-[1400px] mx-auto">

                    {/* Logo */}
                    <div
                        onClick={() => {
                            navigate('/');
                            setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                            MedVision
                        </p>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-8 text-gray-700 font-medium">

                        <button
                            onClick={() => { navigate('/'); scrollToElement('head'); }}
                            className="relative group px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </button>

                        <button
                            onClick={() => { navigate('/'); scrollToElement('about'); }}
                            className="relative group px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            Our Services
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </button>

                        <button
                            className="relative group px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            Application
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </button>

                        <button
                            onClick={() => { navigate('/'); scrollToElement('feedback'); }}
                            className="relative group px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            Feedbacks
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                        </button>
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden xl:flex items-center gap-6">

                        {!isLoggedIn ? (
                            <div className="flex items-center gap-4">

                                <Link to="/login"
                                    className="px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold
                                transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-95
                                flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>

                                <Link to="/signup"
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold
                                shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                                    <UserPlus className="w-4 h-4 inline mr-2" />
                                    Sign Up
                                </Link>

                            </div>
                        ) : (
                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => {
                                        if (adminData) navigate('/admindashboard');
                                        else if (userData) navigate('/dashboard');
                                    }}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold
                                shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95
                                flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </button>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setShowLogoutModal(true);
                                    }}

                                    className="px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold
  transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-95
  flex items-center gap-2">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>

                            </div>
                        )}

                        {/* Timer - Desktop Only */}
                        <div className="ml-4 pl-4 border-l border-blue-200">
                            <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-emerald-50 px-4 py-3 rounded-xl shadow-sm border border-blue-100">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-xs text-blue-600 font-medium">{formattedDate}</p>
                                    <p className="text-sm font-bold text-blue-700">{formattedTime}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="xl:hidden p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300 active:scale-95"
                    >
                        {menuOpen ? (
                            <X className="w-6 h-6 text-blue-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-blue-600" />
                        )}
                    </button>

                </div>

                {/* Mobile + Tablet Menu */}
                {menuOpen && (
                    <div className="xl:hidden bg-white border-t border-blue-100 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col px-4 py-6 space-y-4">

                            {/* Navigation Links */}
                            <div className="space-y-3 pb-6 border-b border-blue-100">
                                <button
                                    onClick={() => { navigate('/'); scrollToElement('head'); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                                >
                                    Home
                                </button>

                                <button
                                    onClick={() => { navigate('/'); scrollToElement('about'); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                                >
                                    Our Services
                                </button>

                                <button
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                                >
                                    Application
                                </button>

                                <button
                                    onClick={() => { navigate('/'); scrollToElement('feedback'); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                                >
                                    Feedbacks
                                </button>
                            </div>

                            {/* Auth Buttons */}
                            {!isLoggedIn ? (
                                <div className="flex flex-col gap-3">

                                    <Link to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold
                                    transition-all duration-300 hover:bg-blue-600 hover:text-white
                                    flex items-center justify-center gap-2">
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </Link>

                                    <Link to="/signup"
                                        onClick={() => setMenuOpen(false)}
                                        className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold
                                    shadow-md transition-all duration-300 hover:shadow-lg
                                    flex items-center justify-center gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </Link>

                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">

                                    <button
                                        onClick={() => {
                                            if (adminData) navigate('/admindashboard');
                                            else if (userData) navigate('/dashboard');
                                            setMenuOpen(false);
                                        }}
                                        className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold
                                    shadow-md transition-all duration-300 hover:shadow-lg
                                    flex items-center justify-center gap-2">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </button>

                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            setShowLogoutModal(true);
                                        }}

                                        className="px-4 py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold
                                    transition-all duration-300 hover:bg-blue-600 hover:text-white
                                    flex items-center justify-center gap-2">
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>

                                </div>
                            )}

                            {/* Mobile Timer */}
                            <div className="mt-6 pt-6 border-t border-blue-100 bg-gradient-to-br from-blue-50 to-emerald-50 px-4 py-4 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Current Time</p>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{formattedDate}</p>
                                <p className="text-2xl font-bold text-blue-700">{formattedTime}</p>
                            </div>

                        </div>
                    </div>
                )}
            </div>
            {showLogoutModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-fadeIn">

                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            Confirm Logout
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to logout? You will need to log in again to access your account.
                        </p>

                        <div className="flex justify-end gap-3">

                            {/* Cancel */}
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
                                Cancel
                            </button>

                            {/* Confirm */}
                            <button
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    handleLogout();
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-md">
                                Yes, Logout
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
