import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../main';
import { useLocationOptions } from '../hooks/useLocationOptions';

const PatientProfile = () => {
    const [, setShowStatus] = useState(false);
    const [formData, setFormData] = useState({
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        countryCode: '+91',
        mobile: '',
        email: '',
        address: '',
        state: '',
        pincode: '',
        sex: ''
    });
    const { countryOptions, stateOptions } = useLocationOptions(formData.countryCode);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const nextValue = type === 'file' ? files[0] : value;
        setFormData((prev) => ({
            ...prev,
            [name]: nextValue,
            ...(name === 'countryCode' ? { state: '' } : {}),
        }));
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
        <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 pb-12" style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 3rem)' }}>
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
                                        <label htmlFor="salutation" className="block text-sm font-medium text-gray-700">
                                            Salutation
                                        </label>
                                        <select
                                            name="salutation"
                                            id="salutation"
                                            value={formData.salutation}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select salutation</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            name="middleName"
                                            id="middleName"
                                            value={formData.middleName}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter middle name (optional)"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mobile Number
                                        </label>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleChange}
                                                className="rounded-l-md border border-r-0 border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                            >
                                                {countryOptions.map((option) => (
                                                    <option key={option.code} value={option.code}>{option.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                className="block w-full min-w-0 flex-1 rounded-r-md border border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                                placeholder="Enter mobile number"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email ID
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            id="address"
                                            rows="3"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter full address"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <select
                                            name="state"
                                            id="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={!stateOptions.length}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select state</option>
                                            {stateOptions.map((stateName) => (
                                                <option key={stateName} value={stateName}>{stateName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            id="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter pincode"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                            Sex
                                        </label>
                                        <select
                                            name="sex"
                                            id="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
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

export default PatientProfile;























