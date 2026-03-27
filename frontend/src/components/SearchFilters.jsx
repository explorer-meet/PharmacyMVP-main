import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilters = ({ onSpecialtyChange, onSearchChange }) => {

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />

        <input
          type="text"
          placeholder="Search by doctor name or specialty..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100
          bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100
          outline-none transition-all duration-300 text-gray-700 placeholder-gray-400
          text-base shadow-sm hover:border-gray-200"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => onSpecialtyChange(specialty)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white
              hover:shadow-md hover:scale-105 active:scale-95"
            >
              {specialty}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SearchFilters;
