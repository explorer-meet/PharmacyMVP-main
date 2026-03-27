import React, { useState } from 'react';
import { FileText, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../main';
import axios from 'axios';
import MedLoader from './MedLoader';

const PromoBanner = () => {
  const navigate = useNavigate();
  const [openmodal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [prescriptionmedicines, setPrescriptionMedicines] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleconsultdoctor = () => {
    navigate('/searchdoctor');
    console.log('This is being directed to booking appointments with doctor');
  };

  const handleprescription = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
    setPrescriptionMedicines([]);
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedImage);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5004/pres', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      if (response.status == 200) {
        console.log("Success");
        setPrescriptionMedicines(response.data);
      }
      setOpenModal(true);
      // if (response.data) {
      //   setUploadedImage(`data:image/png;base64,${response.data.image}`);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file); // Store actual file for upload
    }
  };

  const handleSubmitMedicine = (medicinename) => {
    console.log("Medicine Found :", medicinename);
    setOpenModal(false);
    navigate('/onlinepharmacy', { state: { medicinename } });
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mt-8"
    >
      <div className="grid md:grid-cols-2 gap-6"
      >
        {/* Upload Prescription Card */}
        <div className="relative flex items-center gap-4 bg-white/80 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleprescription}
        >
          {/* Coming Soon Tag */}
          <div className="absolute top-2 left-0 bg-orange-800 text-white text-xs font-bold px-2 py-1 rounded transform rotate-[-25deg] z-10 shadow-lg">
            New!
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Upload Prescription</h3>
            <p className="text-sm text-gray-600">
              Get medicines delivered to your doorstep
            </p>
          </div>
        </div>

        {/* Consult Doctor Card */}
        <div
          className="flex items-center gap-4 bg-white/80 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleconsultdoctor}
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Consult Doctor</h3>
            <p className="text-sm text-gray-600">Get expert medical advice online</p>
          </div>
        </div>

        {openmodal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
              <h2 className="text-xl font-bold mb-4">Upload Your Prescription</h2>
              <p className="text-gray-700 mb-4">Scan and upload your prescription image.</p>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4"
              />

              {selectedImage && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Prescription Preview"
                    className="rounded-md shadow max-h-60 object-contain"
                  />
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center mt-6 gap-2">
                  <MedLoader />
                  <span className="text-sm font-medium text-gray-600">Scanning...</span>
                </div>
              ) : prescriptionmedicines.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">Medicines Found</h3>
                  <ul className="text-sm text-gray-800 space-y-2 max-h-40 overflow-y-auto">
                    {prescriptionmedicines.map((medicine, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded shadow-sm">
                        <span>{medicine}</span>
                        <button
                          className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                          onClick={() => handleSubmitMedicine(medicine)}
                        >
                          Search
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}




              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleUploadPrescription}
                >
                  Scan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;
