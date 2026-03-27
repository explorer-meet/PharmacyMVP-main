import { useState } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Linkedin, Phone, MapPin, Heart } from "lucide-react";

function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    function submitEmailHandler() {
        if (email) {
            console.log(email);
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    }

    function scrollSmooth() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <footer className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">

                    {/* Newsletter Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-2">
                                Subscribe Today
                            </h2>
                            <p className="text-blue-100 text-sm">
                                Get health tips & updates in your inbox
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative flex items-center bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 transition duration-300">
                                    <Mail className="w-5 h-5 ml-4 text-blue-300" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={emailHandler}
                                        placeholder="your@email.com"
                                        required
                                        className="w-full px-4 py-3 bg-transparent focus:outline-none text-white placeholder-white/50 text-sm"
                                    />
                                    <button
                                        onClick={submitEmailHandler}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 px-4 py-3 text-white"
                                    >
                                        <ArrowRight className='w-5 h-5' />
                                    </button>
                                </div>
                            </div>

                            {subscribed && (
                                <div className="bg-emerald-500/20 border border-emerald-400/50 rounded-lg px-4 py-2 text-emerald-200 text-sm flex items-center gap-2 animate-pulse">
                                    <Heart className="w-4 h-4" />
                                    Thanks for subscribing!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Doctor Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-4 pb-3 border-b-2 border-blue-500/50">
                                Doctor's Portal
                            </h3>
                            <div className="flex flex-col gap-3 text-white/70">
                                <Link
                                    onClick={scrollSmooth}
                                    to="/login"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    Login Doctor
                                </Link>
                                <Link
                                    onClick={scrollSmooth}
                                    to="/signup"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    Signup
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-4 pb-3 border-b-2 border-blue-500/50">
                                About
                            </h3>
                            <div className="flex flex-col gap-3 text-white/70">
                                <Link
                                    onClick={scrollSmooth}
                                    to="/"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                    Our Blogs
                                </Link>
                                <Link
                                    onClick={scrollSmooth}
                                    to="/"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                    Privacy Policy
                                </Link>
                                <Link
                                    onClick={scrollSmooth}
                                    to="/"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                                    Terms & Conditions
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* User Section */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-4 pb-3 border-b-2 border-blue-500/50">
                                User Portal
                            </h3>
                            <div className="flex flex-col gap-3 text-white/70 mb-6">
                                <Link
                                    onClick={scrollSmooth}
                                    to="/login"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    Login User
                                </Link>
                                <Link
                                    onClick={scrollSmooth}
                                    to="/signup"
                                    className="hover:text-blue-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 text-sm"
                                >
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                    Signup
                                </Link>
                            </div>

                            <div>
                                <p className="text-xs text-white/50 mb-3 font-medium">CONNECT WITH US</p>
                                <div className="flex gap-3">
                                    <Link to="">
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 border border-blue-500/30">
                                            <Linkedin className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
                    <div className="text-sm text-white/70">
                        © 2024 <span className="font-semibold text-white">MEDVISION</span> PRIVATE LIMITED. All Rights Reserved.
                    </div>
                    <div className="flex items-center justify-center md:justify-end gap-6 text-xs text-white/60">
                        <Link to="/" className="hover:text-blue-300 transition">Support</Link>
                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                        <Link to="/" className="hover:text-blue-300 transition">Careers</Link>
                        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                        <Link to="/" className="hover:text-blue-300 transition">Contact</Link>
                    </div>
                </div>

            </div>

        </footer>
    );
}

export default Footer;
