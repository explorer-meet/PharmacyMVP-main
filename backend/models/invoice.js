const mongoose = require('mongoose');

const invoiceLineItemSchema = new mongoose.Schema(
  {
    medicineId: { type: String, default: '' },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, default: 0, min: 0 },
    gstRate: { type: Number, default: 0, min: 0 },
    gstAmount: { type: Number, default: 0, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoicePaymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ['COD', 'UPI', 'Card', 'Net Banking', 'Wallet', 'Cash', 'Other'],
      default: 'Other',
    },
    reference: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' },
    paidAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    orderId: { type: String, default: '', index: true },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, default: 'Walk-in Customer', trim: true },
    customerGstNumber: { type: String, default: '', trim: true },
    lineItems: { type: [invoiceLineItemSchema], default: [] },
    subtotal: { type: Number, required: true, min: 0 },
    totalGst: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Partial', 'Paid'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'Card', 'Net Banking', 'Wallet', 'Cash', 'Other'],
      default: 'Other',
    },
    paidAmount: { type: Number, default: 0, min: 0 },
    balanceAmount: { type: Number, default: 0, min: 0 },
    payments: { type: [invoicePaymentSchema], default: [] },
  },
  { timestamps: true }
);

InvoiceSchema.index({ storeId: 1, createdAt: -1 });
InvoiceSchema.index({ storeId: 1, paymentStatus: 1 });

module.exports = mongoose.model('Invoice', InvoiceSchema);
