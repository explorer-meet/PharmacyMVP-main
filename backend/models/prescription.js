const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   fileName: {
      type: String,
      required: true
   },
   filePath: {
      type: String,
      required: true
   },
   uploadedAt: {
      type: Date,
      default: Date.now
   },
   status: {
      type: String,
      enum: ['approved', 'rejected', 'pending'],
      default: 'pending'
   }
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
