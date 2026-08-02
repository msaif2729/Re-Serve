const mongoose = require('mongoose');

// ORDERS SCHEMA (Order Claims with OTP verification)
const OrderSchema = new mongoose.Schema({
  donor_form_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DonorForm', required: true },
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
  serves: { type: Number, required: true },
  OTP: { type: Number, required: true }, // 4 to 6 digit numeric OTP generated on claim
  status: { type: String, enum: ['pending', 'out_for_pickup', 'delivered', 'cancelled'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
