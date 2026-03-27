import React from 'react'
import { AlertTriangle, Phone, Clock, MapPin, ChevronRight, Heart, Thermometer, Stethoscope, Pill } from 'lucide-react'

export default function EmergencyCare() {
  const emergencyPrecautions = [
    { icon: Heart, title: "Check for breathing", description: "Ensure the person is breathing. If not, start CPR immediately." },
    { icon: Thermometer, title: "Control bleeding", description: "Apply direct pressure to any bleeding wounds." },
    { icon: Stethoscope, title: "Don't move the injured", description: "Unless in immediate danger, don't move someone with potential spinal injuries." },
    { icon: Pill, title: "Don't give anything by mouth", description: "Avoid giving food or drink to an injured person." },
  ]

  const importantMarks = [
    { title: "Chest Pain", description: "Could indicate a heart attack. Seek immediate medical attention." },
    { title: "Difficulty Breathing", description: "May be a sign of severe allergic reaction or respiratory distress." },
    { title: "Severe Bleeding", description: "Can lead to shock if not controlled quickly." },
    { title: "Loss of Consciousness", description: "Could be a sign of various serious conditions." },
  ]

  return (
    <div className="mt-[20vh] min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Emergency Care</h1>
          <p className="mt-2">Quick guide for urgent medical situations</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Emergency Precautions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyPrecautions.map((precaution, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-start">
                <precaution.icon className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-blue-700 mb-2">{precaution.title}</h3>
                  <p className="text-gray-600">{precaution.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Important Marks of Emergency</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {importantMarks.map((mark, index) => (
              <div key={index} className="p-4 border-b border-blue-100 last:border-b-0">
                <h3 className="font-semibold text-lg text-blue-700 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  {mark.title}
                </h3>
                <p className="text-gray-600 ml-7">{mark.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Emergency Contacts</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Phone className="w-6 h-6 text-blue-500 mr-3" />
              <span className="text-xl font-semibold text-blue-700">Emergency: 911</span>
            </div>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-500 mr-3" />
              <span className="text-gray-600">Available 24/7</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-blue-500 mr-3" />
              <span className="text-gray-600">Nearest Hospital: City General Hospital</span>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            Learn more about emergency preparedness
            <ChevronRight className="w-5 h-5 ml-1" />
          </a>
        </div>
      </main>

      <footer className="bg-blue-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-blue-600">
          <p>Remember, in case of a medical emergency, always call your local emergency number immediately.</p>
        </div>
      </footer>
    </div>
  )
}