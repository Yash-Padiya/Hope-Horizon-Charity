const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'resolved','rejected'], default: 'pending' },
});

const Support = mongoose.model('Support', supportSchema);
module.exports = Support;