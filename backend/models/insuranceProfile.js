const mongoose = require("mongoose");

const insuranceProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    planName: {
      type: String,
      trim: true,
      default: "",
    },
    policyNumber: {
      type: String,
      required: true,
      trim: true,
    },
    groupNumber: {
      type: String,
      trim: true,
      default: "",
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
    },
    relationship: {
      type: String,
      enum: ["self", "spouse", "child", "parent", "other"],
      default: "self",
    },
    coveragePercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    maxCoverageAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    usedCoverageAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
      index: true,
    },
    policyDocument: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

insuranceProfileSchema.index({ userId: 1, isPrimary: 1 });

module.exports = mongoose.model("insuranceProfile", insuranceProfileSchema);
