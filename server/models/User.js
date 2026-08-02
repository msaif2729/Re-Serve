const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo', 'admin'], required: true },
  phone_no: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
