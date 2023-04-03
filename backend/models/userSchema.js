const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  contactNumber: { type: String },
  pimg: { type: String },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("user", userSchema);
