import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserRound, CheckCircle2, XCircle } from 'lucide-react';
import { FaNotesMedical, FaUserMd, FaHome, FaFilePrescription, FaHistory, FaVideo, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaIdCard, FaGraduationCap, FaHospital, FaWeight, FaRulerVertical } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { baseURL } from '../main';
import { FaPerson } from 'react-icons/fa6';
import { MdLocalPharmacy } from 'react-icons/md';


// const baseURL = 'https://api.example.com'; // Replace with your actual API base URL

const Dashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDataFromApi = async () => {
        try {
            const token = localStorage.getItem('medVisionToken');
            const response = await axios.get(`${baseURL}/adminfetchdata`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAdminData(response.data.adminData);
            localStorage.setItem('adminData', JSON.stringify(response.data.adminData));
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('medVisionToken');
            const response = await axios.get(`${baseURL}/doctors`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            setDoctor(response.data.doctors); // Ensure the backend response matches this structure
            setLoading(false);
        } catch (err) {
            console.error("Error fetching doctors:", err.message);
            setError("Failed to fetch doctor data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
        fetchDataFromApi();
    }, []);

    // useEffect(() => {
    //     if (adminData) {
    //         setStatus(adminData);
    //     }
    // }, [adminData]);

    //if admin accepts the doctor then this function should run
    const acceptDoctor = async (regno) => {
        try {
            // Sending the regno in the request body
            const response = await axios.put(`${baseURL}/acceptdoctor`, {
                regno,        // Include regno in the body
                assign: false,
                status: "accepted",
            });

            console.log(response);
            if (response.status === 200) {
                console.log(`Doctor with regno ${regno} has been accepted successfully.`);
                fetchDoctors();
            } else {
                console.error(`Failed to accept the doctor with regno ${regno}.`);
            }
        } catch (error) {
            console.error(`Error accepting doctor with regno ${regno}:`, error.message);
        }
    };


    //if admin rejects the doctor then this function should reject
    const rejectDoctor = (regno) => {
        console.log(`Doctor Rejected with ${regno}`);
    }

    const sidebarItems =
        [
            { icon: FaHome, text: "Home", onClick: () => navigate('/'), disabled: false },
            // { icon: FaPerson, text: "Profile", onClick: () => navigate(''), disabled: false },
            { icon: MdLocalPharmacy, text: "Add Medicines", onClick: () => navigate('/addmedicine'), disabled: false },
            { icon: MdLocalPharmacy, text: "Update Medicines", onClick: () => navigate('/updatemedicine'), disabled: false },
            { icon: MdLocalPharmacy, text: "Delete Medicines", onClick: () => navigate('/deletemedicine'), disabled: false },
            { icon: MdLocalPharmacy, text: "Online Tracking Update", onClick: () => navigate('/admintracking'), disabled: false },
        ]


    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Sidebar */}
            <aside className="w-64 p-6 text-white bg-sky-700">
                <h2 className="mb-6 text-2xl font-bold"> Admin Dashboard</h2>
                <nav className="space-y-2">
                    {sidebarItems.map((item, index) => (
                        <button
                            key={index}
                            className={`flex items-center w-full px-4 py-2 space-x-2 text-left transition-colors rounded hover:bg-blue-600 ${item.disabled ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                            onClick={!item.disabled ? item.onClick : undefined}
                            disabled={item.disabled} // Disables the button if item.disabled is true
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.text}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Doctor Approvals</h1>
                        <p className="text-gray-600 mt-2">Review and approve doctor applications</p>
                    </div>

                    {loading && <p>Loading doctors...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctor.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
                                <div className="relative">
                                    {/* <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-48 object-cover"
                                    /> */}
                                    <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                                        <UserRound className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>

                                    <div className="space-y-2 mb-6">
                                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                                        <div className="text-gray-600 text-sm space-y-1">
                                            <p>Registration No.: {doctor.regNo}</p>
                                            <p>Experience: {doctor.experience} years</p>
                                            <p>Hospital: {doctor.hospital}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                            onClick={() => acceptDoctor(doctor.regNo)}
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Approve
                                        </button>
                                        <button
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                            onClick={() => rejectDoctor(doctor.regNo)}
                                        >
                                            <XCircle className="w-5 h-5" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

        </div>
    );
};

export default Dashboard;