const mongoose = require("mongoose");

const vaccinationMasterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    recommendedFor: { type: String, default: "All Ages" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VaccinationMaster", vaccinationMasterSchema);
