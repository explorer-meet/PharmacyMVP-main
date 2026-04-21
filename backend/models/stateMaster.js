const mongoose = require('mongoose');

const stateMasterSchema = new mongoose.Schema(
  {
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CountryMaster',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

stateMasterSchema.index({ countryId: 1, normalizedName: 1 }, { unique: true });

module.exports = mongoose.model('StateMaster', stateMasterSchema);
