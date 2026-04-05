const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    storeName:{ type: String, required: true, trim: true },
    name:     { type: String, required: true },
    role:     { type: String, default: 'Patient' },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    comment:  { type: String, required: true, maxlength: 600 },
    approved: { type: Boolean, default: true },
}, { timestamps: true });

reviewSchema.index(
    { userId: 1, storeId: 1 },
    { unique: true, partialFilterExpression: { storeId: { $exists: true } } },
);
reviewSchema.index({ storeId: 1, approved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
