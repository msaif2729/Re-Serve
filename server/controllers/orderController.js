const Order = require('../models/Order');
const DonorForm = require('../models/DonorForm');
const Ngo = require('../models/Ngo');
const Donor = require('../models/Donor');
const Receipt = require('../models/Receipt');
const Rating = require('../models/Rating');

// Helper to generate 4-6 digit numeric OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Claim a food listing (NGO action)
const claimOrder = async (req, res) => {
  try {
    const { donor_form_id, serves } = req.body;

    if (!donor_form_id) {
      return res.status(400).json({ message: 'Donor Form ID is required' });
    }

    const foodItem = await DonorForm.findById(donor_form_id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    if (foodItem.status !== 'available') {
      return res.status(400).json({ message: 'Food item is no longer available' });
    }

    // Find NGO associated with logged in user
    let ngo = await Ngo.findOne({ userId: req.user.userId });
    if (!ngo) {
      ngo = await Ngo.findOne({ userId: req.user._id }) || await Ngo.findOne();
    }

    if (!ngo) {
      return res.status(400).json({ message: 'NGO profile required to claim food' });
    }

    const otp = generateOtp();

    const order = new Order({
      donor_form_id: foodItem._id,
      ngo_id: ngo._id,
      serves: serves || foodItem.serves,
      OTP: otp,
      status: 'pending'
    });

    await order.save();

    // Mark food item as claimed
    foodItem.status = 'claimed';
    await foodItem.save();

    // Emit socket event
    if (req.io) {
      req.io.emit('order:claimed', { order, foodItem, ngo });
    }

    res.status(201).json({
      message: 'Food item claimed successfully! Provide your secret pickup OTP to donor upon pickup.',
      order: {
        ...order.toObject(),
        OTP: otp
      }
    });
  } catch (error) {
    console.error('Claim order error:', error);
    res.status(500).json({ message: 'Failed to claim order: ' + error.message });
  }
};

// Verify pickup OTP (Donor action)
const verifyOtp = async (req, res) => {
  try {
    const { order_id, otp } = req.body;

    if (!order_id || !otp) {
      return res.status(400).json({ message: 'Order ID and OTP are required' });
    }

    const order = await Order.findById(order_id).populate({
      path: 'donor_form_id',
      populate: { path: 'donor_id' }
    }).populate('ngo_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Order has already been verified and delivered' });
    }

    // Check if numeric OTP matches
    if (Number(order.OTP) !== Number(otp)) {
      return res.status(400).json({ message: 'Invalid OTP! Please check the code provided by the NGO.' });
    }

    // Update order status to delivered
    order.status = 'delivered';
    await order.save();

    // Update associated food form status to completed
    if (order.donor_form_id) {
      await DonorForm.findByIdAndUpdate(order.donor_form_id._id, { status: 'completed' });
    }

    // Create Receipt record
    const donorId = order.donor_form_id?.donor_id?._id || order.donor_form_id?.donor_id;
    let receipt = null;
    if (donorId && order.ngo_id) {
      receipt = new Receipt({
        order_id: order._id,
        donor_id: donorId,
        ngo_id: order.ngo_id._id,
        receipt_url: `/certificates/receipt_${order._id}.pdf`
      });
      await receipt.save();
    }

    // Broadcast Socket.io event for instant real-time sync across devices
    if (req.io) {
      req.io.emit('order:otp_verified', {
        orderId: order._id,
        status: 'delivered',
        receipt
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully! Food pickup confirmed and tax certificate unlocked.',
      order,
      receipt
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'OTP verification failed: ' + error.message });
  }
};

// Rate a completed order (NGO action)
const rateOrder = async (req, res) => {
  try {
    const { order_id, rating, feedback } = req.body;

    if (!order_id || !rating) {
      return res.status(400).json({ message: 'Order ID and rating score (1-5) are required' });
    }

    const order = await Order.findById(order_id).populate({
      path: 'donor_form_id',
      populate: { path: 'donor_id' }
    }).populate('ngo_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const donorId = order.donor_form_id?.donor_id?._id || order.donor_form_id?.donor_id;

    // Check if already rated
    let existingRating = await Rating.findOne({ order_id });
    if (existingRating) {
      existingRating.rating = Number(rating);
      existingRating.feedback = feedback || existingRating.feedback;
      await existingRating.save();
    } else {
      existingRating = new Rating({
        order_id,
        donor_id: donorId,
        ngo_id: order.ngo_id?._id,
        rating: Number(rating),
        feedback: feedback || ''
      });
      await existingRating.save();
    }

    // Update donor average rating
    if (donorId) {
      const allRatings = await Rating.find({ donor_id: donorId });
      const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      await Donor.findByIdAndUpdate(donorId, {
        average_rating: Number(avg.toFixed(1)),
        total_ratings: allRatings.length
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rating and review submitted successfully!',
      ratingRecord: existingRating
    });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({ message: 'Failed to submit rating: ' + error.message });
  }
};

// Get active & past orders
const getOrders = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};

    if (req.user?.role === 'donor') {
      const donor = await Donor.findOne({ userId: req.user.userId });
      if (donor) {
        const donorForms = await DonorForm.find({ donor_id: donor._id }).select('_id');
        const formIds = donorForms.map(f => f._id);
        query.donor_form_id = { $in: formIds };
      }
    } else if (req.user?.role === 'ngo') {
      const ngo = await Ngo.findOne({ userId: req.user.userId });
      if (ngo) {
        query.ngo_id = ngo._id;
      }
    }

    const orders = await Order.find(query)
      .populate({
        path: 'donor_form_id',
        populate: { path: 'donor_id' }
      })
      .populate('ngo_id')
      .sort({ created_at: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order detail
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'donor_form_id',
        populate: { path: 'donor_id' }
      })
      .populate('ngo_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const receipt = await Receipt.findOne({ order_id: order._id });
    const ratingRecord = await Rating.findOne({ order_id: order._id });

    res.status(200).json({
      order,
      receipt,
      ratingRecord
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
};

module.exports = { claimOrder, verifyOtp, rateOrder, getOrders, getOrderById };
