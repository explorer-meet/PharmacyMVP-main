const mongoose = require('mongoose');

const StaffTrainingSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoreStaff',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    moduleType: {
      type: String,
      enum: ['Certification', 'Product Knowledge'],
      required: true,
    },
    score: { type: Number, default: 0, min: 0 },
    maxScore: { type: Number, default: 100, min: 1 },
    passed: { type: Boolean, default: false },
    completedAt: { type: Date, default: Date.now },
    validTill: { type: Date, default: null },
    certificateId: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

StaffTrainingSchema.index({ storeId: 1, staffId: 1, completedAt: -1 });

module.exports = mongoose.model('StaffTraining', StaffTrainingSchema);
