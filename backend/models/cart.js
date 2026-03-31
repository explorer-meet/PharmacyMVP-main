const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   items: [
      {
         medicineId: {
            type: String,
            default: null
         },
         medicine: {
            type: String,
            required: true
         },
         quantity: {
            type: Number,
            required: true,
            default: 1
         },
         price: {
            type: Number,
            required: true
         }
      }
   ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
