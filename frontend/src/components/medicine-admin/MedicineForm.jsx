import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { baseURL } from '../../main';

const MEDICINE_TYPES = [
  'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops'
];

export function MedicineForm() {
  const [formData, setFormData] = useState({
    name: '',
    providerId: '',
    manufacturer: '',
    dosage: '',
    type: '',
    price: '',
    stock: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const loadProviders = async () => {
    const token = localStorage.getItem('medVisionToken');
    if (!token) return;

    try {
      setProvidersLoading(true);
      const response = await axios.get(`${baseURL}/providers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProviders(response.data?.providers || []);
    } catch {
      setProviders([]);
    } finally {
      setProvidersLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const selectedProvider = providers.find((provider) => provider._id === formData.providerId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'providerId') {
      const matched = providers.find((provider) => provider._id === value);
      setFormData((prev) => ({
        ...prev,
        providerId: value,
        manufacturer: matched?.name || '',
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('medVisionToken');
      const response = await axios.post(`${baseURL}/addmedicine`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);

      if (response.status === 200) {
        setMessage({ text: 'Medicine added successfully!', type: 'success' });
        setFormData({
          name: '',
          providerId: '',
          manufacturer: '',
          dosage: '',
          type: '',
          price: '',
          stock: ''
        });
      }
    } catch {
      setMessage({ text: 'Failed to add medicine', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          {providers.length > 0 ? (
            <select
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder={providersLoading ? 'Loading providers...' : 'No providers found. Enter manually.'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          )}
          {selectedProvider && (
            <div className="mt-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900">
              <p>{[selectedProvider.supportEmail, selectedProvider.supportPhone].filter(Boolean).join(' | ') || 'No support contact details'}</p>
              <p>{[selectedProvider.addressLine1, selectedProvider.city, selectedProvider.state, selectedProvider.country, selectedProvider.pincode].filter(Boolean).join(', ') || 'No address available'}</p>
            </div>
          )}
          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-gray-500">Providers are managed from Admin Dashboard.</p>
            <button
              type="button"
              onClick={loadProviders}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g., 500mg"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            {MEDICINE_TYPES.map(type => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? (
          "Adding Medicine..."
        ) : (
          <span className="flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" /> Add Medicine
          </span>
        )}
      </button>
    </form>
  );
}