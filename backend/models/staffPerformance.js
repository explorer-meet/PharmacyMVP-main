const mongoose = require('mongoose');

const StaffPerformanceSchema = new mongoose.Schema(
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
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    ordersProcessed: { type: Number, default: 0, min: 0 },
    prescriptionsReviewed: { type: Number, default: 0, min: 0 },
    avgFulfillmentMinutes: { type: Number, default: 0, min: 0 },
    attendanceScore: { type: Number, default: 0, min: 0, max: 100 },
    customerRating: { type: Number, default: 0, min: 0, max: 5 },
    efficiencyScore: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

StaffPerformanceSchema.index({ storeId: 1, staffId: 1, periodStart: 1, periodEnd: 1 }, { unique: true });

module.exports = mongoose.model('StaffPerformance', StaffPerformanceSchema);
