const Ngo = require('../models/Ngo');
const Order = require('../models/Order');

const getNgoDashboard = async (req, res) => {
  try {
    let ngo = await Ngo.findOne({ userId: req.user.userId });
    if (!ngo) {
      ngo = await Ngo.findOne({ userId: req.user._id });
    }

    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    const claimedOrders = await Order.find({ ngo_id: ngo._id })
      .populate({
        path: 'donor_form_id',
        populate: { path: 'donor_id' }
      })
      .sort({ created_at: -1 });

    const totalMealsRescued = claimedOrders.reduce((acc, curr) => acc + (curr.serves || 0), 0);
    const activePickups = claimedOrders.filter(o => o.status === 'pending' || o.status === 'out_for_pickup');
    const completedPickups = claimedOrders.filter(o => o.status === 'delivered');

    res.status(200).json({
      ngo,
      metrics: {
        totalMealsRescued,
        activePickupsCount: activePickups.length,
        completedPickupsCount: completedPickups.length,
        peopleFed: Math.round(totalMealsRescued * 1.2)
      },
      orders: claimedOrders
    });
  } catch (error) {
    console.error('NGO dashboard error:', error);
    res.status(500).json({ message: 'Error loading NGO dashboard' });
  }
};

module.exports = { getNgoDashboard };
