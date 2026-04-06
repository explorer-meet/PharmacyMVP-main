import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, FileText, Image } from 'lucide-react';
import { baseURL } from '../main';

const PrescriptionUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
      } else {
        toast.error('Only PDF and image files are allowed');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a PDF or image file (JPG, PNG, GIF)');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const token = localStorage.getItem('medVisionToken');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `${baseURL}/prescriptions/auto-fill/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Prescription uploaded successfully!');
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(response.data.prescriptionUpload);
      }
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload prescription');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upload Prescription</h2>
            <p className="mt-1 text-sm text-slate-600">Upload your prescription to auto-fill medicines</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? 'border-cyan-500 bg-cyan-50'
                : 'border-slate-300 bg-slate-50'
            }`}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              className="hidden"
              id="prescription-input"
              disabled={uploading}
            />
            <label
              htmlFor="prescription-input"
              className="flex cursor-pointer flex-col items-center"
            >
              <div className="mb-3 rounded-full bg-cyan-100 p-3">
                <Upload className="text-cyan-600" size={24} />
              </div>
              <p className="font-semibold text-slate-900">
                {file ? file.name : 'Drag and drop your prescription'}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                or click to select (PDF, JPG, PNG, GIF)
              </p>
            </label>
          </div>

          {/* File Info */}
          {file && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                {file.type === 'application/pdf' ? (
                  <FileText className="text-red-600" size={20} />
                ) : (
                  <Image className="text-blue-600" size={20} />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-600">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Info boxes */}
          <div className="space-y-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
            <p>✓ Works with PDF prescriptions and photos</p>
            <p>✓ Supports image formats: JPG, PNG, GIF</p>
            <p>✓ File size limit: 10 MB</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 font-medium text-white transition hover:shadow-lg disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionUploadModal;
