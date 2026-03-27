import React from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import AvailabilitySection from '../components/AvailabilitySection';
import { AppointmentBanner } from '../components/AppointmentBanner';


const DoctorDashboard = ({ userData }) => {

   
    const renderUserInfo = () => (
        <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {userData?.name}</p>
            <p><span className="font-medium">Registration No:</span> {userData?.regNo}</p>
            <p><span className="font-medium">Speciality:</span> {userData?.specialist}</p>
            <p><span className="font-medium">Experience:</span> {userData?.experience} years</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="mb-6 text-3xl font-semibold text-blue-700">
                Doctor Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-8">
                    {/* User Info */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-semibold text-blue-700">User Information</h2>
                        {renderUserInfo()}
                    </div>

                    {/* Appointments */}
                    <div className="min-h-screen bg-gray-50 p-8">
                        <div className="max-w-2xl mx-auto">
                            <AppointmentBanner appointments={userData?.appointments} regNo = {userData?.regNo} userData={userData} />
                        </div>
                    </div>
                </div>

                {/* Availability Section */}
                <div>
                    <AvailabilitySection regno={userData?.regNo} />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;