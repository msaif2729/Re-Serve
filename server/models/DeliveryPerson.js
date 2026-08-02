const mongoose = require('mongoose');

// DELIVERY_PERSON SCHEMA (Optional Delivery Tracking)
const DeliveryPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_no: { type: String, required: true },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }
});

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);
