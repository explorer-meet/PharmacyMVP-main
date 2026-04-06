const mongoose = require('mongoose');

const ComplianceChecklistSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['Drug License', 'GST Return', 'Regulatory Audit', 'Fire Safety', 'Narcotics Register', 'Cold Chain Log', 'Other'],
      default: 'Other',
    },
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true, index: true },
    lastCompletedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Overdue'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    reminderDaysBefore: { type: Number, default: 7, min: 0 },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

ComplianceChecklistSchema.index({ storeId: 1, dueDate: 1, status: 1 });

module.exports = mongoose.model('ComplianceChecklist', ComplianceChecklistSchema);
