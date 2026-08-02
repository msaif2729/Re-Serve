const mongoose = require('mongoose');
const User = require('./models/User');
const Donor = require('./models/Donor');
const Ngo = require('./models/Ngo');
const DonorForm = require('./models/DonorForm');
const Order = require('./models/Order');
const Receipt = require('./models/Receipt');
const Rating = require('./models/Rating');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reserve_db';

async function seedData() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    // Clean production database - dummy data disabled
    console.log('Database ready for real donor and NGO registrations.');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

if (require.main === module) {
  seedData().then(() => mongoose.connection.close());
}

module.exports = seedData;
