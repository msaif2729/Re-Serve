const mongoose = require('mongoose');

// DONOR_FORM SCHEMA (Surplus Food Listings)
const DonorFormSchema = new mongoose.Schema({
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  food_name: { type: String, required: true },
  food_type: { type: String, enum: ['Cooked Meals', 'Bakery', 'Raw Ingredients', 'Packaged'], required: true },
  food_image: { type: String },
  serves: { type: Number, required: true }, // Quantity in servings / kg
  storage: { type: String, enum: ['Refrigerated', 'Room Temperature', 'Frozen', 'Cold Storage'] },
  preparation_date_time: { type: Date, required: true },
  expiry_date_time: { type: Date, required: true },
  preferred_pickup_time: { type: String, required: true },
  status: { type: String, enum: ['available', 'claimed', 'completed', 'cancelled'], default: 'available' },
  ai_quality_score: { type: Number, default: 94 },
  ai_status: { type: String, enum: ['PASS', 'FAIL', 'REVIEW_REQUIRED'], default: 'PASS' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonorForm', DonorFormSchema);
