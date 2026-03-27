import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Video, ExternalLink, Pill, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { baseURL } from "../main";

export function PatientAppointmentBanner({ appointments }) {
    const [appointmentDetails, setAppointmentDetails] = useState([]);
    const [expandedAppointment, setExpandedAppointment] = useState(null);
    const [isMeetingBlocked, setIsMeetingBlocked] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isClicked, setIsClicked] = useState(false);

    const fetchDataFromApi = async () => {
        try {
            const token = localStorage.getItem("medVisionToken");
            const response = await axios.get(`${baseURL}/fetchdata`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const fetchedData = response.data.userData;
            setUserData(fetchedData);
            localStorage.setItem("userData", JSON.stringify(fetchedData));
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        fetchDataFromApi();
    }, []);

    useEffect(() => {
        // Check if `regNo` exists in `userData.confirm`
        if (userData?.confirm?.regNo) {
            setIsMeetingBlocked(true);
        } else {
            setIsMeetingBlocked(false);
        }
    }, [userData]);

    useEffect(() => {
        const fetchPatientNames = async () => {
            try {
                const regNos = appointments.map((appointment) => appointment.regNo);
                const response = await axios.post(`${baseURL}/getnames`, { regNos });
                const nameMap = response.data.reduce((map, doctor) => {
                    map[doctor.regNo] = doctor.name;
                    return map;
                }, {});

                const linkMap = (userData?.link || []).reduce((map, linkItem) => {
                    map[linkItem.regNo] = linkItem.link;
                    return map;
                }, {});

                const medicineMap = {};
                if (userData?.medicines) {
                    userData.medicines.forEach((medicineGroup) => {
                        if (Array.isArray(medicineGroup) && medicineGroup.length > 0) {
                            const regNo = medicineGroup[0].regNo;
                            if (!medicineMap[regNo]) {
                                medicineMap[regNo] = [];
                            }
                            medicineMap[regNo].push(...medicineGroup);
                        }
                    });
                }

                const combinedData = appointments.map((appointment) => ({
                    ...appointment,
                    name: nameMap[appointment.regNo] || "Unknown",
                    videoLink: linkMap[appointment.regNo] || null,
                    medicines: medicineMap[appointment.regNo] || [],
                }));

                setAppointmentDetails(combinedData);
            } catch (error) {
                console.error("Error fetching patient names:", error);
            }
        };

        if (appointments?.length) fetchPatientNames();
    }, [appointments, userData]);

    const handleJoinMeeting = (videoLink) => {
        if (!isMeetingBlocked) {
            window.open(videoLink, "_blank");
            setIsClicked(true);
        }
    };

    const toggleExpand = (index) => {
        setExpandedAppointment(expandedAppointment === index ? null : index);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-800">Your Appointments</h2>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {appointmentDetails.map((appointment, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <User className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {appointment.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{appointment.slot || "No Slot Available"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {appointment.videoLink ? (
                                            <button
    onClick={() => handleJoinMeeting(appointment.videoLink)}
    disabled={isClicked || isMeetingBlocked || appointment.medicines?.length > 0}
    className={`inline-flex items-center px-4 py-2 rounded-md transition-colors gap-2 ${
        isClicked || isMeetingBlocked || appointment.medicines?.length > 0
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
    }`}
>

                                                <Video className="w-4 h-4" />
                                                Join Meeting
                                                <ExternalLink className="w-3 h-3 ml-1" />
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">
                                                Meeting link not available yet
                                            </span>
                                        )}

                                        {appointment.medicines?.length > 0 && (
                                            <button
                                                onClick={() => toggleExpand(index)}
                                                className="inline-flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                            >
                                                <Pill className="w-4 h-4 mr-1" />
                                                Medicines
                                                {expandedAppointment === index ? (
                                                    <ChevronUp className="w-4 h-4 ml-1" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 ml-1" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {expandedAppointment === index && appointment.medicines?.length > 0 && (
                                <div className="border-t border-gray-100 bg-gray-50 p-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                        Prescribed Medicines
                                    </h4>
                                    <div className="space-y-3">
                                        {appointment.medicines.map((medicine, medIndex) => (
                                            <div
                                                key={medicine._id || medIndex}
                                                className="bg-white p-3 rounded-md border border-gray-200"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="font-medium text-gray-800">
                                                            {medicine.name}
                                                        </h5>
                                                        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 mt-1">
                                                            {medicine.type}
                                                        </span>
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {medicine.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {appointmentDetails.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-lg">No appointments scheduled</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
