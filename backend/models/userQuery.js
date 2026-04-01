const mongoose = require("mongoose");

const userQuerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "in_review", "resolved"],
      default: "open",
    },
    answer: {
      type: String,
      trim: true,
      default: "",
    },
    answeredByStoreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserQuery", userQuerySchema);
