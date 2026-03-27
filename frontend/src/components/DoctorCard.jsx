import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, IndianRupee, Award, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorCard = ({
  regNo,
  id,
  name,
  specialist,
  rating,
  experience,
  location,
  image,
  nextAvailable,
  fees,
}) => {
  const navigate = useNavigate();
  const [isBook, setIsBook] = useState(false);

  const fetchDataFromApi = async () => {
    try {
      const token = localStorage.getItem('medVisionToken');
      if (token) {
        setIsBook(true);
      }
    } catch (error) {
      console.error('Error booking the doctor:', error.message);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl
    transition-all duration-500 overflow-hidden border border-gray-100
    hover:border-blue-200 hover:-translate-y-2">

      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center
            group-hover:scale-110 transition-transform duration-500">
              <span className="text-5xl font-bold text-blue-600">
                {name?.charAt(0) || 'D'}
              </span>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-1.5
        bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-gray-800">{rating || '4.8'}</span>
        </div>

        {nextAvailable && (
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5
          bg-emerald-500 text-white px-3 py-1.5 rounded-full shadow-lg text-xs font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Available {nextAvailable}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600
          transition-colors duration-300">
            Dr. {name}
          </h3>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            <p className="text-blue-600 font-semibold text-sm">{specialist}</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center
            group-hover:bg-blue-100 transition-colors duration-300">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium">{experience} years experience</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center
            group-hover:bg-emerald-100 transition-colors duration-300">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{fees}</p>
              <p className="text-xs text-gray-500">Consultation</p>
            </div>
          </div>

          <div className="relative group/btn">
            <button
              onClick={() => isBook && navigate(`/book/${regNo}`)}
              disabled={!isBook}
              className={`px-6 py-3 rounded-xl font-semibold text-sm
              transition-all duration-300 shadow-md hover:shadow-lg
              active:scale-95 ${
                isBook
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isBook ? 'Book Now' : 'Login to Book'}
            </button>

            {!isBook && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
              bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0
              group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap
              pointer-events-none z-10">
                Please log in to book an appointment
                <div className="absolute top-full left-1/2 transform -translate-x-1/2
                border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
