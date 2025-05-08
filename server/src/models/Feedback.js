const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ratings: { type: Number, required: true },
  description: { type: String, required: true },
  dateofcreation: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;