const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Username, not null
  password: { type: String, required: true }, // Password, not null
  email: { type: String, required: true, unique: true }, // Email, unique, not null
  user_type: {
    type: String,
    required: true,
    enum: ["donor", "admin"],
    default: "donor",
  }, // User type (donor or admin), not null
  address: { type: String, required: true }, // Address, not null
  mobile_no: { type: Number, required: true }, // Mobile number, not null
  aadhar_no: { type: Number, required: true }, // Aadhar number, not null
  pan_no: { type: String, required: true }, // PAN number, not null
  donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
  createdAt: { type: Date, default: Date.now }, 
});

// Create the User model using the schema
const User = mongoose.model("User", userSchema);
module.exports = User;
