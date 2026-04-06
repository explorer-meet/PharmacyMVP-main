import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Plus, Check, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { baseURL } from '../main';

const ExtractedMedicinesModal = ({
  isOpen,
  onClose,
  prescriptionId,
  onAddToCart,
}) => {
  const [medicineList, setMedicineList] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [manualMedicines, setManualMedicines] = useState('');

  const loadPrescriptionDetails = useCallback(async () => {
    const token = localStorage.getItem('medVisionToken');
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/prescriptions/auto-fill`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const prescription = (response.data.prescriptions || []).find(
        (p) => p._id === prescriptionId
      );

      if (prescription?.extractedMedicines?.length > 0) {
        setMedicineList(prescription.extractedMedicines);
        setSelectedMedicines(
          prescription.extractedMedicines
            .filter((m) => m.isMatched)
            .map((m) => m.medicineId?._id || m.medicineId)
            .filter(Boolean)
        );
      } else {
        setMedicineList([]);
        setSelectedMedicines([]);
      }
    } catch (error) {
      console.error('Error loading prescription:', error);
    } finally {
      setLoading(false);
    }
  }, [prescriptionId]);

  useEffect(() => {
    if (isOpen && prescriptionId) {
      loadPrescriptionDetails();
    }
  }, [isOpen, prescriptionId, loadPrescriptionDetails]);

  const handleExtractFromManual = async () => {
    if (!manualMedicines.trim()) {
      toast.error('Please enter medicine names');
      return;
    }

    const token = localStorage.getItem('medVisionToken');
    if (!token) return;

    // Parse manually entered medicines
    const medicines = manualMedicines.split('\n').filter((line) => line.trim());
    const parsedMedicines = medicines.map((med) => {
      const parts = med.split(',').map((p) => p.trim());
      return {
        name: parts[0] || '',
        strength: parts[1] || '',
        quantity: parseInt(parts[2]) || 1,
        unit: parts[3] || 'tablets',
      };
    });

    try {
      setExtracting(true);
      const response = await axios.post(
        `${baseURL}/prescriptions/auto-fill/${prescriptionId}/extract`,
        { manualMedicines: parsedMedicines },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedicineList(response.data.prescriptionUpload.extractedMedicines || []);
      setManualMedicines('');
      setSelectedMedicines(
        response.data.prescriptionUpload.extractedMedicines
          .filter((m) => m.isMatched)
          .map((m) => m.medicineId?._id || m.medicineId)
      );
      toast.success('Medicines extracted from prescription!');
    } catch (error) {
      console.error('Extract error:', error);
      toast.error(error.response?.data?.message || 'Failed to extract medicines');
    } finally {
      setExtracting(false);
    }
  };

  const toggleMedicine = (medicineId) => {
    if (selectedMedicines.includes(medicineId)) {
      setSelectedMedicines(selectedMedicines.filter((id) => id !== medicineId));
    } else {
      setSelectedMedicines([...selectedMedicines, medicineId]);
    }
  };

  const handleAddToCart = async () => {
    if (selectedMedicines.length === 0) {
      toast.error('Please select at least one medicine');
      return;
    }

    const token = localStorage.getItem('medVisionToken');
    if (!token) return;

    try {
      setExtracting(true);
      const response = await axios.post(
        `${baseURL}/prescriptions/auto-fill/${prescriptionId}/add-to-cart`,
        { selectedMedicineIds: selectedMedicines },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      if (onAddToCart) {
        onAddToCart(selectedMedicines.length);
      }
      onClose();
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add medicines to cart');
    } finally {
      setExtracting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Select Medicines</h2>
            <p className="mt-1 text-sm text-slate-600">Choose which medicines to add to your cart</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Manual Entry Section */}
        {medicineList.length === 0 && (
          <div className="mb-6 space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex gap-2">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900">No medicines extracted yet</p>
                <p className="text-sm text-blue-700 mt-1">
                  Please enter the medicines from your prescription below
                </p>
              </div>
            </div>
            <textarea
              value={manualMedicines}
              onChange={(e) => setManualMedicines(e.target.value)}
              placeholder="Enter medicines one per line&#10;Format: Medicine Name, Strength, Quantity, Unit&#10;Example: Paracetamol, 500mg, 10, tablets"
              className="w-full rounded-lg border border-blue-300 bg-white p-3 text-sm placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              rows={4}
            />
            <button
              onClick={handleExtractFromManual}
              disabled={!manualMedicines.trim() || extracting}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 font-medium text-white transition hover:shadow-lg disabled:opacity-50"
            >
              {extracting ? 'Processing...' : 'Extract Medicines'}
            </button>
          </div>
        )}

        {/* Medicines List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
          </div>
        ) : medicineList.length > 0 ? (
          <div className="space-y-2 mb-6 max-h-[50vh] overflow-y-auto">
            {medicineList.map((medicine, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selectedMedicines.includes(
                    medicine.medicineId?._id || medicine.medicineId
                  )}
                  onChange={() =>
                    toggleMedicine(
                      medicine.medicineId?._id || medicine.medicineId
                    )
                  }
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {medicine.name}
                    </h3>
                    {medicine.strength && (
                      <span className="text-sm text-slate-600">
                        ({medicine.strength})
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                    {medicine.quantity && (
                      <span className="rounded bg-slate-100 px-2 py-1">
                        Qty: {medicine.quantity} {medicine.unit}
                      </span>
                    )}
                    {medicine.frequency && (
                      <span className="rounded bg-slate-100 px-2 py-1">
                        {medicine.frequency}
                      </span>
                    )}
                    {medicine.duration && (
                      <span className="rounded bg-slate-100 px-2 py-1">
                        {medicine.duration}
                      </span>
                    )}
                  </div>

                  {/* Match Status */}
                  {medicine.medicineId && medicine.isMatched ? (
                    <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                      <Check size={14} />
                      Matched with store inventory
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-amber-600">
                      ⚠ Not found in store - Please search manually
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-600">
            <p>No medicines to display</p>
          </div>
        )}

        {/* Footer */}
        {medicineList.length > 0 && (
          <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {selectedMedicines.length} of {medicineList.length} selected
              </p>
              <button
                onClick={() =>
                  setSelectedMedicines(
                    selectedMedicines.length === medicineList.length
                      ? []
                      : medicineList.map(
                          (m) => m.medicineId?._id || m.medicineId
                        )
                  )
                }
                className="text-sm font-medium text-cyan-600 hover:text-cyan-700"
              >
                {selectedMedicines.length === medicineList.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={extracting}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                disabled={selectedMedicines.length === 0 || extracting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 font-medium text-white transition hover:shadow-lg disabled:opacity-50"
              >
                <Plus size={18} />
                {extracting ? 'Adding...' : `Add to Cart (${selectedMedicines.length})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ExtractedMedicinesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  prescriptionId: PropTypes.string,
  onAddToCart: PropTypes.func,
};

export default ExtractedMedicinesModal;
