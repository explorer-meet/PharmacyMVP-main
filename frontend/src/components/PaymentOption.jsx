import React from 'react';

export function PaymentOption({ icon, title, description, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        selected
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'border-2 border-gray-200 hover:border-blue-200'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`${selected ? 'text-blue-500' : 'text-gray-600'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}