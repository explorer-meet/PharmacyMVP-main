const mongoose = require('mongoose');

const intakeLogSchema = new mongoose.Schema(
  {
    takenAt: { type: Date, default: Date.now },
    dose: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const medicineTrackerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },
    quantityOnHand: { type: Number, default: 0 },
    dosagePerDay: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    lastTakenAt: { type: Date, default: null },
    intakeLogs: { type: [intakeLogSchema], default: [] },
  },
  { timestamps: true }
);

medicineTrackerSchema.index({ userId: 1, medicineName: 1, isActive: 1 });

module.exports = mongoose.model('MedicineTracker', medicineTrackerSchema);
