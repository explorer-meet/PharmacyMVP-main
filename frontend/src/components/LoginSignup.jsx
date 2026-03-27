import React from 'react';
import Navbar from "../components/Navbar";
import { User, Stethoscope, Pill, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

const LoginSignup = ({ isDoctor, setIsDoctor, formData, handleChange, submitHandler, type, setType, title }) => {

    const accentColorStyle = { color: '#2563eb' };

    if (isDoctor === '') {
        return (
            <>
                <Navbar />

                <div className='w-full min-h-screen flex justify-center px-4 pt-36 pb-10 bg-gray-50'>
                    <div className='w-full max-w-md md:max-w-xl lg:max-w-3xl shadow-xl flex flex-col justify-center items-center rounded-[20px] bg-white border border-gray-100 p-6 md:p-10'>

                        {/* HEADER */}
                        <div className='mb-6 flex items-center gap-3'>
                            <div className='bg-blue-600 p-3 rounded-full'>
                                <Pill className='w-8 h-8 text-white' />
                            </div>
                            <p className='font-semibold text-2xl text-gray-700'>{title}</p>
                        </div>

                        <p className='text-center font-medium mb-10 text-gray-600 px-2'>
                            "Your trusted partner in health and wellness—log in to access quality medications and expert pharmaceutical care."
                        </p>

                        {/* LOGIN OPTIONS */}
                        <div className='flex flex-col md:flex-row justify-center items-center gap-6 w-full'>

                            {/* CUSTOMER LOGIN */}
                            <div
                                onClick={() => setIsDoctor('patient')}
                                className='flex flex-col items-center gap-4 p-6 rounded-xl bg-blue-50 border hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer w-full md:w-[220px]'
                            >
                                <div className='bg-white p-5 rounded-full shadow-md'>
                                    <User className='w-14 h-14 text-blue-600' strokeWidth={1.5} />
                                </div>

                                <p className='font-semibold text-lg text-gray-700'>
                                    Customer
                                </p>

                                <p className='text-sm text-gray-500 text-center'>
                                    Access prescriptions & orders
                                </p>
                            </div>


                            {/* PHARMACIST LOGIN (COMMENTED OUT) */}

                            {/*
                            <div
                                onClick={() => setIsDoctor('doctor')}
                                className='flex flex-col items-center gap-4 p-6 rounded-xl bg-teal-50 border hover:border-teal-400 hover:shadow-lg transition-all duration-300 cursor-pointer w-full md:w-[220px]'
                            >
                                <div className='bg-white p-5 rounded-full shadow-md'>
                                    <Stethoscope className='w-14 h-14 text-teal-600' strokeWidth={1.5} />
                                </div>

                                <p className='font-semibold text-lg text-gray-700'>
                                    Pharmacist
                                </p>

                                <p className='text-sm text-gray-500 text-center'>
                                    Manage pharmacy operations
                                </p>
                            </div>
                            */}

                        </div>

                        <div className='mt-8 text-center'>
                            <p className='text-sm text-gray-400'>
                                Secure login powered by encrypted authentication
                            </p>
                        </div>

                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className='w-full min-h-screen flex justify-center px-4 pt-36 pb-10 bg-gray-50'>

                <div className='w-full max-w-md md:max-w-xl shadow-xl flex flex-col rounded-[20px] bg-white border border-gray-100 p-6 md:p-10'>

                    {/* BACK BUTTON */}
                    <div className='flex items-center justify-between mb-6'>

                        <div className='flex items-center gap-3'>
                            <div
                                className='border border-blue-600 p-2 rounded-full cursor-pointer'
                                onClick={() => setIsDoctor('')}
                            >
                                <ArrowLeft className='w-5 h-5 text-blue-600' />
                            </div>

                            <p className='text-sm text-gray-500 uppercase'>
                                Back
                            </p>
                        </div>

                        <p className='font-semibold text-xl text-gray-700'>
                            Customer Login
                        </p>

                        <div className='w-8'></div>

                    </div>


                    {/* LOGIN FORM */}
                    <form onSubmit={submitHandler} className='flex flex-col gap-6'>

                        {/* EMAIL */}
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-600'>Email Address</label>

                            <div className='flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-blue-600'>
                                <Mail style={accentColorStyle} className='w-5 h-5' />

                                <input
                                    className='w-full bg-transparent outline-none text-gray-800 placeholder-gray-400'
                                    type="email"
                                    placeholder='your.email@pharmacy.com'
                                    value={formData.email}
                                    name='email'
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>


                        {/* PASSWORD */}
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm font-medium text-gray-600'>Password</label>

                            <div className='flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-blue-600'>
                                <Lock style={accentColorStyle} className='w-5 h-5' />

                                <input
                                    className='w-full bg-transparent outline-none text-gray-800 placeholder-gray-400'
                                    type={type}
                                    placeholder='Enter your password'
                                    value={formData.password}
                                    name='password'
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type='button'
                                    onClick={() => setType(type === 'password' ? 'text' : 'password')}
                                    className='text-blue-600'
                                >
                                    {type === 'password'
                                        ? <EyeOff className='w-5 h-5' />
                                        : <Eye className='w-5 h-5' />}
                                </button>
                            </div>
                        </div>


                        {/* SUBMIT BUTTON */}
                        <button
                            type='submit'
                            className='w-full py-3 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition'
                        >
                            SIGN IN
                        </button>


                        <p className='text-sm text-gray-500 text-center'>
                            Don't have an account?
                            <span className='font-semibold text-blue-600 cursor-pointer hover:underline ml-1'>
                                Sign up here
                            </span>
                        </p>

                    </form>


                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-400'>
                            Secure login powered by encrypted authentication
                        </p>
                    </div>

                </div>

            </div>
        </>
    );
};

export default LoginSignup;