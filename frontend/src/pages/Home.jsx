import React, { useState } from "react";
import arrow from "../assets/arrow.png";
import semicircle from "../assets/semicircle.png";
import doctor from "../assets/doctor.png";
import bgelement from "../assets/bg element.png";
import search from "../assets/search.png";
import pharm from "../assets/pharm.png";
import emergency from "../assets/emergency.png";
import info from "../assets/info.png";
import consultation from "../assets/consultation.png";
import tracking from "../assets/tracking.png";
import feedback from "../assets/feedback.png";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import FeedbackCarousal from "../components/FeedbackCarousal";
import toast from "react-hot-toast";
import { baseURL } from "../main";
import axios from "axios";
import { Heart, Zap, Shield, Clock, Users, TrendingUp } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickSearch = () => navigate("/searchdoctor");
  const handleConsultation = () => navigate("/");
  const handleOnlinePharmacy = () => navigate("/onlinepharmacy");
  const handleMLPharmacy = () => navigate("/disease");
  const handleEmergencyPharmacy = () => navigate("/emergencyguidelines");
  const handleDoctorSearch = () => navigate("/searchdoctor");

  const handleEmergencyComingSoon = () => {
    toast("Coming Soon...", {
      style: {
        background: "#2563eb",
        color: "#fff",
      },
    });
  };

  return (
    <div className="w-full overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <div
        id="head"
        className="relative w-full lg:min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-start lg:items-center px-4 sm:px-6 lg:px-16 pt-24 lg:pt-0 pb-12 lg:pb-0 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

        {/* Left Content */}
        <div className="w-full lg:w-1/2 z-10 relative">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Find & Search Your
            </h1>

            <div className="flex flex-wrap items-center gap-3 lg:gap-4">
              <div className="text-blue-600 relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Favourite
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Doctor
              </h1>
            </div>

            <p className="text-gray-600 text-base lg:text-lg lg:w-4/5 leading-relaxed">
              Connect with experienced medical professionals, book appointments, and manage your healthcare journey effortlessly. Access trusted specialists in your area.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleClickSearch}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold
                shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95
                flex items-center justify-center gap-2 sm:w-auto"
              >
                <Zap className="w-5 h-5" />
                Get Started
              </button>

              <button
                onClick={handleDoctorSearch}
                className="px-8 py-3.5 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold
                hover:bg-blue-50 transition-all duration-300 active:scale-95"
              >
                Explore Doctors
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">5000+</p>
                  <p className="text-xs text-gray-500">Doctors</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-gray-900">50K+</p>
                  <p className="text-xs text-gray-500">Happy Patients</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-gray-900">4.8★</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden lg:flex w-1/2 relative justify-center items-end">
          <img
            src={semicircle}
            alt="semicircle"
            className="absolute bottom-0 right-0 w-full opacity-20 animate-pulse"
          />
          <div className="relative h-[85vh] drop-shadow-2xl animate-float">
            <img
              src={doctor}
              alt="doctor"
              className="h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* ================= FEATURES HIGHLIGHT ================= */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Clock, label: "24/7 Available", color: "blue" },
            { icon: Shield, label: "Secure & Safe", color: "emerald" },
            { icon: Zap, label: "Instant Booking", color: "blue" },
            { icon: Heart, label: "Best Doctors", color: "emerald" },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300 group"
            >
              <div className={`p-3 rounded-lg bg-${feature.color}-100 group-hover:scale-110 transition-transform duration-300 mb-3`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
              </div>
              <p className="font-semibold text-gray-800 text-sm">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SERVICES SECTION ================= */}
      <div id="about" className="py-20 px-4 sm:px-6 lg:px-16 relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">

        {/* Decorative Elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare <span className="text-blue-600">Solutions</span>
            </h2>

            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We provide tailored healthcare solutions designed around your needs. Experience seamless medical assistance with trusted professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: consultation,
                title: "Book Appointments",
                desc: "Choose your doctor from thousands of specialists and trusted hospitals.",
                onClick: handleDoctorSearch,
                icon: "📅",
              },
              {
                img: pharm,
                title: "Online Pharmacy",
                desc: "Buy medicines with easy and secure doorstep delivery.",
                onClick: handleOnlinePharmacy,
                icon: "💊",
              },
              {
                img: emergency,
                title: "Emergency Care",
                desc: "Immediate care services available anytime for your family.",
                onClick: handleEmergencyComingSoon,
                icon: "🚑",
              },
            ].map((service, index) => (
              <div
                key={index}
                onClick={service.onClick}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-3 border border-gray-100 hover:border-blue-200 overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={service.img}
                      alt={service.title}
                      className="h-16 w-16 object-contain"
                    />
                    <span className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-125">
                      {service.icon}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-100 group-hover:border-blue-200 transition-colors duration-300">
                    <p className="text-blue-600 font-semibold text-sm flex items-center gap-2">
                      Learn More
                      <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TESTIMONIAL SECTION ================= */}
      <div
        id="feedback"
        className="lg:min-h-screen bg-gradient-to-r from-blue-50 via-white to-emerald-50 flex flex-col lg:flex-row items-center px-4 sm:px-6 lg:px-16 py-20 lg:py-0 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>

        {/* Left Text */}
        <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10 mb-12 lg:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-2">
            What Our
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Patients Say
            </span>
          </h2>

          <p className="text-gray-600 text-lg lg:w-4/5 leading-relaxed mb-8">
            Trusted by thousands of patients for reliable and efficient healthcare services. Your satisfaction is our priority.
          </p>

          <div className="flex gap-4 lg:gap-8">
            <div>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">50K+</p>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full lg:w-1/2 flex justify-center relative z-10">
          <div className="w-full max-w-md">
            <FeedbackCarousal />
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <Footer />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
