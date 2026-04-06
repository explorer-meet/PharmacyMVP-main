const mongoose = require('mongoose');

const StaffAttendanceSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
      index: true,
    },
    shiftType: {
      type: String,
      enum: ['Morning', 'Evening', 'Night', 'Custom'],
      default: 'Morning',
    },
    shiftStart: { type: Date, required: true },
    shiftEnd: { type: Date, required: true },
    checkInAt: { type: Date, default: null },
    checkOutAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Half Day', 'Leave'],
      default: 'Present',
    },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

StaffAttendanceSchema.index({ storeId: 1, staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StaffAttendance', StaffAttendanceSchema);
