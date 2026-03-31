const mongoose = require("mongoose");

const vaccinationMasterSchema = new mongoose.Schema({
  vaccineId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ageGroup: {
    type: String,
  },
  doseSchedule: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VaccinationMaster", vaccinationMasterSchema);
