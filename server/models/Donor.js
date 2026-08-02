const mongoose = require('mongoose');

// DONOR SCHEMA (Donor Profile & FSSAI Verification)
const DonorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String, required: true },
  fssai_license: { type: String, required: true },
  fssai_license_auto_verify: { type: Boolean, default: false },
  address_map_link: { type: String },
  operational_hours: { type: String },
  health_and_safety_cert: { type: String },
  food_preference: { type: String },
  average_rating: { type: Number, default: 0 },
  total_ratings: { type: Number, default: 0 },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  created_at: { type: Date, default: Date.now }
});

DonorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Donor', DonorSchema);
