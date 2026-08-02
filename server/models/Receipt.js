const mongoose = require('mongoose');

// RECEIPTS SCHEMA (Contribution Receipts & PDF Certificates)
const ReceiptSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo', required: true },
  receipt_url: { type: String },
  issued_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receipt', ReceiptSchema);
