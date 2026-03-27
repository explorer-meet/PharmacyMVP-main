import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package2 } from 'lucide-react';
import { MedicineForm } from '../components/medicine-admin/MedicineForm';
import { FaHome } from 'react-icons/fa';
import { MdLocalPharmacy } from 'react-icons/md';

function UpdateMedicine() {

  const navigate = useNavigate();
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
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 p-6 text-white bg-sky-700">
          <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                className={`flex items-center w-full px-4 py-2 space-x-2 text-left transition-colors rounded hover:bg-blue-600 ${item.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={!item.disabled ? item.onClick : undefined}
                disabled={item.disabled}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center">
                <Package2 className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-3xl font-bold text-gray-900">Medicine Management</h1>
              </div>
              <p className="mt-2 text-gray-600">Update medicines in the inventory database</p>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <MedicineForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default UpdateMedicine;