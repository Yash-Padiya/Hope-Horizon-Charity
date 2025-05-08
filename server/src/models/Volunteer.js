const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  leaveDate: { type: Date },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  mobile_no: { type: String, required: true },
  aadhar_no: { type: String, required: true, unique: true }
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
module.exports = Volunteer;