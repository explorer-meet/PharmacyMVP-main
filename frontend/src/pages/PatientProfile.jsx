import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../main';

const DoctorProfile = () => {
    const [status, setStatus] = useState('pending'); // 'approved', 'rejected', or 'pending'
    const [assign, setAssign] = useState(false);
    const [showstatus, setShowStatus] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        mobile: '',
        weight: '',
        dob: '',
        height: '',
        sex: '',
        bloodgroup: ''
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Sending the updated formData to the backend
            const response = await axios.post(`${baseURL}/patientprofile`, formData);
            if (response.status === 200) {
                toast.success('Profile Updated Successfully and initiated application!');
                setShowStatus(true);
            }
        } catch (error) {
            toast.error('Error updating profile');
            console.error(error);
        }
    };



    return (
        <div className="mt-[10vh] min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Patient Profile Registration</h1>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Registration Form */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                                <form onSubmit={submitHandler} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Name:
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <textarea
                                            type="text"
                                            name="address"
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter full address"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                            Mobile Number:
                                        </label>
                                        <input
                                            type="number"
                                            name="mobile"
                                            id="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter mobile number"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                            Weight:
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            id="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                            placeholder="60kg"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                            D.O.B:
                                        </label>
                                        <input
                                            type="text"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            placeholder="Enter your date of birth"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                            Height:
                                        </label>
                                        <input
                                            type="number"
                                            name="height"
                                            id="height"
                                            value={formData.height}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter years of experience"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                            Sex
                                        </label>
                                        <input
                                            type="text"
                                            name="sex"
                                            id="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Male/Female"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="bloodgroup" className="block text-sm font-medium text-gray-700">
                                            Blood Group:
                                        </label>
                                        <input
                                            type="text"
                                            name="bloodgroup"
                                            id="bloodgroup"
                                            value={formData.bloodgroup}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter your blood group"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Submit Application
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;























