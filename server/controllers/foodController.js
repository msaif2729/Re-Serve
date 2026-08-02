const DonorForm = require('../models/DonorForm');
const Donor = require('../models/Donor');
const { calculateDistance } = require('../utils/distance');

// Create surplus food listing
const createFoodListing = async (req, res) => {
  try {
    const {
      food_name,
      food_type,
      serves,
      storage,
      preparation_date_time,
      expiry_date_time,
      preferred_pickup_time,
      food_image,
      ai_quality_score,
      ai_status
    } = req.body;

    if (!food_name || !food_type || !serves || !expiry_date_time || !preferred_pickup_time) {
      return res.status(400).json({ message: 'Missing required fields for food donation' });
    }

    // Reject spoiled food listings if AI flagged FAIL
    if (ai_status === 'FAIL' || (ai_quality_score && ai_quality_score < 70)) {
      return res.status(400).json({
        message: 'Food listing rejected: AI Freshness Inspection flagged spoilage hazard risk.'
      });
    }

    // Find donor associated with this user
    let donor = await Donor.findOne({ userId: req.user.userId });
    if (!donor) {
      donor = await Donor.findOne({ email: req.user.email });
    }

    if (!donor) {
      return res.status(400).json({ message: 'Donor profile required to post food' });
    }

    const donorForm = new DonorForm({
      donor_id: donor._id,
      food_name,
      food_type,
      serves: Number(serves),
      storage: storage || 'Room Temperature',
      preparation_date_time: preparation_date_time ? new Date(preparation_date_time) : new Date(),
      expiry_date_time: new Date(expiry_date_time),
      preferred_pickup_time,
      food_image: food_image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      status: 'available',
      ai_quality_score: ai_quality_score || 95,
      ai_status: ai_status || 'PASS'
    });

    await donorForm.save();

    // Broadcast Socket.io event if server socket attached
    if (req.io) {
      req.io.emit('food:posted', { food: donorForm, donor });
    }

    res.status(201).json({
      message: 'Surplus food listing created successfully',
      food: donorForm
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Failed to create food listing: ' + error.message });
  }
};

// Get all food listings with filter, search, & distance calculation
const getFoodListings = async (req, res) => {
  try {
    const { category, storage, status, search, lat, lng, maxDistance } = req.query;

    const now = new Date();

    // Automatically mark past expiry available listings as cancelled/expired
    await DonorForm.updateMany(
      { status: 'available', expiry_date_time: { $lt: now } },
      { $set: { status: 'cancelled' } }
    );

    let query = {};
    if (status) {
      query.status = status;
    } else {
      query.status = 'available'; // Default to available non-expired food
    }

    // Ensure we only show unexpired food
    query.expiry_date_time = { $gt: now };

    if (category && category !== 'All') {
      query.food_type = category;
    }

    if (storage && storage !== 'All') {
      query.storage = storage;
    }

    if (search) {
      query.food_name = { $regex: search, $options: 'i' };
    }

    let listings = await DonorForm.find(query)
      .populate('donor_id')
      .sort({ expiry_date_time: 1 }); // Sort by urgency (earliest expiring first)

    // Calculate distance if lat and lng provided
    const userLat = parseFloat(lat) || 28.6139;
    const userLng = parseFloat(lng) || 77.2090;

    const formattedListings = listings.map(item => {
      const donorCoords = item.donor_id?.location?.coordinates || [77.2090, 28.6139];
      const dist = calculateDistance(userLat, userLng, donorCoords[1], donorCoords[0]);
      return {
        ...item.toObject(),
        distance_km: dist
      };
    });

    // Filter by max distance if requested (If slider at 100km or no items within 50km, return all available)
    let finalResult = formattedListings;
    if (maxDistance && parseFloat(maxDistance) < 100) {
      const maxDist = parseFloat(maxDistance);
      const filtered = formattedListings.filter(item => item.distance_km <= maxDist);
      if (filtered.length > 0) {
        finalResult = filtered;
      }
    }

    res.status(200).json(finalResult);
  } catch (error) {
    console.error('Get food listings error:', error);
    res.status(500).json({ message: 'Failed to fetch food listings' });
  }
};

// Get single food detail by ID
const getFoodById = async (req, res) => {
  try {
    const food = await DonorForm.findById(req.params.id).populate('donor_id');
    if (!food) {
      return res.status(404).json({ message: 'Food listing not found' });
    }

    const donorCoords = food.donor_id?.location?.coordinates || [77.2090, 28.6139];
    const dist = calculateDistance(28.6139, 77.2090, donorCoords[1], donorCoords[0]);

    const isExpired = new Date(food.expiry_date_time) < new Date();

    res.status(200).json({
      ...food.toObject(),
      distance_km: dist,
      is_expired: isExpired
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching food details' });
  }
};

module.exports = { createFoodListing, getFoodListings, getFoodById };
