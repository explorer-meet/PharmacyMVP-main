import React, { useState, useEffect, useRef } from 'react';
import { Pill, Package, ShoppingCart, FileText, CheckCircle, Upload, X, AlertCircle, Clock, BadgeCheck } from 'lucide-react';
import CartButton from './CartButton';
import axios from 'axios';
import { baseURL } from '../main';

const MedicineCard = ({ id, name, manufacturer, dosage, price, stock, type, requiresPrescription, onAddToCart }) => {

  const storageKey = `prescription_${name}`;

  const [showadded, setShowAdded] = useState(false);
  const [addcart, setAddCart] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  // null | 'pending' | 'approved'
  const [prescriptionStatus, setPrescriptionStatus] = useState(() => {
    return localStorage.getItem(storageKey) || null;
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleCartButtonClick = () => {
    if (requiresPrescription) {
      if (prescriptionStatus === 'approved') {
        handleaddtocart();
      } else if (prescriptionStatus === 'pending') {
        // do nothing — button is disabled
      } else {
        setShowPrescriptionModal(true);
      }
    } else {
      handleaddtocart();
    }
  };

  // After upload: mark as pending, do NOT add to cart yet
  const handlePrescriptionSubmit = () => {
    if (!prescriptionFile) return;
    localStorage.setItem(storageKey, 'pending');
    setPrescriptionStatus('pending');
    setShowPrescriptionModal(false);
    setPrescriptionFile(null);
  };

  // Demo helper — simulates pharmacy approval
  const handleSimulateApproval = () => {
    localStorage.setItem(storageKey, 'approved');
    setPrescriptionStatus('approved');
  };

  const handleFileChange = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setPrescriptionFile(file);
    }
  };

  const handleaddtocart = async () => {
    try {
      const response = await axios.post(`${baseURL}/updateorderedmedicines`, {
        name,
        price,
        id: userData?._id,
      });
      console.log(response);
  
      if (response.status === 200) {
        console.log(`${name} added to cart with ${id} quantity price is ${price}`);
        setShowAdded(true);

        setTimeout(() => {
          setShowAdded(false);
        }, 1000);
  
        // Fetch updated userData
        const token = localStorage.getItem('medVisionToken');
        const updatedResponse = await axios.get(`${baseURL}/fetchdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const updatedUserData = updatedResponse.data.userData;
  
        // Update state to trigger re-render
        setUserData(updatedUserData);
  
        // Update localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 w-full">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Pill className="w-5 h-5 text-cyan-600" />
          <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        </div>
        <p className="text-sm text-gray-600">{manufacturer}</p>
        <div className="flex items-center gap-2 mt-2">
          <Package className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{dosage} • {type}</span>
        </div>
        <div className="mt-2">
          {requiresPrescription ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <FileText className="w-3 h-3" />
              Prescription Required
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3 h-3" />
              No Prescription Needed
            </span>
          )}
        </div> 
        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-cyan-700">Rs {price}/-</div>
          <div className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stock > 0 ? `In Stock (${stock} left)` : 'Out of Stock'}
          </div>
        </div>
        {/* Prescription status banner */}
        {requiresPrescription && prescriptionStatus === 'pending' && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
              <p className="text-xs font-semibold text-amber-800">Prescription Under Review</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed pl-6">
              Your prescription has been submitted. Please wait for pharmacy approval before adding to cart.
            </p>
            {/* Demo-only simulate button */}
            <button
              onClick={handleSimulateApproval}
              className="mt-1 ml-6 text-xs text-amber-600 underline underline-offset-2 hover:text-amber-800 transition-colors w-fit"
            >
              Simulate Approval (Demo)
            </button>
          </div>
        )}

        {requiresPrescription && prescriptionStatus === 'approved' && (
          <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-800">Prescription Approved — You can now add to cart</p>
          </div>
        )}

        <div>
          <button
            onClick={userData?._id ? handleCartButtonClick : undefined}
            disabled={!userData?._id || stock === 0 || (requiresPrescription && prescriptionStatus === 'pending')}
            className={`mt-3 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium
      transform transition-all duration-200
      ${
        requiresPrescription && prescriptionStatus === 'pending'
          ? 'bg-amber-100 text-amber-600 cursor-not-allowed'
          : userData?._id && stock > 0
            ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 hover:scale-[1.02]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
          >
            {showadded ? (
              <div className="flex items-center gap-2 text-green-500">
                <span>Added to Cart!</span>
              </div>
            ) : requiresPrescription && prescriptionStatus === 'pending' ? (
              <>
                <Clock className="w-4 h-4" />
                Awaiting Prescription Approval
              </>
            ) : requiresPrescription && !prescriptionStatus ? (
              <>
                <FileText className="w-4 h-4" />
                Upload Prescription to Buy
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {userData?._id ? "Add to Cart" : "Log in to Add to Cart"}
              </>
            )}
          </button>

          {userData?._id && addcart && (
            <CartButton id={id} name={name} price={price} />
          )}
        </div>

        {addcart && <CartButton id={id} name={name} price={price} />}
      </div>

      {/* Prescription Upload Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <h2 className="text-white font-semibold text-base">Prescription Required</h2>
              </div>
              <button
                onClick={() => { setShowPrescriptionModal(false); setPrescriptionFile(null); }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Notice */}
              <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  <span className="font-semibold">{name}</span> is a prescription medicine. Please upload a valid doctor's prescription to proceed.
                </p>
              </div>

              {/* Upload area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  dragOver ? 'border-amber-400 bg-amber-50' :
                  prescriptionFile ? 'border-emerald-400 bg-emerald-50' :
                  'border-gray-200 hover:border-amber-300 hover:bg-amber-50/40'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
                {prescriptionFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-700">{prescriptionFile.name}</p>
                    <p className="text-xs text-emerald-600">Tap to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-10 h-10 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">Click or drag & drop your prescription</p>
                    <p className="text-xs text-gray-400">JPG, PNG or PDF accepted</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setShowPrescriptionModal(false); setPrescriptionFile(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrescriptionSubmit}
                  disabled={!prescriptionFile}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    prescriptionFile
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Confirm & Submit Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineCard;