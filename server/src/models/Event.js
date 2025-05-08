const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  Event_name: { type: String, required: true },        // Event name, not null
  description: { type: String, required: true },        // Description, not null
  Target_fund: { type: Number, required: true },        // Target fund, not null
  Current_fund : { type: Number, required: true },        // Current fund, not null
  Event_date: { type: Date, required: true },           // Event date, not null
  coverPhotoHighQuality: { type: String, required: true }, // High-quality cover photo, not null
  coverPhotoLowQuality: { type: String, required: true },  // Low-quality cover photo, not null
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
