import React, { useState, useEffect } from "react";
import { Stethoscope, Users, TrendingUp, Heart } from "lucide-react";
import SearchFilters from "../components/SearchFilters";
import DoctorCard from "../components/DoctorCard";
import axios from "axios";
import { baseURL } from "../main";
import Navbar from "../components/Navbar";

const SearchDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialists");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/alldoctors`);
      setDoctors(response.data.doctors || []);
    } catch (err) {
      setError("Failed to fetch doctors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter((doctor) => {
        const matchesSearch =
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialist.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSpecialty =
          selectedSpecialty === "All Specialists" ||
          doctor.specialist === selectedSpecialty;

        return matchesSearch && matchesSpecialty;
      })
    : [];

  return (
    <div>
      <Navbar />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700
                  rounded-2xl shadow-lg transform hover:rotate-6 transition-transform duration-300">
                    <Stethoscope className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500
                  rounded-full border-4 border-white"></div>
                </div>

                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    Find Your Doctor
                  </h1>
                  <p className="text-gray-600 text-base lg:text-lg">
                    Connect with trusted healthcare professionals near you
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3
                hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{doctors.length}+</p>
                    <p className="text-xs text-gray-600">Doctors</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3
                hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                    <p className="text-xs text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 mb-10
          border border-gray-100 backdrop-blur-sm">
            <SearchFilters
              onSpecialtyChange={setSelectedSpecialty}
              onSearchChange={setSearchTerm}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent
                rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-gray-600 text-lg font-medium animate-pulse">
                Loading doctors...
              </p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200
            text-red-700 rounded-3xl p-12 text-center shadow-lg">
              <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center
              mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-xl font-semibold">{error}</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl
            p-16 text-center shadow-lg">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center
              mx-auto mb-4">
                <Stethoscope className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-xl font-medium mb-2">
                No doctors found
              </p>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 font-medium">
                  Showing <span className="text-blue-600 font-bold">{filteredDoctors.length}</span> doctors
                  {selectedSpecialty !== "All Specialists" && (
                    <span> in <span className="text-blue-600 font-bold">{selectedSpecialty}</span></span>
                  )}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} {...doctor} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDoctor;
