import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseURL } from '../main';

const DoctorProfile = () => {
  const [status, setStatus] = useState('pending'); // 'approved', 'rejected', or 'pending'
  const [assign, setAssign] = useState(false);
  const [showstatus, setShowStatus] = useState(false);
  const [formData, setFormData] = useState({
    photo: null,
    regNo: '',
    address: '',
    fees: '',
    hospital: '',
    specialist: '',
    experience: '',
    location: '',
    applicationstatus: ''
  });
  const [userData, setUserData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const token = localStorage.getItem('medVisionToken');
        const response = await axios.get(`${baseURL}/fetchdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUserData = response.data.userData;
        setUserData(fetchedUserData);

        // Persist user data in local storage
        localStorage.setItem('userData', JSON.stringify(fetchedUserData));

        // Update assign state based on fetched data
        if (fetchedUserData?.assign === true) {
          setAssign(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    // Check if data exists in local storage on initial load
    const savedUserData = JSON.parse(localStorage.getItem('userData'));
    if (savedUserData?.assign === true) {
      setAssign(true);
    } else {
      // Fetch data if not available in local storage
      fetchDataFromApi();
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        assign: true,
        status: status
      };

      // Sending the updated formData to the backend
      const response = await axios.post(`${baseURL}/profile`, dataToSubmit);
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
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Doctor Profile Registration</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Registration Form */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <form onSubmit={submitHandler} className="space-y-6">
                  <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                      Profile Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="regNo" className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="regNo"
                      id="regNo"
                      value={formData.regNo}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter full address"
                    ></textarea>
                  </div>
                  <div>
                    <label htmlFor="fees" className="block text-sm font-medium text-gray-700">
                      Institute Fees
                    </label>
                    <input
                      type="number"
                      name="fees"
                      id="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label htmlFor="fees" className="block text-sm font-medium text-gray-700">
                      Hospital
                    </label>
                    <input
                      type="text"
                      name="hospital"
                      id="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Hospital name"
                    />
                  </div>
                  <div>
                    <label htmlFor="specialist" className="block text-sm font-medium text-gray-700">
                      Specialization
                    </label>
                    <select
                      id="specialist"
                      name="specialist"
                      value={formData.specialist}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select specialization</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Orthopedic">Orthopedic</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      id="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter your location"
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

              {/* Status Banner */}
              {(showstatus || assign) && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Status</h2>

                  <div className={`p-4 rounded-md ${status === 'approved' ? 'bg-green-50 border border-green-400' :
                    status === 'rejected' ? 'bg-red-50 border border-red-400' :
                      'bg-yellow-50 border border-yellow-400'
                    }`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {status === 'approved' && (
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {status === 'rejected' && (
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        {status === 'pending' && (
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${status === 'approved' ? 'text-green-800' :
                          status === 'rejected' ? 'text-red-800' :
                            'text-yellow-800'
                          }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </h3>
                        <div className={`mt-2 text-sm ${status === 'approved' ? 'text-green-700' :
                          status === 'rejected' ? 'text-red-700' :
                            'text-yellow-700'
                          }`}>
                          <p>
                            {status === 'approved' && 'Your application has been approved. Welcome aboard!'}
                            {status === 'rejected' && 'We regret to inform you that your application has been rejected.'}
                            {status === 'pending' && 'Your application is currently under review. We\'ll notify you once a decision has been made.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;























