const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
   // Core User Identity
   name: {
      type: String,
      require: true,
      unique: true,
   },
   salutation: {
      type: String,
   },
   firstName: {
      type: String,
   },
   middleName: {
      type: String,
   },
   lastName: {
      type: String,
   },

   // Contact Information
   email: {
      type: String,
      require: true,
      unique: true,
   },
   mobile: {
      type: String,
      require: true,
   },
   countryCode: {
      type: String,
   },
   address: {
      type: String,
      require: true,
   },
   city: {
      type: String,
   },
   state: {
      type: String,
   },
   pincode: {
      type: String,
   },

   // Authentication
   password: {
      type: String,
      require: true
   },
   hash_password: {
      type: String,
      require: true
   },

   // Health/Biometric Information
   dob: {
      type: String,
      require: true,
   },
   sex: {
      type: String,
      require: true,
   },
   weight: {
      type: Number,
      require: true,
   },
   height: {
      type: Number,
      require: true,
   },
   bloodgroup: {
      type: String,
      require: true,
   },

   // Pharmacy/Store Owner Information (if applicable)
   storeName: {
      type: String,
   },
   ownerName: {
      type: String,
   },
   licenceNumber: {
      type: String,
   },
   gstNumber: {
      type: String,
   },

   // Patient Wishlist
   wishlist: [
      {
         medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pharmacy',
            required: true,
         },
         addedAt: {
            type: Date,
            default: Date.now,
         },
      },
   ],
}, { timestamps: true });
//For get fullName from when we get data from database

// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

userSchema.method({
   async authenticate(password) {
      return bcrypt.compare(password, this.password);
   },
});
module.exports = mongoose.model("User", userSchema);