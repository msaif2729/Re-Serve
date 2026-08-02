const mongoose = require('mongoose');

// RATING SCHEMA (Post-Delivery Reviews & Feedback)
const RatingSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', RatingSchema);
