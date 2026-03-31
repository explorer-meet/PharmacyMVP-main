const mongoose = require("mongoose");

const userVaccinationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vaccinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VaccinationMaster",
      required: true,
    },
    status: {
      type: String,
      enum: ["vaccinated", "not_vaccinated"],
      default: "not_vaccinated",
    },
    vaccinationDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// One record per user per vaccine
userVaccinationSchema.index({ userId: 1, vaccinationId: 1 }, { unique: true });

module.exports = mongoose.model("UserVaccination", userVaccinationSchema);
