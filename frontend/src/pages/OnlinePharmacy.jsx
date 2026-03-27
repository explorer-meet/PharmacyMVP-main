import React, { useState, useEffect } from 'react';
import { Pill } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MedicineCard from '../components/MedicineCard';
import CartButton from '../components/CartButton';
import PromoBanner from '../components/PromoBanner';
import PrescriptionDialog from '../components/PrescriptionDialog';
import axios from 'axios';
import { baseURL } from '../main';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function OnlinePharmacy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [userData, setUserData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [medicinename, setMedicineName] = useState(location.state?.medicinename || null);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);

  const fetchmedicines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/allmedicines`);
      console.log(response.data); // Debug API response
      setMedicines(response.data.pharmacy || []); // Store all medicines in state
    } catch (err) {
      console.error('Error loading medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataFromApi = async () => {
    try {
      const token = localStorage.getItem('medVisionToken');
      const response = await axios.get(`${baseURL}/fetchdata`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedData = response.data.userData;
      setUserData(fetchedData);

      localStorage.setItem('userData', JSON.stringify(fetchedData));
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  useEffect(() => {
    fetchmedicines();
  }, []);

  useEffect(() => {
    if (location.state?.medicinename) {
      // Save the value locally and clear the state
      setMedicineName(location.state.medicinename);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (medicinename) {
      // Find a medicine that includes the medicinename (case insensitive)
      const matchedMedicine = medicines.find(med =>
        med.name.toLowerCase().includes(medicinename.toLowerCase())
      );

      if (matchedMedicine) {
        setSearchTerm(matchedMedicine.name); // Set full official name
      } else {
        setSearchTerm(medicinename); // Fallback to provided name
      }
    }
  }, [medicinename, medicines]);


  const filteredMedicines = medicines.filter((medicine) => {
    const firstWord = searchTerm.toLowerCase().split(" ")[0]; // Only use the first word
    const combinedFields = `${medicine.name} ${medicine.manufacturer} ${medicine.type}`.toLowerCase();

    return combinedFields.includes(firstWord);
  });



  // Limit the display to the first 6 medicines if no search term is entered
  const displayedMedicines = searchTerm ? filteredMedicines : medicines.slice(0, 6);

  return (
    <div className="relative z-[100]">
      <Navbar />
      <div className="mt-20 min-h-screen bg-gray-50 relative">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 mb-8">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <Pill className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Online Pharmacy</h1>
          </div>
        </div>
      </div>

      <CartButton />

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="text-center mb-8">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search our extensive catalog of medicines and check their availability
          </p>
          <button
            onClick={() => setIsPrescriptionDialogOpen(true)}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Upload Prescription
          </button>
        </div>

        <SearchBar onSearchChange={setSearchTerm} />

        <div className="mt-8">
          {displayedMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No medicines found matching your search criteria.</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    {...medicine}
                    onAddToCart={() => setCartCount((prev) => prev + 1)}
                  />
                ))}
              </div>
              {!searchTerm && medicines.length > 6 && (
                <div className="text-center mt-4">
                  <p className="text-blue-600 font-semibold">Many more medicines available...(100+)</p>
                </div>
              )}
            </div>
          )}
        </div>

        <PromoBanner />
      </div>
    </div>

    <PrescriptionDialog
      isOpen={isPrescriptionDialogOpen}
      onClose={() => setIsPrescriptionDialogOpen(false)}
    />
    </div>
  );
}

export default OnlinePharmacy;
