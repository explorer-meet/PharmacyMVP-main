import React, { useState, useEffect } from 'react';
import { Pill } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MedicineCard from '../components/MedicineCard';
import CartButton from '../components/CartButton';
import axios from 'axios';
import { baseURL } from '../main';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CheckoutFooter from '../components/CheckoutFooter';

function OnlinePharmacy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [userData, setUserData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [medicinename, setMedicineName] = useState(location.state?.medicinename || null);
  const [openCartOnLoad, setOpenCartOnLoad] = useState(Boolean(location.state?.openCart));

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
    if (location.state?.openCart) {
      setOpenCartOnLoad(true);
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
      <div className="min-h-screen bg-[#f7fbff] relative" style={{ paddingTop: 'calc(var(--app-navbar-offset, 88px) + 0.5rem)' }}>
      {/* Pharmacy header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950 to-emerald-900 mb-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="max-w-6xl mx-auto px-4 py-10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Pill className="w-7 h-7 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">MedVision</p>
              <h1 className="text-2xl font-black text-white leading-tight">Online Pharmacy</h1>
              <p className="text-sm text-cyan-100 mt-0.5">Browse medicines &amp; order with ease</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-center text-white/80 text-sm">
            <div><p className="text-2xl font-black text-white">100+</p><p>Medicines</p></div>
            <div className="w-px h-8 bg-white/20" />
            <div><p className="text-2xl font-black text-white">24h</p><p>Delivery</p></div>
            <div className="w-px h-8 bg-white/20" />
            <div><p className="text-2xl font-black text-white">Rx</p><p>Accepted</p></div>
          </div>
        </div>
      </div>

      <CartButton openOnMount={openCartOnLoad} />

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <SearchBar onSearchChange={setSearchTerm} />

        <div className="mt-8">
          {displayedMedicines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No medicines found matching your search criteria.</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedMedicines.map((medicine, index) => (
                  <MedicineCard
                    key={medicine.id}
                    {...medicine}
                    requiresPrescription={index === 0 ? true : (medicine.requiresPrescription || false)}
                    onAddToCart={() => setCartCount((prev) => prev + 1)}
                  />
                ))}
              </div>
              {!searchTerm && medicines.length > 6 && (
                <div className="text-center mt-4">
                  <p className="text-cyan-700 font-semibold">Many more medicines available...(100+)</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
      <CheckoutFooter />
    </div>
    </div>
  );
}

export default OnlinePharmacy;
