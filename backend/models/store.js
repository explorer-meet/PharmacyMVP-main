const mongoose = require('mongoose');

const ExistingStoreSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    countryCode: { type: String, default: '+91' },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
    licenceNumber: { type: String, required: true },
    gstNumber: { type: String, default: '' },
    city: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    licenceDocument: {
      fileName: { type: String },
      filePath: { type: String},
      mimeType: { type: String },
    },
    status: { type: String, required: true },
    reviewNotes: { type: String, default: '' },
    reviewedAt: { type: Date },
    storePhotoUrl: { type: String, default: '' },
    settings: {
      storeHours: {
        monday:    { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } },
        tuesday:   { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } },
        wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } },
        thursday:  { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } },
        friday:    { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } },
        saturday:  { open: { type: String, default: '09:00' }, close: { type: String, default: '21:00' }, closed: { type: Boolean, default: false } },
        sunday:    { open: { type: String, default: '10:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: true } },
      },
      deliveryRadiusKm: { type: Number, default: 10 },
      acceptedPayments: { type: [String], default: ['Cash', 'UPI', 'Card'] },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Store', ExistingStoreSchema);
