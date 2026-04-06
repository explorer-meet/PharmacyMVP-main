const mongoose = require('mongoose');

const supplierPaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['UPI', 'Bank Transfer', 'Cash', 'Card', 'Cheque', 'Other'], default: 'Other' },
    reference: { type: String, default: '', trim: true },
    paidAt: { type: Date, default: Date.now },
    note: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const SupplierSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: '', trim: true },
    mobile: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true, lowercase: true },
    gstNumber: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    paymentTermsDays: { type: Number, default: 30, min: 0 },
    creditLimit: { type: Number, default: 0, min: 0 },
    outstandingAmount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    notes: { type: String, default: '', trim: true },
    paymentHistory: { type: [supplierPaymentSchema], default: [] },
  },
  { timestamps: true }
);

SupplierSchema.index({ storeId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
