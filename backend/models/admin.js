const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    //   require: true,
    //   unique: true,
  },
  email: {
    type: String,
    //   require: true,
    //   unique: true,
  },
  password: {
    type: String,
    //  require: true
  },
  doctors: {
    type: Number,
  },
},{ collection: "admin" });




module.exports = mongoose.model("Admin", adminSchema);