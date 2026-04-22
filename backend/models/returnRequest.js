const mongoose = require("mongoose");

const returnEventSchema = new mongoose.Schema(
  {
    actor: { type: String, required: true }, // 'user' | 'store' | 'admin' | 'system'
    actorId: { type: mongoose.Schema.Types.ObjectId, default: null },
    action: { type: String, required: true },
    note: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const returnRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    orderRefId: { type: String, required: true }, // human-readable e.g. "ORD-1234"
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    // items selected for return
    items: [
      {
        itemId: { type: String, default: "" },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        _id: false,
      },
    ],
    reason: {
      type: String,
      enum: ["wrong_item", "damaged_pack", "delayed_delivery", "other"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    evidenceUrls: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: [
        "open",
        "evidence_requested",
        "evidence_submitted",
        "store_review",
        "admin_review",
        "approved",
        "rejected",
        "refunded",
        "closed",
      ],
      default: "open",
      index: true,
    },
    assignedToRole: {
      type: String,
      enum: ["store", "admin"],
      default: "store",
    },
    refundMode: {
      type: String,
      enum: ["original_payment", "wallet_credit", ""],
      default: "",
    },
    refundAmount: { type: Number, default: 0 },
    rejectionReason: { type: String, default: "" },
    storeNote: { type: String, default: "" },
    adminNote: { type: String, default: "" },
    // SLA tracking (timestamps, null = not yet reached)
    slaFirstResponseDeadline: { type: Date, default: null },
    slaDecisionDeadline: { type: Date, default: null },
    slaFirstResponseAt: { type: Date, default: null },
    slaDecisionAt: { type: Date, default: null },
    escalatedAt: { type: Date, default: null },
    timeline: [returnEventSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("ReturnRequest", returnRequestSchema);
