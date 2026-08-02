const mongoose = require('mongoose');

// NGO SCHEMA (NGO Profile & Registration Verification)
const NgoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  contact_person: { type: String, required: true },
  reg_no: { type: String, required: true },
  fcra_reg_no: { type: String },
  address_map_link: { type: String },
  operating_hours: { type: String },
  charity_license_verification: { type: Boolean, default: false },
  food_preference: { type: String },
  verified: { type: Boolean, default: false },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  created_at: { type: Date, default: Date.now }
});

NgoSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Ngo', NgoSchema);
