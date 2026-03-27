import React, { useState } from 'react';
import axios from 'axios';

export default function LungCancer() {
  const [formData, setFormData] = useState(new FormData());
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    formData.set(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5003/predictlungcancer', formData);
      console.log('Response from API:', response.data);
      setResult(response.data.Output);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  const handleReset = () => {
    setFormData(new FormData());
    setResult('');
    // Reset all input fields
    document.querySelectorAll('input[type=number]').forEach(input => input.value = '');
  };

  const inputFields = [
    { name: 'gn', label: 'Gender' },
    { name: 'age', label: 'Age' },
    { name: 'sm', label: 'Smoking' },
    { name: 'yf', label: 'Yellow Fingers' },
    { name: 'an', label: 'Anxiety' },
    { name: 'pp', label: 'Peer Pressure' },
    { name: 'cd', label: 'Chronic Disease' },
    { name: 'ft', label: 'Fatigue' },
    { name: 'all', label: 'Allergy' },
    { name: 'wh', label: 'Wheezing' },
    { name: 'ac', label: 'Alcohol Consuming' },
    { name: 'co', label: 'Coughing' },
    { name: 'sb', label: 'Shortness of breath' },
    { name: 'sd', label: 'Swalloing Difficulty' },
    { name: 'cp', label: 'Chest Pain' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Lung Cancer Prediction</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
              {inputFields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}:
                  </label>
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    onChange={handleChange}
                    step={field.name === 'oldpeak' ? 'any' : '1'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              >
                Reset
              </button>
            </div>
          </form>
          {result && (
            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">Prediction Result:</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}