const mongoose = require("mongoose");

const bulkDiscountSchema = new mongoose.Schema(
  {
    minQuantity: { type: Number, default: 0 },
    buyQuantity: { type: Number, default: 0 },
    getQuantity: { type: Number, default: 0 },
  },
  { _id: false }
);

const promotionalCampaignSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaignType: {
      type: String,
      enum: ["Offer", "Coupon", "Bulk Discount"],
      default: "Offer",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    couponCode: { type: String, trim: true, uppercase: true, default: "" },
    discountType: {
      type: String,
      enum: ["Percentage", "Flat"],
      default: "Percentage",
    },
    discountValue: { type: Number, default: 0, min: 0 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, default: 0, min: 0 },
    autoApply: { type: Boolean, default: false },
    usageLimit: { type: Number, default: 0, min: 0 },
    usedCount: { type: Number, default: 0, min: 0 },
    validFrom: { type: Date, default: Date.now },
    validTill: { type: Date },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Scheduled", "Expired"],
      default: "Active",
    },
    targetScope: {
      type: String,
      enum: ["All", "Category", "Medicine"],
      default: "All",
    },
    targetValue: { type: String, default: "", trim: true },
    bulkDiscount: { type: bulkDiscountSchema, default: () => ({}) },
  },
  { timestamps: true }
);

promotionalCampaignSchema.index(
  { storeId: 1, couponCode: 1 },
  { unique: true, partialFilterExpression: { couponCode: { $type: "string", $ne: "" } } }
);

module.exports = mongoose.model("PromotionalCampaign", promotionalCampaignSchema);
