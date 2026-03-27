import React, { useState, useEffect } from 'react';
import { Video, Pill, X } from 'lucide-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { baseURL } from '../main';
import toast from 'react-hot-toast';

export const AppointmentBanner = ({ appointments, regNo, userData }) => {
    const [showPrescribeModal, setShowPrescribeModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [currentMedicine, setCurrentMedicine] = useState({
        name: '',
        type: 'tablet',
        description: ''
    });

    // Track joined appointments
    const [joinedAppointments, setJoinedAppointments] = useState([]);

    const [prescribedAppointments, setPrescribedAppointments] = useState([]);

    const [blockedNames, setBlockedNames] = useState([]);

    useEffect(() => {
        if (userData?.confirm) {
            const blocked = userData.confirm.map((entry) => entry.name);
            setBlockedNames(blocked);
        } else {
            setBlockedNames([]);
        }
    }, [userData]);

    const handleJoin = async (appointment) => {
        const videoLink = 'https://www.videosdk.live/prebuilt/demo';

        try {
            // Send the link and appointment details to the backend
            const response = await axios.post(`${baseURL}/linkgiven`, {
                regNo,
                videoLink,
                patientName: appointment.patientName // Adjust the fields as per your backend API requirements
            });

            if (response.status === 200) {
                console.log('Link sent successfully to the backend and patient dashboard');
                // Open the video call
                window.open(videoLink, '_blank');
                // Mark appointment as joined
                setJoinedAppointments((prev) => [...prev, appointment.id]);
            } else {
                console.error('Failed to send link to the backend:', response.data);
            }
        } catch (error) {
            console.error('Error sending link to the backend:', error);
        }
    };

    const handlePrescribe = (appointment) => {
        setSelectedAppointment(appointment);
        setShowPrescribeModal(true);
    };

    const addMedicine = () => {
        if (currentMedicine.name && currentMedicine.description) {
            setMedicines([...medicines, currentMedicine]);
            setCurrentMedicine({
                name: '',
                type: 'tablet',
                description: ''
            });
        }
    };

    const removeMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const savePrescription = async () => {

        try {
            // Sending the prescription to the backend
            const response = await axios.post(`${baseURL}/uploadpres`, {
                medicines,
                regNo,
                patientName: selectedAppointment?.patientName
            });

            if (response.status === 200) {
                console.log('presciption successfully sent');
                toast.success('Prescription sent successfully!');
                setPrescribedAppointments((prev) => [...prev, selectedAppointment.id]);
            }
        } catch (error) {
            console.error('Error sending link to the backend:', error);
        }
        setShowPrescribeModal(false); // Close the modal after saving
    };

    const logPrescriptionAction = async () => {
        try {
            // Sending the prescription to the backend
            const response = await axios.post(`${baseURL}/confirmstatus`, {
                regNo,
                patientName: selectedAppointment?.patientName
            });

            if (response.status === 200) {
                console.log('Confirm status updated successfully');
            }
        } catch (error) {
            console.error('Error updating confirm status to the backend:', error);
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Appointments</h2>

            <div className="space-y-4">
                {appointments?.map((appointment) => {
                    const isBlocked = blockedNames.includes(appointment.patientName);
                    const isJoined = joinedAppointments.includes(appointment.id);
                    const isPrescribed = prescribedAppointments.includes(appointment.id);

                    return (
                        <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                                    <p className="text-gray-600">
                                        {appointment.date} at {appointment.slot}
                                    </p>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => handleJoin(appointment)}
                                        className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${isJoined || isBlocked
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                        disabled={isJoined || isBlocked}
                                    >
                                        <Video className="w-4 h-4 mr-2" />
                                        {isJoined ? 'Joined' : 'Join'}
                                    </button>
                                    <button
                                        onClick={() => handlePrescribe(appointment)}
                                        className={`inline-flex items-center px-4 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500 transition-colors ${isPrescribed || isBlocked
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : ''
                                            }`}
                                        disabled={isPrescribed || isBlocked}
                                    >
                                        <Pill className="w-4 h-4 mr-2" />
                                        {isPrescribed ? 'Prescribed' : 'Prescribe'}
                                    </button>
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <button class="inline-flex items-center px-4 py-2 rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600 animate-blink">
                                   View DropBox
                                </button>
                            </div>


                        </div>
                    );
                })}
            </div>

            {/* Prescribe Modal */}
            {showPrescribeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">
                                Prescription for {selectedAppointment?.patientName}
                            </h3>
                            <button
                                onClick={() => setShowPrescribeModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Medicine form and list */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Medicine Name
                                    </label>
                                    <input
                                        type="text"
                                        value={currentMedicine.name}
                                        onChange={(e) => setCurrentMedicine({
                                            ...currentMedicine,
                                            name: e.target.value
                                        })}
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter medicine name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={currentMedicine.type}
                                        onChange={(e) => setCurrentMedicine({
                                            ...currentMedicine,
                                            type: e.target.value
                                        })}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="tablet">Tablet</option>
                                        <option value="syrup">Syrup</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={currentMedicine.description}
                                    onChange={(e) => setCurrentMedicine({
                                        ...currentMedicine,
                                        description: e.target.value
                                    })}
                                    className="w-full p-2 border rounded-md"
                                    rows={3}
                                    placeholder="Enter dosage and instructions"
                                />
                            </div>

                            <button
                                onClick={addMedicine}
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Add Medicine
                            </button>

                            {/* Medicine List */}
                            <div className="mt-6">
                                <h4 className="font-medium mb-3">Prescribed Medicines</h4>
                                <div className="space-y-2">
                                    {medicines.map((medicine, index) => (
                                        <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-md">
                                            <div>
                                                <h5 className="font-medium">{medicine.name}</h5>
                                                <p className="text-sm text-gray-600">Type: {medicine.type}</p>
                                                <p className="text-sm text-gray-600">{medicine.description}</p>
                                            </div>
                                            <button
                                                onClick={() => removeMedicine(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowPrescribeModal(false)}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        savePrescription();
                                        logPrescriptionAction();
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

AppointmentBanner.propTypes = {
    appointments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            patientName: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired
        })
    ).isRequired
};

export default AppointmentBanner;
