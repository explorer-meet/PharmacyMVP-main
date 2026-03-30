import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PrescriptionDialog = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedFile(file);
    } else {
      toast.error('Please select a valid image or PDF file.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const token = localStorage.getItem('medVisionToken');
    if (!token) {
      toast.error('Please log in to upload a prescription.');
      return;
    }

    setLoading(true);

    // Mock API call - simulate processing time
    setTimeout(() => {
      toast.success('You will be notified once your Prescription is Approved');
      setSelectedFile(null); // Reset the selected file
      onClose();
      setLoading(false);
    }, 2000); // 2 second delay to simulate upload
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 py-5 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">Prescription Upload</p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">Upload Your Prescription</h2>
            <p className="mt-2 max-w-xl text-sm text-blue-100 md:text-base">Submit a clear prescription file and our pharmacy team will verify it before processing your order.</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
            disabled={loading}
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid flex-1 gap-0 overflow-y-auto md:grid-cols-[0.95fr_1.25fr]">
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-sky-100">
            <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-sky-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
                <svg className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Before you upload</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Upload a clear image or PDF of your prescription.</li>
                <li>Make sure medicine name, dosage, and doctor signature are visible.</li>
                <li>Accepted formats: JPG, PNG, and PDF up to 5MB.</li>
                <li>You will receive an update after pharmacist approval.</li>
              </ul>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-5 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-900">Trusted pharmacy review</h4>
                  <p className="text-sm text-emerald-700">Licensed pharmacists verify each upload before it is used for ordering.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select Prescription File
            </label>

            <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-sky-300 bg-gradient-to-br from-sky-50 to-white transition hover:border-sky-400 hover:bg-sky-50/80">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              <div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center md:p-10">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 shadow-sm">
                  <svg className="h-8 w-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-slate-800">Click to upload or drag and drop</p>
                <p className="mt-2 text-sm text-slate-500">Choose a clear prescription image or PDF document.</p>
                <div className="mt-5 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  PNG, JPG, PDF up to 5MB
                </div>
              </div>
            </div>

            {selectedFile ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-emerald-900">File selected successfully</p>
                    <p className="mt-1 truncate text-sm text-emerald-700">{selectedFile.name}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                No file selected yet. Choose a prescription to continue.
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-600 transition hover:bg-slate-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-sky-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || !selectedFile}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Submit Prescription'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDialog;