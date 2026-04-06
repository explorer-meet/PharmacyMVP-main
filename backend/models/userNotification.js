const mongoose = require("mongoose");

const categoryPrefsSchema = new mongoose.Schema(
  {
    orderUpdates:           { type: Boolean, default: true },
    prescriptionReminders:  { type: Boolean, default: true },
    offerAlerts:            { type: Boolean, default: false },
    healthReminders:        { type: Boolean, default: true },
  },
  { _id: false }
);

const userNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Master channel toggles (existing — backed by API)
    isEmailNotificationOn: { type: Boolean, default: true },
    isSmsNotificationOn:   { type: Boolean, default: true },
    // Per-category prefs per channel
    pushPrefs:  { type: categoryPrefsSchema, default: () => ({}) },
    emailPrefs: { type: categoryPrefsSchema, default: () => ({}) },
    smsPrefs:   { type: categoryPrefsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserNotification", userNotificationSchema);