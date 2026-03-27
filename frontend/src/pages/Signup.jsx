import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { baseURL } from "../main";

import {
  Mail,
  Lock,
  Heart,
  Activity,
  Shield,
  User,
  Stethoscope,
} from "lucide-react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

const Signup = () => {
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [isDoctor, setIsDoctor] = useState("");

  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isDoctor: false,
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData?.password !== formData?.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/signup`, formData);
      if (response.status === 201) {
        toast.success("Signup successful!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setIsDoctor(role);
    setFormData({
      ...formData,
      isDoctor: role === "doctor",
    });
  };

  const handleBackToRole = () => {
    setIsDoctor("");
    setFormData({
      regNo: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isDoctor: false,
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : isDoctor === "" ? (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center px-4 py-12 pt-28 relative overflow-hidden">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

            <div className="w-full max-w-6xl relative z-10">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  Join{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    MedVision Health
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  Select your account type to get started
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* <button
                  onClick={() => handleRoleSelect("doctor")}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                      <Stethoscope className="w-12 h-12 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Medical Professional</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Register as a healthcare provider to manage patient care, prescriptions, and medical records
                    </p>

                    <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all duration-300">
                      <span>Continue as Doctor</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200/20 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                </button> */}

                <div className="md:col-span-2 flex justify-center">
                  <button
                    onClick={() => handleRoleSelect("patient")}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-cyan-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                        <User className="w-12 h-12 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Patient
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Create your account to book appointments, access health
                        records, and connect with healthcare providers
                      </p>

                      <div className="flex items-center justify-center gap-2 text-cyan-600 font-semibold group-hover:gap-4 transition-all duration-300">
                        <span>Continue as Patient</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/20 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>
                  </button>
                </div>
              </div>

              <p className="text-center mt-12 text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/")}
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Sign in here
                </span>
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center px-4 py-12 pt-28 relative overflow-hidden">
            {/* BACKGROUND BLOBS */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

            <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden relative z-10 border border-white/20">
              {/* LEFT HEALTHCARE PANEL */}
              <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#0078F0] via-blue-600 to-cyan-600 text-white p-12">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full mb-6 inline-flex">
                  <Heart className="text-white" size={48} strokeWidth={1.5} />
                </div>

                <h2 className="text-4xl font-bold mb-4 tracking-tight">
                  MedVision Health
                </h2>

                <p className="text-white/90 text-lg text-center max-w-sm mb-8">
                  Your trusted digital healthcare partner. Join thousands of
                  healthcare providers and patients.
                </p>

                <div className="flex gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Shield size={22} />
                    </div>
                    <p className="text-sm text-white/80">Secure</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Activity size={22} />
                    </div>
                    <p className="text-sm text-white/80">Real-time</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Heart size={22} />
                    </div>
                    <p className="text-sm text-white/80">Trusted</p>
                  </div>
                </div>
              </div>

              {/* SIGNUP FORM */}
              <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-500">
                    {isDoctor === "doctor"
                      ? "Register as a medical professional"
                      : "Register as a patient"}
                  </p>
                </div>

                <form onSubmit={submitHandler} className="flex flex-col gap-5">
                  {isDoctor === "doctor" && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Medical Registration Number
                      </label>

                      <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Stethoscope className="text-blue-500 mr-3" size={20} />

                        <input
                          type="text"
                          placeholder="Enter your registration number"
                          name="regNo"
                          value={formData.regNo}
                          onChange={handleChange}
                          required
                          className="w-full outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* NAME */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Full Name
                    </label>

                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <User className="text-blue-500 mr-3" size={20} />

                      <input
                        type="text"
                        placeholder="Enter your full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email Address
                    </label>

                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <Mail className="text-blue-500 mr-3" size={20} />

                      <input
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Password
                    </label>

                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <Lock className="text-blue-500 mr-3" size={20} />

                      <input
                        type={type}
                        placeholder="Create a strong password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full outline-none bg-transparent"
                      />

                      {type === "password" ? (
                        <FaRegEyeSlash
                          onClick={() => setType("text")}
                          className="text-blue-500 cursor-pointer"
                        />
                      ) : (
                        <FaRegEye
                          onClick={() => setType("password")}
                          className="text-blue-500 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Confirm Password
                    </label>

                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <Lock className="text-blue-500 mr-3" size={20} />

                      <input
                        type={type2}
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full outline-none bg-transparent"
                      />

                      {type2 === "password" ? (
                        <FaRegEyeSlash
                          onClick={() => setType2("text")}
                          className="text-blue-500 cursor-pointer"
                        />
                      ) : (
                        <FaRegEye
                          onClick={() => setType2("password")}
                          className="text-blue-500 cursor-pointer"
                        />
                      )}
                    </div>
                  </div>

                  {/* SIGNUP BUTTON */}
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Create Account
                  </button>
                </form>

                {/* BACK BUTTON */}
                <p className="text-sm text-gray-500 mt-6 text-center">
                  <span
                    onClick={handleBackToRole}
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Back to role selection
                  </span>
                </p>

                {/* DIVIDER */}
                <div className="flex items-center my-6">
                  <div className="flex-grow border-t"></div>
                  <span className="px-4 text-sm text-gray-500">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t"></div>
                </div>

                {/* SOCIAL SIGNUP BUTTONS */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <FaGoogle className="text-red-500 text-xl" />
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <FaFacebook className="text-blue-600 text-xl" />
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <FaTwitter className="text-sky-500 text-xl" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-6 text-center">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Signup;
