const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // Reference to Event model
  amount: { type: Number, required: true }, // Amount donated
  donation_date: { type: Date, default: Date.now }, // Date of donation (default to current date)
  message: { type: String }, // Optional message from the donor
  status: { type: String, default: "pending" },
  // Optional message from the donor
  mihpayid: { type: String },
  mode: { type: String },
  bank_ref_num: { type: String },
  bankcode: { type: String },
  upi_transaction_id: { type: String },
  wallet: { type: String },
  cardnum: { type: String },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
