import React from 'react'
import { HeartIcon, BrainIcon, CigaretteIcon as LungIcon, BabyIcon as KidneyIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DiseasePrediction() {
  const diseases = [
    { name: 'Heart Disease', icon: HeartIcon, available: true, route: '/heart-disease' },
    // { name: 'Brain Tumor', icon: BrainIcon, available: false },
    { name: 'Lung Cancer', icon: LungIcon, available: true, route: '/lungcancerprediction' },
    { name: 'Kidney Disease', icon: KidneyIcon, available: true, route: '/kidneyprediction' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Disease Prediction using ML</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {diseases.map((disease, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 ${
              disease.available ? 'cursor-pointer' : 'opacity-75'
            }`}
          >
            <div className="p-6">
              <disease.icon className={`w-16 h-16 mx-auto mb-4 ${disease.available ? 'text-blue-500' : 'text-gray-400'}`} />
              <h2 className="text-xl font-semibold text-center mb-2">{disease.name}</h2>
              {disease.available ? (
                <p className="text-green-500 text-center">Available</p>
              ) : (
                <p className="text-yellow-500 text-center">Coming Soon</p>
              )}
            </div>
            {disease.available && (
              <Link to={disease.route} className="block">
                <div className="bg-blue-500 text-white text-center py-2 hover:bg-blue-600 transition duration-300">
                  Start Prediction
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}