const mongoose = require('mongoose');

const countryMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isoCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    dialCode: {
      type: String,
      required: true,
      trim: true,
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

countryMasterSchema.index({ isoCode: 1 }, { unique: true });
countryMasterSchema.index({ dialCode: 1 });

module.exports = mongoose.model('CountryMaster', countryMasterSchema);
