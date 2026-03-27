import React, { useState } from 'react';
import { Syringe, Calendar } from 'lucide-react';

const vaccinations = [
    { id: 1, name: 'COVID-19' },
    { id: 2, name: 'Influenza (Flu)' },
    { id: 3, name: 'Measles, Mumps, Rubella (MMR)' },
    { id: 4, name: 'Tetanus, Diphtheria, Pertussis (Tdap)' },
    { id: 5, name: 'Hepatitis A' },
    { id: 6, name: 'Hepatitis B' },
    { id: 7, name: 'Polio (IPV)' },
    { id: 8, name: 'Varicella (Chickenpox)' },
    { id: 9, name: 'Pneumococcal' },
    { id: 10, name: 'Meningococcal' },
    { id: 11, name: 'HPV (Human Papillomavirus)' },
    { id: 12, name: 'Rotavirus' },
    { id: 13, name: 'Haemophilus influenzae type b (Hib)' },
];

function MyVaccinations() {
    const [data, setData] = useState(
        vaccinations.map(v => ({
            ...v,
            status: 'not_vaccinated',
            dueDate: ''
        }))
    );

    const handleStatusChange = (id, value) => {
        setData(prev =>
            prev.map(item =>
                item.id === id ? { ...item, status: value } : item
            )
        );
    };

    const handleDateChange = (id, value) => {
        setData(prev =>
            prev.map(item =>
                item.id === id ? { ...item, dueDate: value } : item
            )
        );
    };

    return (
        <>
            <div className="h-16" /> {/* Spacer equal to navbar height */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 pt-24">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                            <Syringe className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Vaccination Tracker
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage and track your vaccination status
                            </p>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">

                                {/* Table Head */}
                                <thead className="bg-gray-50 border-b">
                                    <tr className="text-gray-600 text-xs uppercase tracking-wider">
                                        <th className="p-4 text-left">Vaccine</th>
                                        <th className="p-4 text-left">Status</th>
                                        <th className="p-4 text-left">Due Date</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {data.map((vaccine, index) => (
                                        <tr
                                            key={vaccine.id}
                                            className={`border-b last:border-none hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                                }`}
                                        >

                                            {/* Vaccine Name */}
                                            <td className="p-4 font-medium text-gray-900">
                                                {vaccine.name}
                                            </td>

                                            {/* Status */}
                                            <td className="p-4">
                                                <select
                                                    value={vaccine.status}
                                                    onChange={(e) =>
                                                        handleStatusChange(vaccine.id, e.target.value)
                                                    }
                                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border focus:outline-none transition
                          ${vaccine.status === 'vaccinated'
                                                            ? 'bg-green-100 text-green-700 border-green-300'
                                                            : 'bg-red-100 text-red-700 border-red-300'
                                                        }`}
                                                >
                                                    <option value="not_vaccinated">Not Vaccinated</option>
                                                    <option value="vaccinated">Vaccinated</option>
                                                </select>
                                            </td>

                                            {/* Due Date */}
                                            <td className="p-4">
                                                {vaccine.status === 'vaccinated' ? (
                                                    <div className="flex items-center gap-2 bg-gray-50 border px-3 py-1.5 rounded-lg w-fit">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="date"
                                                            value={vaccine.dueDate}
                                                            onChange={(e) =>
                                                                handleDateChange(vaccine.id, e.target.value)
                                                            }
                                                            className="bg-transparent outline-none text-sm text-gray-700"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-blue-600 text-sm font-medium">Get vaccinated to stay protected!</span>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-6 text-xs text-gray-500">
                        * Keep your vaccination records updated for better health tracking.
                    </div>

                </div>
            </div>
        </>
    );
}

export default MyVaccinations;