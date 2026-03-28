const mongoose = require('mongoose');

const storeApprovalRequestSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    countryCode: { type: String, default: '+91' },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    licenceNumber: { type: String, required: true },
    gstNumber: { type: String, default: '' },
    city: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    licenceDocument: {
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
      mimeType: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewNotes: { type: String, default: '' },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('StoreApprovalRequest', storeApprovalRequestSchema);
