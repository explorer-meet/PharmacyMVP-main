import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { baseURL } from "../main";

import { Mail, Lock, Heart, Activity, Shield } from "lucide-react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import {  FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

const Login = () => {

  const [type, setType] = useState("password");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {

      const response = await axios.post(`${baseURL}/login`, formData);

      if (response.status === 200) {

        toast.success("Login successful!");

        localStorage.setItem("medVisionToken", response.data.token);

        navigate("/dashboard");

      }

    } catch (error) {

      toast.error("Login failed. Please try again.");
      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  return (
    <>
      {loading ? (
        <Loader />
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
                  <Heart className="text-white text-5xl" strokeWidth={1.5} />
                </div>

                <h2 className="text-4xl font-bold mb-4 tracking-tight">
                  MedVision Health
                </h2>

                <p className="text-white/90 text-lg text-center max-w-sm mb-8">
                  Your trusted digital healthcare partner. Access prescriptions,
                  manage appointments, and stay connected with pharmacy care.
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


              {/* LOGIN FORM */}

              <div className="flex flex-col justify-center p-8 md:p-12">

                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Welcome Back
                  </h2>

                  <p className="text-gray-500">
                    Sign in to access your healthcare portal
                  </p>
                </div>


                <form onSubmit={submitHandler} className="flex flex-col gap-5">

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
                        placeholder="Enter your password"
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


                  {/* FORGOT PASSWORD */}

                  <div className="flex justify-end text-sm">

                    <span
                      onClick={() => navigate("/forgot-password")}
                      className="text-blue-600 cursor-pointer hover:underline font-medium"
                    >
                      Forgot Password?
                    </span>

                  </div>


                  {/* LOGIN BUTTON */}

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Login to your account
                  </button>

                </form>


                {/* SIGNUP */}

                <p className="text-sm text-gray-500 mt-6 text-center">

                  Don’t have an account?{" "}

                  <span
                    onClick={() => navigate("/signup")}
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Sign up here
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


                {/* SOCIAL LOGIN BUTTONS */}

                <div className="grid grid-cols-3 gap-3">

                  <button className="flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
                    <FaGoogle className="text-red-500 text-xl" />
                  </button>

                  <button className="flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
                    <FaFacebook className="text-blue-600 text-xl" />
                  </button>

                  <button className="flex items-center justify-center gap-2 border-2 border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
                    <FaTwitter className="text-sky-500 text-xl" />
                  </button>

                </div>

              </div>

            </div>

          </div>
        </>
      )}
    </>
  );
};

export default Login;